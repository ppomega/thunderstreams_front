import { useState } from "react";
import { Play } from "lucide-react";

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
            <span className="episode-thumb">
              <img src={imageUrl} alt="" loading="lazy" decoding="async" />
              <span className="episode-play"><Play size={19} fill="currentColor" /></span>
            </span>
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
