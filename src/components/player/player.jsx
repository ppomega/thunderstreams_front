import React, { useRef, useState, useEffect } from "react";
import { motion, useAnimate } from "framer-motion";
import Options from "./options.jsx";
import * as dashjs from "dashjs";
import Loader from "./loader.jsx";
const Player = (props) => {
  const [visible, setVisibility] = useState(false);
  const [loader, isLoading] = useState(false);
  const [duration, setDuration] = useState(null);
  const [playhead, animate] = useAnimate();
  const [clickPosition, setClickPosition] = useState(0);
  const [options, showOptions] = useState(false);
  const [prog, setProg] = useState(0);
  const videoRef = useRef(null);
  const dis = useRef(null);
  const [pos, setPos] = useState(0);
  const [qualityLevels, setQ] = useState([]);
  const select = useRef();
  useEffect(() => {
    if (videoRef.current) {
      const videoElement = videoRef.current;

      const dashPlayer = dashjs.MediaPlayer().create();
      select.current = dashPlayer;
      dashPlayer.initialize(
        videoElement,
        `${import.meta.env.VITE_APP_API_URL}/${props.path}output.mpd`,
        true
      );
      dashPlayer.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, () => {
        setQ(dashPlayer.getTracksFor("video")[0].bitrateList);
      });
      dashPlayer.on(dashjs.MediaPlayer.events.PLAYBACK_SEEKING, function (e) {
        isLoading(true);
      });
      dashPlayer.on(dashjs.MediaPlayer.events.PLAYBACK_SEEKED, function (e) {
        isLoading(false);
      });

      dashPlayer.updateSettings({
        debug: {
          logLevel: dashjs.Debug.LOG_LEVEL_NONE, // Disable logging
        },
        streaming: {
          abr: {
            autoSwitchBitrate: { video: false },
          },
        },
      });
      dashPlayer.on(dashjs.MediaPlayer.events.QUALITY_CHANGE_REQUESTED, () => {
        isLoading(true);
      });
      dashPlayer.on(dashjs.MediaPlayer.events.QUALITY_CHANGE_RENDERED, () => {
        isLoading(false);
      });
      dashPlayer.on(dashjs.MediaPlayer.events.PLAYBACK_PAUSED, function () {
        setIsPlaying(false);
      });
      dashPlayer.on(dashjs.MediaPlayer.events.PLAYBACK_PLAYING, function () {
        setIsPlaying(true);
      });
      const handleMetadataLoaded = async () => {
        setDuration(videoElement.duration);
      };
      videoRef.current.addEventListener("pause", () => {
        const progress =
          (videoElement.currentTime / videoElement.duration) * 100;
        setProg(progress);
      });
      videoRef.current.addEventListener("timeupdate", () => {
        if (playhead.current) {
          const progress =
            (videoElement.currentTime / videoElement.duration) * 100;

          animate(
            playhead.current,
            { width: `${progress}%` },
            { duration: 0.1 }
          );
        }
      });
      videoElement.addEventListener("loadedmetadata", handleMetadataLoaded);

      return () => {
        videoElement.removeEventListener(
          "loadedmetadata",
          handleMetadataLoaded
        );
      };
    }
  }, [props.path]);

  const handleClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left; // X position within the div
    const r = (x / rect.width) * duration;
    setClickPosition(x);
    videoRef.current.currentTime = r;
  };
  const slider = useRef(null);
  const vref = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [display, setDisplay] = useState(false);
  const togglePlay = () => {
    if (!videoRef.current.paused) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  function Display() {
    setDisplay(true);
    setTimeout(() => {
      setDisplay(false);
    }, 3000);
  }
  function Playhead(e) {
    setPos(e.clientX);
  }
  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
  };
  function option(e) {
    e.preventDefault();
    showOptions(!options);
  }
  const enterFullscreen = () => {
    if (vref.current.requestFullscreen) {
      vref.current.requestFullscreen();
    } else if (vref.current.webkitRequestFullscreen) {
      vref.current.webkitRequestFullscreen();
    } else if (vref.current.mozRequestFullScreen) {
      vref.current.mozRequestFullScreen();
    } else if (vref.current.msRequestFullscreen) {
      vref.current.msRequestFullscreen();
    }
  };

  return (
    <div className="w-2/3">
      {" "}
      <div
        className="w-full relative top-0 left-0 px-3  rounded-2xl"
        ref={vref}
      >
        {" "}
        <video
          onMouseMove={() => {
            Display();
          }}
          onClick={() => {
            Display();
            togglePlay();
          }}
          ref={videoRef}
          className="w-full rounded-md shadow-md "
        />
        {loader ? <Loader /> : <></>}
        {display ? (
          <div
            ref={dis}
            onClick={() => {
              togglePlay();
            }}
            className="absolute top-0 left-0 bottom-0 right-0 h-full rounded-sm bg-black/45 "
          >
            <h1 className="w-full text-2xl font-semibold mx-6 my-4 text-white absolute top-0 left-0">
              {props.info1.title}
            </h1>

            <motion.div
              ref={slider}
              onMouseEnter={(e) => {
                setVisibility(true);
                Playhead(e);
              }}
              onMouseLeave={() => {
                setVisibility(false);
              }}
              onClick={(e) => {
                handleClick(e);
                e.stopPropagation();
              }}
              className=" absolute bottom-16 left-4 right-4   h-1 w-auto  bg-slate-300  bg-opacity-20"
            >
              <motion.div
                style={{ width: `${prog}%` }}
                ref={playhead}
                className="h-1 bg-purple-600 rounded-2xl"
                duration={50}
              ></motion.div>
              <motion.div
                style={{
                  opacity: visible ? 1 : 0,
                  position: "relative",
                  bottom: `10px`,
                  left: `${pos - 20}px`,
                }}
                className="rounded-full w-4 h-4 bg-purple-700 "
              ></motion.div>
            </motion.div>

            {!isPlaying ? (
              <svg
                style={{ position: "absolute", top: "50%", left: "50%" }}
                width="50px"
                height="50px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M20.4086 9.35258C22.5305 10.5065 22.5305 13.4935 20.4086 14.6474L7.59662 21.6145C5.53435 22.736 3 21.2763 3 18.9671L3 5.0329C3 2.72368 5.53435 1.26402 7.59661 2.38548L20.4086 9.35258Z"
                    stroke="#ffffff"
                    stroke-width="1.5"
                  ></path>
                </g>
              </svg>
            ) : (
              <svg
                style={{ position: "absolute", top: "50%", left: "50%" }}
                width="50px"
                height="50px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M10 5C10 3.34315 8.65686 2 7 2H5C3.34315 2 2 3.34315 2 5V19C2 20.6569 3.34315 22 5 22H7C8.65686 22 10 20.6569 10 19V5ZM8 5C8 4.44772 7.55229 4 7 4H5C4.44772 4 4 4.44772 4 5V19C4 19.5523 4.44772 20 5 20H7C7.55229 20 8 19.5523 8 19V5Z"
                    fill="#ffffff"
                  ></path>{" "}
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M22 5C22 3.34315 20.6569 2 19 2H17C15.3431 2 14 3.34315 14 5V19C14 20.6569 15.3431 22 17 22H19C20.6569 22 22 20.6569 22 19V5ZM20 5C20 4.44772 19.5523 4 19 4H17C16.4477 4 16 4.44772 16 5V19C16 19.5523 16.4477 20 17 20H19C19.5523 20 20 19.5523 20 19V5Z"
                    fill="#ffffff"
                  ></path>{" "}
                </g>
              </svg>
            )}
            <svg
              className="absolute bottom-8 right-8"
              onClick={(e) => {
                e.stopPropagation();
                enterFullscreen();
              }}
              width="20px"
              height="20px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M23 4C23 2.34315 21.6569 1 20 1H16C15.4477 1 15 1.44772 15 2C15 2.55228 15.4477 3 16 3H20C20.5523 3 21 3.44772 21 4V8C21 8.55228 21.4477 9 22 9C22.5523 9 23 8.55228 23 8V4Z"
                  fill="#ffffff"
                ></path>{" "}
                <path
                  d="M23 16C23 15.4477 22.5523 15 22 15C21.4477 15 21 15.4477 21 16V20C21 20.5523 20.5523 21 20 21H16C15.4477 21 15 21.4477 15 22C15 22.5523 15.4477 23 16 23H20C21.6569 23 23 21.6569 23 20V16Z"
                  fill="#ffffff"
                ></path>{" "}
                <path
                  d="M4 21H8C8.55228 21 9 21.4477 9 22C9 22.5523 8.55228 23 8 23H4C2.34315 23 1 21.6569 1 20V16C1 15.4477 1.44772 15 2 15C2.55228 15 3 15.4477 3 16V20C3 20.5523 3.44772 21 4 21Z"
                  fill="#ffffff"
                ></path>{" "}
                <path
                  d="M1 8C1 8.55228 1.44772 9 2 9C2.55228 9 3 8.55228 3 8L3 4C3 3.44772 3.44772 3 4 3H8C8.55228 3 9 2.55228 9 2C9 1.44772 8.55228 1 8 1H4C2.34315 1 1 2.34315 1 4V8Z"
                  fill="#ffffff"
                ></path>{" "}
              </g>
            </svg>
            <svg
              onClick={(e) => {
                e.stopPropagation();
                option(e);
              }}
              className="absolute bottom-8 right-16"
              width="22px"
              height="22px"
              viewBox="0 0 24 24"
              id="_24x24_On_Light_Settings"
              data-name="24x24/On Light/Settings"
              xmlns="http://www.w3.org/2000/svg"
              fill="#ffffff"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <rect
                  id="view-box"
                  width="24"
                  height="24"
                  fill="#ffffff"
                  opacity="0"
                ></rect>{" "}
                <path
                  id="Shape"
                  d="M6.995,19.461a10.065,10.065,0,0,1-2.171-.9.756.756,0,0,1-.382-.7l.132-2.067a.151.151,0,0,0-.044-.116l-.707-.708a.149.149,0,0,0-.106-.043h-.01l-2.075.129-.047,0a.75.75,0,0,1-.654-.384,10.071,10.071,0,0,1-.9-2.176.755.755,0,0,1,.226-.766l1.559-1.376a.149.149,0,0,0,.05-.113V9.25a.151.151,0,0,0-.05-.113L.254,7.761a.754.754,0,0,1-.226-.766,10.115,10.115,0,0,1,.9-2.177.75.75,0,0,1,.654-.382h.047l2.075.129h.01a.153.153,0,0,0,.106-.044l.7-.7a.15.15,0,0,0,.043-.116L4.436,1.632a.754.754,0,0,1,.382-.7,10.115,10.115,0,0,1,2.177-.9.751.751,0,0,1,.766.226L9.137,1.813a.151.151,0,0,0,.113.05h.988a.149.149,0,0,0,.113-.05L11.728.254a.751.751,0,0,1,.766-.226,10.071,10.071,0,0,1,2.176.9.753.753,0,0,1,.383.7l-.129,2.075a.151.151,0,0,0,.043.116l.7.7a.155.155,0,0,0,.107.044h.009l2.075-.129H17.9a.752.752,0,0,1,.654.382,10.07,10.07,0,0,1,.9,2.177.753.753,0,0,1-.226.766L17.676,9.137a.152.152,0,0,0-.051.113v.988a.152.152,0,0,0,.051.113l1.559,1.376a.753.753,0,0,1,.226.766,10.026,10.026,0,0,1-.9,2.176.751.751,0,0,1-.654.384l-.047,0-2.075-.129h-.01a.149.149,0,0,0-.106.043l-.7.7a.154.154,0,0,0-.043.116l.129,2.075a.744.744,0,0,1-.383.7,10.011,10.011,0,0,1-2.171.9.746.746,0,0,1-.767-.226l-1.371-1.557a.149.149,0,0,0-.113-.051h-1a.152.152,0,0,0-.113.051L7.761,19.235a.751.751,0,0,1-.766.226ZM4.883,13.907l.708.707a1.649,1.649,0,0,1,.48,1.273l-.1,1.582a8.373,8.373,0,0,0,.988.409l1.055-1.194a1.652,1.652,0,0,1,1.238-.558h1a1.649,1.649,0,0,1,1.238.56l1.049,1.191a8.413,8.413,0,0,0,.989-.41l-.1-1.59a1.653,1.653,0,0,1,.481-1.27l.7-.7a1.664,1.664,0,0,1,1.167-.483l.1,0,1.59.1a8.376,8.376,0,0,0,.412-.994l-1.194-1.055a1.652,1.652,0,0,1-.558-1.238V9.25a1.652,1.652,0,0,1,.558-1.238l1.194-1.055a8.274,8.274,0,0,0-.412-.994l-1.59.1c-.033,0-.068,0-.1,0a1.642,1.642,0,0,1-1.169-.484l-.7-.7a1.65,1.65,0,0,1-.481-1.269l.1-1.59a8.748,8.748,0,0,0-.994-.413l-1.055,1.2a1.652,1.652,0,0,1-1.238.558H9.25a1.652,1.652,0,0,1-1.238-.558L6.958,1.61a8.8,8.8,0,0,0-.994.413l.1,1.59a1.65,1.65,0,0,1-.481,1.269l-.7.7a1.638,1.638,0,0,1-1.168.484c-.033,0-.067,0-.1,0l-1.59-.1a8.748,8.748,0,0,0-.413.994l1.2,1.055A1.652,1.652,0,0,1,3.363,9.25v.988a1.652,1.652,0,0,1-.558,1.238l-1.2,1.055a8.666,8.666,0,0,0,.413.994l1.59-.1.1,0A1.638,1.638,0,0,1,4.883,13.907Zm.106-4.168a4.75,4.75,0,1,1,4.75,4.75A4.756,4.756,0,0,1,4.989,9.739Zm1.5,0a3.25,3.25,0,1,0,3.25-3.25A3.254,3.254,0,0,0,6.489,9.739Z"
                  transform="translate(2.261 2.261)"
                  fill="#ffffff"
                ></path>{" "}
              </g>
            </svg>
            {options && qualityLevels.length > 0 && select != null ? (
              <Options options={qualityLevels} select={select} />
            ) : (
              <></>
            )}
            <input
              className="range slider  h-1 accent-pink-500 absolute bottom-8 left-8 "
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="w-full text-white text-2xl font-semibold my-3 mx-3">
        Ep- {props.info1.title}
      </div>
      <div className="w-full text-white text-2xl font-semibold my-3 mx-3">
        {props.info1.description}
      </div>
      <div className="w-full text-white text-sm  my-3 mx-3">
        Release: {props.info1.releaseDate}
      </div>
    </div>
  );
};

export default Player;
