import { Play } from "lucide-react";
import { useNavigate } from "react-router";

function EpCard(props) {
  const navigate = useNavigate();
  const thumbnail = props.slide.thumbnail || props.slide.thumbnail1 || props.data1;
  const imageUrl = thumbnail?.startsWith("http")
    ? thumbnail
    : `${import.meta.env.VITE_APP_API_URL}/file?name=${thumbnail}`;

  return (
    <button
      type="button"
      className="series-episode-card"
      onClick={() => navigate("/play", {
        state: {
          assets: props.assets,
          k: props.k,
          info1: props.slide,
          info2: props.data2,
          info3: props.data1,
        },
      })}
      aria-label={`Play episode ${props.k + 1}: ${props.slide.title}`}
    >
      <span className="series-episode-art">
        <img src={imageUrl} alt="" loading="lazy" decoding="async" />
        <span className="series-episode-art-shade" />
        <span className="series-episode-number">EP {String(props.k + 1).padStart(2, "0")}</span>
        <span className="series-episode-play"><Play size={22} fill="currentColor" /></span>
        {props.slide.duration && <span className="series-episode-duration">{props.slide.duration}</span>}
      </span>
      <span className="series-episode-copy">
        <span className="series-episode-name">{props.slide.title || `Episode ${props.k + 1}`}</span>
        <span className="series-episode-summary">{props.slide.description || "\u00a0"}</span>
      </span>
    </button>
  );
}

export default EpCard;
