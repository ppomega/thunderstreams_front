import { useState } from "react";
import { Play } from "lucide-react";
import useVideoThumbnail from "../../hooks/useVideoThumbnail.js";

function EpisodeThumb({ path, fallback }) {
  const [ref, videoThumb] = useVideoThumbnail(path);
  return (
    <span className="episode-thumb" ref={ref}>
      <img src={videoThumb || fallback} alt="" loading="lazy" decoding="async" />
      <span className="episode-play"><Play size={19} fill="currentColor" /></span>
    </span>
  );
}

function SideView(props) {
  const imageUrl = `${import.meta.env.VITE_APP_API_URL}/file?name=${props.thumb}`;
  const [selected, setSelected] = useState(props.k);

  return (
    <aside className="episode-sidebar font-g" aria-label="Episodes">
      <h2 className="episode-sidebar-heading">Episodes</h2>
      <div className="episode-list">
        {props.data.map((episode, index) => (
          <button
            type="button"
            key={episode._id || episode.path || index}
            className={`episode-item${selected === index ? " is-selected" : ""}`}
            aria-pressed={selected === index}
            onClick={() => {
              props.setPath(episode.path);
              props.setInfo1(episode);
              setSelected(index);
            }}
          >
            <EpisodeThumb path={episode.path} fallback={imageUrl} />
            <span className="episode-copy">
              <span className="episode-title">{episode.title || `Episode ${index + 1}`}</span>
              <span className="episode-description">{episode.description}</span>
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}

export default SideView;
