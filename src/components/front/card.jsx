import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Card(props) {
  const navigate = useNavigate();

  const [v, setView] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="carousel-card w-11/12 h-40 relative"
      onClick={async () => {
        navigate("/series", {
          state: { info1: props.slide, assets: props.assets },
        });
      }}
      onMouseEnter={() => {
        setView(true);
      }}
      onMouseLeave={() => {
        setView(false);
      }}
    >
      <img
        src={
          `${import.meta.env.VITE_APP_API_URL}/file?name=` +
          props.slide.thumbnail1
        }
        className=" w-64 rounded-xl h-full"
        loading="lazy"
        decoding="async"
        alt={props.slide.name || ""}
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 1 : 0 }}
      ></img>
      {!loaded && (
        <div className="absolute w-64 h-full top-0 left-0 animate-pulse rounded-2xl ">
          <div className="bg-pink-700/35 w-64 h-full rounded-2xl"></div>
        </div>
      )}
      {v ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="carousel-card-overlay w-64 font-bold h-40 rounded-2xl font-g text-xl px-5 flex items-center justify-center text-center absolute inset-0"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", color: "#fff" }}
        >
          {props.slide.name}
        </motion.div>
      ) : (
        <></>
      )}
    </div>
  );
}
export default Card;
