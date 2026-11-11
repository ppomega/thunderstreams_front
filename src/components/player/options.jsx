import { useState } from "react";

function audioTrackLabel(track, index) {
  const label = track.labels?.[0]?.text || track.labels?.[0];
  if (label) return String(label);

  const language = track.lang || track.language;
  let languageName = language;
  if (language) {
    try {
      languageName = new Intl.DisplayNames([navigator.language], { type: "language" }).of(language) || language;
    } catch {
      languageName = language;
    }
  }

  const roles = (track.roles || [])
    .map((role) => typeof role === "string" ? role : role.value)
    .filter(Boolean);
  return [languageName || `Audio ${index + 1}`, ...roles].join(" - ");
}

function Options(props) {
  const [tab, setTab] = useState(props.options.length > 0 ? "quality" : "audio");

  return (
    <div className="player-options-menu" onClick={(event) => event.stopPropagation()}>
      <div className="player-options-tabs" role="tablist" aria-label="Playback settings">
        {props.options.length > 0 && (
          <button
            type="button"
            role="tab"
            aria-selected={tab === "quality"}
            className={tab === "quality" ? "is-active" : ""}
            onClick={() => setTab("quality")}
          >
            Video quality
          </button>
        )}
        <button
          type="button"
          role="tab"
          aria-selected={tab === "audio"}
          className={tab === "audio" ? "is-active" : ""}
          onClick={() => setTab("audio")}
        >
          Audio
        </button>
      </div>

      <div className="player-options-list">
        {tab === "quality" && props.options.map((quality, index) => (
          <button
            type="button"
            key={quality.id ?? index}
            className="player-option"
            onClick={() => props.select.current.setRepresentationForTypeById("video", quality.id, true)}
          >
            {quality.height ? `${quality.height}p` : `Quality ${index + 1}`}
          </button>
        ))}
        {tab === "audio" && props.audioTracks.length === 0 && (
          <div className="player-option-empty">No audio tracks reported for this stream.</div>
        )}
        {tab === "audio" && props.audioTracks.map((track, index) => (
          <button
            type="button"
            key={track.id ?? `${track.lang || "audio"}-${index}`}
            className={`player-option${props.activeAudioTrack === index ? " is-active" : ""}`}
            aria-pressed={props.activeAudioTrack === index}
            onClick={() => props.onSelectAudioTrack(track, index)}
          >
            <span>{audioTrackLabel(track, index)}</span>
            {props.activeAudioTrack === index && <span className="player-option-selected">Active</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Options;
