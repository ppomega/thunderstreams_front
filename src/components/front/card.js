import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Card(props) {
  const navigate = useNavigate();

  async function Fetch(name) {
    name = name.replaceAll(" ", "_");
    name = name.replaceAll("-", "_");
    name = name.replaceAll(":", "_");

    let config = {
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/animeInfo?name=${name}`,
    };
    const list = await axios.request(config);
    return list.data;
  }
  const [v, setView] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="w-11/12 "
      onClick={async () => {
        const c = await Fetch(props.slide.name);
        console.log(c);
        navigate("/series", {
          state: { info1: props.slide, info2: c, assets: props.assets },
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
          `${process.env.REACT_APP_API_URL}/file?name=` + props.slide.thumbnail1
        }
        className=" w-64 rounded-xl"
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 100 : 0 }}
      ></img>
      {!loaded && (
        <div className="absolute w-64 h-full top-0 left-0 animate-pulse rounded-2xl ">
          <div className="bg-gray-700 w-64 h-full rounded-2xl  bg-opacity-35"></div>
        </div>
      )}
      {v ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-black bg-opacity-75 w-64 font-extrabold h-full rounded-xl  text-white font-g text-md px-10 absolute top-0 left-0"
        >
          {props.slide.description}
        </motion.div>
      ) : (
        <></>
      )}
      <div className="text-white font-g">{props.slide.name}</div>
    </div>
  );
}
export default Card;
