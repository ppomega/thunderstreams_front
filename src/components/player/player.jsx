import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Maximize, Minimize, Pause, Play, Settings, Volume2, VolumeX } from "lucide-react";
import * as dashjs from "dashjs";
import Loader from "./loader.jsx";
import Options from "./options.jsx";
import "./player.css";

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

function Player(props) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const dashRef = useRef(null);
  const displayTimeout = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [lastVolume, setLastVolume] = useState(1);
  const [display, setDisplay] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loader, setLoader] = useState(true);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [qualityLevels, setQualityLevels] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);
  const [activeAudioTrack, setActiveAudioTrack] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const dashPlayer = dashjs.MediaPlayer().create();
    dashRef.current = dashPlayer;
    setLoader(true);
    setQualityLevels([]);
    setAudioTracks([]);
    setActiveAudioTrack(0);
    dashPlayer.initialize(video, `${import.meta.env.VITE_APP_API_URL}/${props.path}output.mpd`, true);
    dashPlayer.updateSettings({
      debug: { logLevel: dashjs.Debug.LOG_LEVEL_NONE },
      streaming: { abr: { autoSwitchBitrate: { video: false } } },
    });

    const onStreamInitialized = () => {
      const videoTracks = dashPlayer.getTracksFor("video") || [];
      const availableAudio = dashPlayer.getTracksFor("audio") || [];
      const currentAudio = dashPlayer.getCurrentTrackFor("audio");
      const currentIndex = availableAudio.findIndex((track) =>
        currentAudio?.id != null ? track.id === currentAudio.id : track === currentAudio
      );
      setQualityLevels(videoTracks[0]?.bitrateList || []);
      setAudioTracks(availableAudio);
      setActiveAudioTrack(currentIndex >= 0 ? currentIndex : 0);
      setDuration(Number.isFinite(video.duration) ? video.duration : dashPlayer.duration() || 0);
      setLoader(false);
    };
    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime || 0);
      if (Number.isFinite(video.duration)) setDuration(video.duration);
    };
    const onWaiting = () => setLoader(true);
    const onCanPlay = () => setLoader(false);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    dashPlayer.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, onStreamInitialized);
    dashPlayer.on(dashjs.MediaPlayer.events.QUALITY_CHANGE_REQUESTED, onWaiting);
    dashPlayer.on(dashjs.MediaPlayer.events.QUALITY_CHANGE_RENDERED, onCanPlay);
    dashPlayer.on(dashjs.MediaPlayer.events.PLAYBACK_SEEKING, onWaiting);
    dashPlayer.on(dashjs.MediaPlayer.events.PLAYBACK_SEEKED, onCanPlay);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      dashPlayer.reset();
      if (dashRef.current === dashPlayer) dashRef.current = null;
    };
  }, [props.path]);

  useEffect(() => () => clearTimeout(displayTimeout.current), []);

  useEffect(() => {
    const onFullscreenChange = () => {
      const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
      setIsFullscreen(fullscreenElement === containerRef.current);
      setDisplay(true);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("webkitfullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", onFullscreenChange);
    };
  }, []);

  const showControls = () => {
    setDisplay(true);
    clearTimeout(displayTimeout.current);
    displayTimeout.current = setTimeout(() => setDisplay(false), 4000);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  const seek = (event) => {
    const nextTime = (Number(event.target.value) / 100) * duration;
    if (videoRef.current && Number.isFinite(nextTime)) {
      videoRef.current.currentTime = nextTime;
      setCurrentTime(nextTime);
    }
  };

  const changeVolume = (event) => {
    const nextVolume = Number(event.target.value);
    if (!videoRef.current) return;
    videoRef.current.volume = nextVolume;
    videoRef.current.muted = nextVolume === 0;
    setVolume(nextVolume);
    if (nextVolume > 0) setLastVolume(nextVolume);
  };

  const toggleMute = (event) => {
    event.stopPropagation();
    const nextVolume = volume > 0 ? 0 : lastVolume || 1;
    if (volume > 0) setLastVolume(volume);
    if (videoRef.current) {
      videoRef.current.muted = nextVolume === 0;
      videoRef.current.volume = nextVolume;
    }
    setVolume(nextVolume);
  };

  const toggleFullscreen = async (event) => {
    event.stopPropagation();
    try {
      if (document.fullscreenElement === containerRef.current) {
        await document.exitFullscreen();
      } else if (containerRef.current?.requestFullscreen) {
        await containerRef.current.requestFullscreen();
      } else if (containerRef.current?.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      }
    } catch {
      // Fullscreen may be unavailable or denied by the browser.
    }
  };

  return (
    <div className="player-frame">
      <div className="player-video-wrap">
        <div
          className="player-video-shell relative rounded-md border border-gray-700"
          ref={containerRef}
          onPointerMove={showControls}
          onMouseLeave={() => setDisplay(false)}
        >
          <video
            ref={videoRef}
            onClick={() => { showControls(); togglePlay(); }}
            className="w-full h-full rounded-md shadow-md bg-black"
            playsInline
          />
          {loader && <Loader />}
          {display && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="player-control-overlay"
              onClick={togglePlay}
            >
              <div className="player-video-title">{props.info1.title}</div>
              {!isPlaying && (
                <button
                  type="button"
                  className="player-center-play"
                  aria-label="Play"
                  onClick={(event) => { event.stopPropagation(); togglePlay(); }}
                >
                  <Play size={30} fill="currentColor" />
                </button>
              )}

              <div className="player-controls" onClick={(event) => event.stopPropagation()}>
                <input
                  className="player-progress"
                  aria-label="Seek"
                  min="0"
                  max="100"
                  value={duration ? (currentTime / duration) * 100 : 0}
                  type="range"
                  onChange={seek}
                />
                <div className="player-control-row">
                  <div className="player-control-group">
                    <button type="button" className="player-control-button" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
                      {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                    </button>
                    <span className="player-time">{formatTime(currentTime)} / {formatTime(duration)}</span>
                  </div>
                  <div className="player-control-group player-control-actions">
                    <button type="button" className="player-control-button" onClick={toggleMute} aria-label={volume === 0 ? "Unmute" : "Mute"}>
                      {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <input
                      className="player-volume"
                      type="range"
                      aria-label="Volume"
                      min="0"
                      max="1"
                      step="0.05"
                      value={volume}
                      onChange={changeVolume}
                    />
                    <button
                      type="button"
                      className={`player-control-button${optionsOpen ? " is-active" : ""}`}
                      onClick={() => setOptionsOpen((open) => !open)}
                      aria-label="Playback settings"
                      aria-expanded={optionsOpen}
                    >
                      <Settings size={20} />
                    </button>
                    <button type="button" className="player-control-button" onClick={toggleFullscreen} aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
                      {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              {optionsOpen && (
                <Options
                  options={qualityLevels}
                  audioTracks={audioTracks}
                  activeAudioTrack={activeAudioTrack}
                  onSelectAudioTrack={(track, index) => {
                    dashRef.current?.setCurrentTrack(track);
                    setActiveAudioTrack(index);
                  }}
                  select={dashRef}
                />
              )}
            </motion.div>
          )}
        </div>
      </div>
      <div className="player-description text-2xl font-semibold my-3 mx-3">
        Ep- {props.info1.title}
      </div>
      <div className="player-description text-base my-3 mx-3">
        {props.info1.description}
      </div>
      <div className="player-description text-sm my-3 mx-3">
        Release: {props.info1.releaseDate}
      </div>
    </div>
  );
}

export default Player;
