import { useEffect, useRef, useState } from "react";

// Frames are grabbed client-side from one DASH chunk (the init segment plus a
// single media segment of the lowest video rendition) because the server has
// no thumbnail endpoint. Results are cached in memory and localStorage.
const API = import.meta.env.VITE_APP_API_URL;
const CACHE_PREFIX = "ts-thumb:";
const MAX_CONCURRENT = 2;
const TIMEOUT_MS = 20000;
const THUMB_WIDTH = 480;

const memoryCache = new Map(); // path -> Promise<string | null>
const queue = [];
let active = 0;

function readStored(path) {
  try {
    return localStorage.getItem(CACHE_PREFIX + path);
  } catch {
    return null;
  }
}

function writeStored(path, dataUrl) {
  try {
    localStorage.setItem(CACHE_PREFIX + path, dataUrl);
  } catch {
    // Storage full or unavailable: drop some older thumbnails and move on.
    try {
      Object.keys(localStorage)
        .filter((key) => key.startsWith(CACHE_PREFIX))
        .slice(0, 20)
        .forEach((key) => localStorage.removeItem(key));
    } catch { /* ignore */ }
  }
}

function runNext() {
  if (active >= MAX_CONCURRENT || queue.length === 0) return;
  active += 1;
  const { path, resolve } = queue.shift();
  captureFrame(path)
    .then(resolve, (error) => {
      console.warn("Thumbnail capture failed for", path, error);
      resolve(null);
    })
    .finally(() => {
      active -= 1;
      runNext();
    });
}

function parseDuration(value) {
  // ISO 8601 duration, e.g. PT23M41.5S
  const match = /P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:([\d.]+)S)?/.exec(value || "");
  if (!match) return 0;
  const [, d = 0, h = 0, m = 0, sec = 0] = match;
  return Number(d) * 86400 + Number(h) * 3600 + Number(m) * 60 + Number(sec);
}

function childOf(node, tag) {
  return node ? [...node.children].find((child) => child.localName === tag) || null : null;
}

function fillTemplate(template, vars) {
  return template
    .replace(/\$(RepresentationID|Number|Time|Bandwidth)(?:%0(\d+)d)?\$/g, (_, key, pad) => {
      const value = String(vars[key]);
      return pad ? value.padStart(Number(pad), "0") : value;
    })
    .replace(/\$\$/g, "$");
}

// Works out the init segment and the single media chunk to fetch.
function pickSegments(mpdText, manifestUrl) {
  const doc = new DOMParser().parseFromString(mpdText, "application/xml");
  const mpd = doc.documentElement;
  const period = [...doc.getElementsByTagName("Period")][0];
  if (!mpd || mpd.localName !== "MPD" || !period) throw new Error("invalid manifest");

  const duration = parseDuration(
    mpd.getAttribute("mediaPresentationDuration") || period.getAttribute("duration")
  );
  // Skip past intros/black frames, but don't go too deep into the episode.
  const target = duration ? Math.min(Math.max(duration * 0.15, 5), 180, duration - 1) : 5;

  const reps = [...period.getElementsByTagName("AdaptationSet")].flatMap((set) => {
    const setType = `${set.getAttribute("contentType") || ""} ${set.getAttribute("mimeType") || ""}`;
    return [...set.getElementsByTagName("Representation")]
      .filter((rep) => `${setType} ${rep.getAttribute("mimeType") || ""}`.includes("video"))
      .map((rep) => ({ rep, set }));
  });
  if (!reps.length) throw new Error("no video representation");
  reps.sort((a, b) => Number(a.rep.getAttribute("bandwidth")) - Number(b.rep.getAttribute("bandwidth")));
  const { rep, set } = reps[0];

  const template = childOf(rep, "SegmentTemplate") || childOf(set, "SegmentTemplate") || childOf(period, "SegmentTemplate");
  if (!template) throw new Error("no SegmentTemplate");
  const timescale = Number(template.getAttribute("timescale")) || 1;
  const startNumber = Number(template.getAttribute("startNumber") ?? 1);
  const vars = { RepresentationID: rep.getAttribute("id"), Bandwidth: rep.getAttribute("bandwidth") };

  let number = startNumber;
  let time = 0;
  const timeline = childOf(template, "SegmentTimeline");
  if (timeline) {
    const targetTicks = target * timescale;
    let found = false;
    for (const entry of timeline.children) {
      if (entry.hasAttribute("t")) time = Number(entry.getAttribute("t"));
      const d = Number(entry.getAttribute("d"));
      const repeat = Number(entry.getAttribute("r") || 0);
      for (let i = 0; i <= repeat && !found; i += 1) {
        if (time + d > targetTicks) found = true;
        else {
          time += d;
          number += 1;
        }
      }
      if (found) break;
    }
    if (!found) {
      number = startNumber;
      time = 0;
    }
  } else {
    const segDuration = Number(template.getAttribute("duration")) / timescale;
    if (segDuration) {
      const index = Math.floor(target / segDuration);
      number = startNumber + index;
      time = index * segDuration * timescale;
    }
  }

  const base = new URL(manifestUrl, window.location.href);
  const initUrl = new URL(fillTemplate(template.getAttribute("initialization"), vars), base).href;
  const mediaUrl = new URL(
    fillTemplate(template.getAttribute("media"), { ...vars, Number: number, Time: time }),
    base
  ).href;
  const mime = rep.getAttribute("mimeType") || set.getAttribute("mimeType") || "video/mp4";
  const codecs = rep.getAttribute("codecs") || set.getAttribute("codecs");
  return { initUrl, mediaUrl, type: codecs ? `${mime}; codecs="${codecs}"` : mime };
}

