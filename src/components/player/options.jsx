import { useState } from "react";

export const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

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

function qualityLabel(quality, index) {
  return quality.height ? `${quality.height}p` : `Quality ${index + 1}`;
}

function Option({ active, onClick, children, hint }) {
  return (
    <button
      type="button"
      className={`player-option${active ? " is-active" : ""}`}
      aria-pressed={active}
      onClick={onClick}
    >
      <span>{children}</span>
      {active ? <span className="player-option-selected">Active</span> : hint && <span className="player-option-hint">{hint}</span>}
    </button>
  );
}

function Options(props) {
  const [tab, setTab] = useState(props.qualities.length > 0 ? "quality" : "speed");
  const tabs = [
    props.qualities.length > 0 && ["quality", "Quality"],
    ["speed", "Speed"],
    ["audio", "Audio"],
  ].filter(Boolean);

  // Highest first, like most players.
  const qualities = [...props.qualities].sort((a, b) => (b.height || b.bandwidth || 0) - (a.height || a.bandwidth || 0));
  const playing = props.qualities.find((quality) => quality.id === props.currentQualityId);

  return (
    <div className="player-options-menu" onClick={(event) => event.stopPropagation()}>
      <div className="player-options-tabs" role="tablist" aria-label="Playback settings">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={tab === id ? "is-active" : ""}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="player-options-list">
        {tab === "quality" && (
          <>
            <Option
              active={props.autoQuality}
              onClick={() => props.onSelectQuality(null)}
              hint={undefined}
            >
              Auto{props.autoQuality && playing ? ` (${qualityLabel(playing, 0)})` : ""}
            </Option>
            {qualities.map((quality, index) => (
              <Option
                key={quality.id ?? index}
                active={!props.autoQuality && quality.id === props.currentQualityId}
                onClick={() => props.onSelectQuality(quality)}
                hint={quality.bandwidth ? `${(quality.bandwidth / 1e6).toFixed(1)} Mbps` : undefined}
              >
                {qualityLabel(quality, index)}
              </Option>
            ))}
          </>
        )}

        {tab === "speed" && PLAYBACK_RATES.map((rate) => (
          <Option key={rate} active={props.playbackRate === rate} onClick={() => props.onSelectRate(rate)}>
            {rate === 1 ? "Normal" : `${rate}×`}
          </Option>
        ))}

        {tab === "audio" && props.audioTracks.length === 0 && (
          <div className="player-option-empty">No audio tracks reported for this stream.</div>
        )}
        {tab === "audio" && props.audioTracks.map((track, index) => (
          <Option
            key={track.id ?? `${track.lang || "audio"}-${index}`}
            active={props.activeAudioTrack === index}
            onClick={() => props.onSelectAudioTrack(track, index)}
          >
            {audioTrackLabel(track, index)}
          </Option>
        ))}
      </div>
    </div>
  );
}

export default Options;
