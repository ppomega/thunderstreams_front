import { useCallback, useEffect, useRef, useState } from "react";
import {
  Maximize, Minimize, Pause, PictureInPicture2, Play, RotateCcw, RotateCw,
  Settings, SkipForward, Volume1, Volume2, VolumeX,
} from "lucide-react";
import * as dashjs from "dashjs";
import Loader from "./loader.jsx";
import Options, { PLAYBACK_RATES } from "./options.jsx";
import "./player.css";

const SKIP_SECONDS = 10;
const HIDE_CONTROLS_MS = 3000;
const UP_NEXT_SECONDS = 8;
const PROGRESS_PREFIX = "ts-progress:";
const VOLUME_KEY = "ts-volume";

function formatTime(value) {
  if (!Number.isFinite(value) || value < 0) return "00:00";
  const seconds = Math.floor(value);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`
    : `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function readNumber(key, fallback) {
  try {
    const value = Number(localStorage.getItem(key));
    return localStorage.getItem(key) !== null && Number.isFinite(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function store(key, value) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, String(value));
  } catch { /* storage unavailable */ }
}

function Player(props) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const dashRef = useRef(null);
  const hideTimeout = useRef(null);
  const clickTimeout = useRef(null);
  const toastTimeout = useRef(null);
  const lastSaved = useRef(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(() => readNumber(VOLUME_KEY, 1));
  const [lastVolume, setLastVolume] = useState(1);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedEnd, setBufferedEnd] = useState(0);
  const [loader, setLoader] = useState(true);
  const [error, setError] = useState(null);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [qualities, setQualities] = useState([]);
  const [currentQualityId, setCurrentQualityId] = useState(null);
  const [autoQuality, setAutoQuality] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [audioTracks, setAudioTracks] = useState([]);
  const [activeAudioTrack, setActiveAudioTrack] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hover, setHover] = useState(null); // { x, time } over the seek bar
  const [toast, setToast] = useState(null);
  const [upNext, setUpNext] = useState(null); // seconds left before auto-advance
  const [reloadKey, setReloadKey] = useState(0);

  // Refs so stream callbacks always see the latest values without re-initialising.
  const onNextRef = useRef(props.onNext);
  const playbackRateRef = useRef(playbackRate);
  useEffect(() => { onNextRef.current = props.onNext; }, [props.onNext]);
  useEffect(() => { playbackRateRef.current = playbackRate; }, [playbackRate]);

  const flash = useCallback((message) => {
    setToast(message);
    clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setToast(null), 1200);
  }, []);

  // --- Stream setup -------------------------------------------------------
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !props.path) return undefined;

    const dashPlayer = dashjs.MediaPlayer().create();
    dashRef.current = dashPlayer;
    setLoader(true);
    setError(null);
    setUpNext(null);
    setCurrentTime(0);
    setDuration(0);
    setBufferedEnd(0);
    setQualities([]);
    setCurrentQualityId(null);
    setAutoQuality(true);
    setAudioTracks([]);
    setActiveAudioTrack(0);
    setOptionsOpen(false);

    dashPlayer.updateSettings({
      debug: { logLevel: dashjs.Debug.LOG_LEVEL_NONE },
      streaming: {
        abr: { autoSwitchBitrate: { video: true } },
        buffer: { fastSwitchEnabled: true },
      },
    });
    dashPlayer.initialize(video, `${import.meta.env.VITE_APP_API_URL}/${props.path}output.mpd`, true);
    video.volume = volume;
    video.muted = volume === 0;

    let resumed = false;
    const onStreamInitialized = () => {
      const reps = dashPlayer.getRepresentationsByType("video") || [];
      const availableAudio = dashPlayer.getTracksFor("audio") || [];
      const currentAudio = dashPlayer.getCurrentTrackFor("audio");
      const currentIndex = availableAudio.findIndex((track) =>
        currentAudio?.id != null ? track.id === currentAudio.id : track === currentAudio
      );
      setQualities(reps);
      setCurrentQualityId(dashPlayer.getCurrentRepresentationForType("video")?.id ?? null);
      setAudioTracks(availableAudio);
      setActiveAudioTrack(currentIndex >= 0 ? currentIndex : 0);
      const total = Number.isFinite(video.duration) ? video.duration : dashPlayer.duration() || 0;
      setDuration(total);
      dashPlayer.setPlaybackRate(playbackRateRef.current);

      // Resume where the viewer left off, unless they were basically at the end.
      const saved = readNumber(PROGRESS_PREFIX + props.path, 0);
      if (!resumed && saved > 15 && (!total || saved < total - 30)) {
        resumed = true;
        dashPlayer.seek(saved);
        flash(`Resumed from ${formatTime(saved)}`);
      }
    };
    const onQualityRendered = (event) => {
      if (event.mediaType === "video") setCurrentQualityId(event.newRepresentation?.id ?? null);
    };
    const onError = (event) => {
      const code = event?.error?.code;
      // Only treat fatal manifest / download failures as an error screen.
      if (code != null && code >= 10 && code < 40) {
        setError("This episode couldn't be loaded.");
        setLoader(false);
      }
    };
    const onTimeUpdate = () => {
      const now = video.currentTime || 0;
      setCurrentTime(now);
      if (Number.isFinite(video.duration)) setDuration(video.duration);
      if (Math.abs(now - lastSaved.current) >= 5) {
        lastSaved.current = now;
        store(PROGRESS_PREFIX + props.path, Math.floor(now));
      }
    };
    const onProgress = () => {
      const { buffered, currentTime: now } = video;
      for (let i = 0; i < buffered.length; i += 1) {
        if (buffered.start(i) <= now + 0.5 && buffered.end(i) >= now) {
          setBufferedEnd(buffered.end(i));
          return;
        }
      }
    };
    const onWaiting = () => setLoader(true);
    const onCanPlay = () => setLoader(false);
    const onPlay = () => { setIsPlaying(true); setUpNext(null); };
    const onPause = () => {
      setIsPlaying(false);
      store(PROGRESS_PREFIX + props.path, Math.floor(video.currentTime || 0));
    };
    const onEnded = () => {
      setIsPlaying(false);
      store(PROGRESS_PREFIX + props.path, null);
      setUpNext(onNextRef.current ? UP_NEXT_SECONDS : null);
    };

    dashPlayer.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, onStreamInitialized);
    dashPlayer.on(dashjs.MediaPlayer.events.QUALITY_CHANGE_RENDERED, onQualityRendered);
    dashPlayer.on(dashjs.MediaPlayer.events.ERROR, onError);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("progress", onProgress);
    video.addEventListener("timeupdate", onProgress);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("seeking", onWaiting);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("playing", onCanPlay);
    video.addEventListener("seeked", onCanPlay);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);

    return () => {
      if (!video.ended && video.currentTime > 0) store(PROGRESS_PREFIX + props.path, Math.floor(video.currentTime));
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("progress", onProgress);
      video.removeEventListener("timeupdate", onProgress);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("seeking", onWaiting);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("playing", onCanPlay);
      video.removeEventListener("seeked", onCanPlay);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
      dashPlayer.reset();
      if (dashRef.current === dashPlayer) dashRef.current = null;
    };
    // volume is applied once per stream; later changes go straight to the element.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.path, reloadKey, flash]);

  // --- Up-next countdown --------------------------------------------------
  useEffect(() => {
    if (upNext === null) return undefined;
    if (upNext <= 0) {
      setUpNext(null);
      onNextRef.current?.();
      return undefined;
    }
    const timer = setTimeout(() => setUpNext((value) => (value === null ? null : value - 1)), 1000);
    return () => clearTimeout(timer);
  }, [upNext]);

  // --- Fullscreen tracking ------------------------------------------------
  useEffect(() => {
    const onFullscreenChange = () => {
      const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
      setIsFullscreen(fullscreenElement === containerRef.current);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("webkitfullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", onFullscreenChange);
    };
  }, []);

  useEffect(() => () => {
    clearTimeout(hideTimeout.current);
    clearTimeout(clickTimeout.current);
    clearTimeout(toastTimeout.current);
  }, []);

  // --- Controls visibility ------------------------------------------------
  const showControls = useCallback(() => {
    setControlsVisible(true);
    clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => setControlsVisible(false), HIDE_CONTROLS_MS);
  }, []);

  // Controls stay up while paused, while the menu is open, and on errors.
  const controlsShown = controlsVisible || !isPlaying || optionsOpen || !!error || upNext !== null;

  // --- Actions ------------------------------------------------------------
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused || video.ended) video.play().catch(() => {});
    else video.pause();
  }, []);

  const seekTo = useCallback((time) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(time)) return;
    const total = Number.isFinite(video.duration) ? video.duration : duration;
    const next = Math.max(0, Math.min(time, total || time));
    video.currentTime = next;
    setCurrentTime(next);
  }, [duration]);

  const skip = useCallback((seconds) => {
    const video = videoRef.current;
    if (!video) return;
    seekTo(video.currentTime + seconds);
    flash(`${seconds > 0 ? "+" : "−"}${Math.abs(seconds)}s`);
  }, [seekTo, flash]);

  const applyVolume = useCallback((next) => {
    const value = Math.max(0, Math.min(1, Math.round(next * 100) / 100));
    if (videoRef.current) {
      videoRef.current.volume = value;
      videoRef.current.muted = value === 0;
    }
    setVolume(value);
    if (value > 0) setLastVolume(value);
    store(VOLUME_KEY, value);
    return value;
  }, []);

  const toggleMute = useCallback(() => {
    const value = applyVolume(volume > 0 ? 0 : lastVolume || 1);
    flash(value === 0 ? "Muted" : `Volume ${Math.round(value * 100)}%`);
  }, [applyVolume, volume, lastVolume, flash]);

  const toggleFullscreen = useCallback(async () => {
    const container = containerRef.current;
    try {
      if ((document.fullscreenElement || document.webkitFullscreenElement) === container) {
        if (document.exitFullscreen) await document.exitFullscreen();
        else document.webkitExitFullscreen?.();
      } else if (container?.requestFullscreen) {
        await container.requestFullscreen();
      } else if (container?.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      } else {
        videoRef.current?.webkitEnterFullscreen?.(); // iOS Safari
      }
    } catch {
      // Fullscreen may be unavailable or denied by the browser.
    }
  }, []);

  const togglePip = useCallback(async () => {
    try {
      if (document.pictureInPictureElement) await document.exitPictureInPicture();
      else await videoRef.current?.requestPictureInPicture();
    } catch { /* not supported */ }
  }, []);

  const changeRate = useCallback((rate) => {
    setPlaybackRate(rate);
    dashRef.current?.setPlaybackRate(rate);
    flash(rate === 1 ? "Normal speed" : `${rate}×`);
  }, [flash]);

  const selectQuality = (quality) => {
    const dashPlayer = dashRef.current;
    if (!dashPlayer) return;
    if (!quality) {
      dashPlayer.updateSettings({ streaming: { abr: { autoSwitchBitrate: { video: true } } } });
      setAutoQuality(true);
      return;
    }
    dashPlayer.updateSettings({ streaming: { abr: { autoSwitchBitrate: { video: false } } } });
    dashPlayer.setRepresentationForTypeById("video", quality.id, true);
    setAutoQuality(false);
    setCurrentQualityId(quality.id);
  };

  // Single click toggles play; double click toggles fullscreen without the
  // play state flickering.
  const onSurfaceClick = () => {
    showControls();
    if (optionsOpen) {
      setOptionsOpen(false);
      return;
    }
    clearTimeout(clickTimeout.current);
    clickTimeout.current = setTimeout(togglePlay, 220);
  };
  const onSurfaceDoubleClick = () => {
    clearTimeout(clickTimeout.current);
    toggleFullscreen();
  };

  // --- Keyboard shortcuts -------------------------------------------------
  useEffect(() => {
    const onKeyDown = (event) => {
      const target = event.target;
      const tag = target?.tagName;
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (target?.isContentEditable || tag === "TEXTAREA" || (tag === "INPUT" && target.type !== "range")) return;
      const video = videoRef.current;
      if (!video) return;

      let handled = true;
      switch (event.key) {
        case " ":
        case "k":
        case "K":
          if (tag === "BUTTON" && event.key === " ") { handled = false; break; }
          togglePlay();
          break;
        case "ArrowLeft":
        case "j":
        case "J":
          skip(-SKIP_SECONDS);
          break;
        case "ArrowRight":
        case "l":
        case "L":
          skip(SKIP_SECONDS);
          break;
        case "ArrowUp": {
          const value = applyVolume(video.volume + 0.05);
          flash(`Volume ${Math.round(value * 100)}%`);
          break;
        }
        case "ArrowDown": {
          const value = applyVolume(video.volume - 0.05);
          flash(value === 0 ? "Muted" : `Volume ${Math.round(value * 100)}%`);
          break;
        }
        case "m":
        case "M":
          toggleMute();
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
        case "N":
          if (event.shiftKey && onNextRef.current) onNextRef.current();
          else handled = false;
          break;
        case ">":
        case "<": {
          const index = PLAYBACK_RATES.indexOf(playbackRateRef.current);
          const next = PLAYBACK_RATES[Math.max(0, Math.min(PLAYBACK_RATES.length - 1, index + (event.key === ">" ? 1 : -1)))];
          changeRate(next);
          break;
        }
        case "Escape":
          if (optionsOpen) setOptionsOpen(false);
          else handled = false;
          break;
        default:
          if (/^[0-9]$/.test(event.key) && Number.isFinite(video.duration)) {
            seekTo((Number(event.key) / 10) * video.duration);
          } else {
            handled = false;
          }
      }
      if (handled) {
        event.preventDefault();
        showControls();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [togglePlay, skip, applyVolume, toggleMute, toggleFullscreen, changeRate, seekTo, showControls, flash, optionsOpen]);

  // --- Seek bar hover preview --------------------------------------------
  const onProgressHover = (event) => {
    if (!duration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    setHover({ x: ratio * 100, time: ratio * duration });
  };

  const played = duration ? (currentTime / duration) * 100 : 0;
  const buffered = duration ? Math.min(100, (bufferedEnd / duration) * 100) : 0;
  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  const pipSupported = typeof document !== "undefined" && document.pictureInPictureEnabled;

  return (
    <div className="player-frame">
      <div className="player-video-wrap">
        <div
          className={`player-video-shell relative rounded-md border border-line${controlsShown ? "" : " is-idle"}`}
          ref={containerRef}
          onPointerMove={showControls}
          onPointerDown={showControls}
          onMouseLeave={() => isPlaying && setControlsVisible(false)}
        >
          <video
            ref={videoRef}
            className="w-full h-full rounded-md shadow-md bg-black"
            playsInline
          />

          {/* Click surface sits under the controls so they stay clickable. */}
          <div className="player-surface" onClick={onSurfaceClick} onDoubleClick={onSurfaceDoubleClick} />

          {loader && !error && <Loader />}
          {toast && <div className="player-toast" role="status">{toast}</div>}

          {error && (
            <div className="player-error" role="alert">
              <p>{error}</p>
              <button type="button" onClick={() => setReloadKey((key) => key + 1)}>Try again</button>
            </div>
          )}

          {upNext !== null && props.nextEpisode && (
            <div className="player-up-next" role="status">
              <span className="player-up-next-label">Up next in {upNext}s</span>
              <span className="player-up-next-title">
                {props.nextEpisode.title || `Episode ${props.episodeNumber + 1}`}
              </span>
              <div className="player-up-next-actions">
                <button type="button" className="is-primary" onClick={() => { setUpNext(null); props.onNext?.(); }}>
                  <SkipForward size={16} /> Play now
                </button>
                <button type="button" onClick={() => setUpNext(null)}>Cancel</button>
              </div>
            </div>
          )}

          <div className={`player-control-overlay${controlsShown ? " is-visible" : ""}`}>
            <div className="player-video-title">
              {props.episodeNumber ? `E${props.episodeNumber} · ` : ""}{props.info1.title}
            </div>

            {!isPlaying && !loader && !error && upNext === null && (
              <button type="button" className="player-center-play" aria-label="Play" onClick={togglePlay}>
                <Play size={30} fill="currentColor" />
              </button>
            )}

            <div className="player-controls">
              <div
                className="player-progress-wrap"
                onPointerMove={onProgressHover}
                onPointerLeave={() => setHover(null)}
                style={{ "--played": `${played}%`, "--buffered": `${buffered}%` }}
              >
                <div className="player-progress-track">
                  <div className="player-progress-buffered" />
                  <div className="player-progress-played" />
                  {hover && <div className="player-progress-hover" style={{ width: `${hover.x}%` }} />}
                </div>
                {hover && (
                  <div className="player-progress-tooltip" style={{ left: `${hover.x}%` }}>
                    {formatTime(hover.time)}
                  </div>
                )}
                <input
                  className="player-progress"
                  aria-label="Seek"
                  aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
                  min="0"
                  max={duration || 0}
                  step="0.1"
                  value={Math.min(currentTime, duration || 0)}
                  type="range"
                  onChange={(event) => seekTo(Number(event.target.value))}
                />
              </div>

              <div className="player-control-row">
                <div className="player-control-group">
                  <button type="button" className="player-control-button" onClick={togglePlay} aria-label={isPlaying ? "Pause (k)" : "Play (k)"} title={isPlaying ? "Pause (k)" : "Play (k)"}>
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                  </button>
                  <button type="button" className="player-control-button" onClick={() => skip(-SKIP_SECONDS)} aria-label="Back 10 seconds" title="Back 10s (←)">
                    <RotateCcw size={19} />
                  </button>
                  <button type="button" className="player-control-button" onClick={() => skip(SKIP_SECONDS)} aria-label="Forward 10 seconds" title="Forward 10s (→)">
                    <RotateCw size={19} />
                  </button>
                  {props.onNext && (
                    <button type="button" className="player-control-button" onClick={props.onNext} aria-label="Next episode" title="Next episode (Shift+N)">
                      <SkipForward size={19} fill="currentColor" />
                    </button>
                  )}
                  <div className="player-volume-group">
                    <button type="button" className="player-control-button" onClick={toggleMute} aria-label={volume === 0 ? "Unmute (m)" : "Mute (m)"} title={volume === 0 ? "Unmute (m)" : "Mute (m)"}>
                      <VolumeIcon size={20} />
                    </button>
                    <input
                      className="player-volume"
                      type="range"
                      aria-label="Volume"
                      min="0"
                      max="1"
                      step="0.05"
                      value={volume}
                      style={{ "--volume": `${volume * 100}%` }}
                      onChange={(event) => applyVolume(Number(event.target.value))}
                    />
                  </div>
                  <span className="player-time">{formatTime(currentTime)} / {formatTime(duration)}</span>
                </div>

                <div className="player-control-group player-control-actions">
                  {playbackRate !== 1 && <span className="player-rate-badge">{playbackRate}×</span>}
                  <button
                    type="button"
                    className={`player-control-button${optionsOpen ? " is-active" : ""}`}
                    onClick={() => setOptionsOpen((open) => !open)}
                    aria-label="Playback settings"
                    aria-expanded={optionsOpen}
                    title="Settings"
                  >
                    <Settings size={20} className={optionsOpen ? "is-spun" : ""} />
                  </button>
                  {pipSupported && (
                    <button type="button" className="player-control-button" onClick={togglePip} aria-label="Picture in picture" title="Picture in picture">
                      <PictureInPicture2 size={19} />
                    </button>
                  )}
                  <button type="button" className="player-control-button" onClick={toggleFullscreen} aria-label={isFullscreen ? "Exit fullscreen (f)" : "Enter fullscreen (f)"} title={isFullscreen ? "Exit fullscreen (f)" : "Fullscreen (f)"}>
                    {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                  </button>
                </div>
              </div>
            </div>

            {optionsOpen && (
              <Options
                qualities={qualities}
                currentQualityId={currentQualityId}
                autoQuality={autoQuality}
                onSelectQuality={selectQuality}
                playbackRate={playbackRate}
                onSelectRate={changeRate}
                audioTracks={audioTracks}
                activeAudioTrack={activeAudioTrack}
                onSelectAudioTrack={(track, index) => {
                  dashRef.current?.setCurrentTrack(track);
                  setActiveAudioTrack(index);
                }}
              />
            )}
          </div>
        </div>
      </div>
      <div className="player-description text-2xl font-semibold my-3 mx-3">
        Ep {props.episodeNumber ? `${props.episodeNumber} – ` : "– "}{props.info1.title}
      </div>
      <div className="player-description text-base my-3 mx-3">
        {props.info1.description}
      </div>
      {props.info1.releaseDate && (
        <div className="player-description text-sm my-3 mx-3">
          Release: {props.info1.releaseDate}
        </div>
      )}
    </div>
  );
}

export default Player;
