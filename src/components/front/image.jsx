import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
function Image(props) {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  async function Fetch(name) {
    name = name.replaceAll(" ", "_");
    name = name.replaceAll("-", "_");

    let config = {
      method: "GET",
      url: `${import.meta.env.VITE_APP_API_URL}/animeInfo?name=${name}`,
    };
    const list = await axios.request(config);
    return list.data;
  }
  return (
    <div className="featured-hero relative w-full overflow-hidden">
      <img
        src={props.src}
        className="featured-hero-image w-full h-full"
        loading="eager"
        fetchPriority="high"
        decoding="async"
        alt={props.slide.name || "Featured title"}
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 1 : 0 }}
      ></img>

      {loaded && (
        <>
          <div className="featured-image-fade absolute inset-0 z-10 pointer-events-none" />
          <div className="featured-banner-copy absolute bottom-12 left-0 z-30 flex flex-col items-start gap-3 px-16">
            <div
              className="featured-anime-logo w-full bg-no-repeat bg-left"
              style={{
                backgroundImage:
                  "url(" +
                  `${import.meta.env.VITE_APP_API_URL}/file?name=` +
                  props.logo +
                  ")",
                backgroundSize: "auto clamp(150px, 18vw, 220px)",
              }}
            ></div>
            <div className="featured-banner-genres font-g font-semibold">
              {props.genre.map((i, k) => {
                return <span key={`${i}-${k}`}>{i}{k < props.genre.length - 1 ? "   " : ""}</span>;
              })}
            </div>
            <div className="featured-banner-description font-g">
              {props.desc}
            </div>
            <button
              onClick={async () => {
                const c = await Fetch(props.slide.name);
                navigate("/series", {
                  state: { info1: props.slide, info2: c, assets: props.assets },
                });
              }}
              className="w-40 min-h-10 rounded-md btn-primary text-base font-g font-extrabold"
            >
              Watch Now
            </button>
          </div>
        </>
      )}
      {!loaded && (
        <div className="absolute top-0 right-0 animate-pulse w-11/12 h-100 rounded-2xl mx-16">
          <div className="w-full h-100 skeleton rounded-2xl"></div>
        </div>
      )}
    </div>
  );
}
export default Image;