async function fetchBuffer(url, signal) {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`${response.status} for ${url}`);
  return response.arrayBuffer();
}

function appendBuffer(sourceBuffer, data) {
  return new Promise((resolve, reject) => {
    sourceBuffer.addEventListener("updateend", resolve, { once: true });
    sourceBuffer.addEventListener("error", () => reject(new Error("append failed")), { once: true });
    sourceBuffer.appendBuffer(data);
  });
}

function waitFor(target, event) {
  return new Promise((resolve) => target.addEventListener(event, resolve, { once: true }));
}

async function captureFrame(path) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  let objectUrl;

  try {
    const manifestUrl = `${API}/${path}output.mpd`;
    const manifest = await fetch(manifestUrl, { signal: controller.signal });
    if (!manifest.ok) throw new Error(`${manifest.status} for manifest`);
    const { initUrl, mediaUrl, type } = pickSegments(await manifest.text(), manifestUrl);
    if (!window.MediaSource || !MediaSource.isTypeSupported(type)) throw new Error(`unsupported ${type}`);

    // Only two requests: the init segment and one media chunk.
    const [init, media] = await Promise.all([
      fetchBuffer(initUrl, controller.signal),
      fetchBuffer(mediaUrl, controller.signal),
    ]);

    const mediaSource = new MediaSource();
    objectUrl = URL.createObjectURL(mediaSource);
    video.src = objectUrl;
    await waitFor(mediaSource, "sourceopen");
    const sourceBuffer = mediaSource.addSourceBuffer(type);
    await appendBuffer(sourceBuffer, init);
    await appendBuffer(sourceBuffer, media);
    if (!video.buffered.length) throw new Error("nothing buffered");

    // Land a little inside the chunk so the decoder has a frame to show.
    const start = video.buffered.start(0);
    const end = video.buffered.end(0);
    const seeked = waitFor(video, "seeked");
    video.currentTime = Math.min(start + 0.5, (start + end) / 2);
    await seeked;
    if (video.readyState < 2) await waitFor(video, "loadeddata");
    if (video.requestVideoFrameCallback) {
      await new Promise((resolve) => {
        video.requestVideoFrameCallback(resolve);
        setTimeout(resolve, 500); // may not fire on a paused element
      });
    }

    if (!video.videoWidth) throw new Error("no video frame");
    const scale = Math.min(1, THUMB_WIDTH / video.videoWidth);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.72);
  } finally {
    clearTimeout(timer);
    controller.abort();
    video.removeAttribute("src");
    video.load();
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  }
}

function getThumbnail(path) {
  if (memoryCache.has(path)) return memoryCache.get(path);
  const stored = readStored(path);
  const promise = stored
    ? Promise.resolve(stored)
    : new Promise((resolve) => {
        queue.push({ path, resolve });
        runNext();
      }).then((dataUrl) => {
        if (dataUrl) writeStored(path, dataUrl);
        else memoryCache.delete(path); // allow a retry on a later mount
        return dataUrl;
      });
  memoryCache.set(path, promise);
  return promise;
}

/**
 * Returns [ref, thumbnailDataUrl]. Attach ref to the element that holds the
 * thumbnail; generation starts once it scrolls near the viewport.
 */
export default function useVideoThumbnail(path) {
  const ref = useRef(null);
  const [thumbnail, setThumbnail] = useState(() => (path ? readStored(path) : null));

  useEffect(() => {
    if (!path) return undefined;
    const stored = readStored(path);
    setThumbnail(stored);
    if (stored) return undefined;

    let cancelled = false;
    const start = () => {
      getThumbnail(path).then((dataUrl) => {
        if (!cancelled && dataUrl) setThumbnail(dataUrl);
      });
    };

    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      start();
      return () => { cancelled = true; };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          start();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(element);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [path]);

  return [ref, thumbnail];
}
