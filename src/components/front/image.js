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
      url: `${process.env.REACT_APP_API_URL}/animeInfo?name=${name}`,
    };
    const list = await axios.request(config);
    return list.data;
  }
  return (
    <div className="w-full h-full">
      <img
        src={props.src}
        className="w-full  h-screen "
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 1 : 0 }}
      ></img>

      {loaded && (
        <>
          <div
            className="w-1/3 h-screen bg-gradient-to-r from-bubble2  to-transparent
         absolute top-0 left-0 "
          ></div>
          <div className="w-1/2 h-1/2 absolute bottom-0 left-0">
            <div
              className="w-full h-1/3 mx-16 z-10  bg-[auto_120px] bg-no-repeat "
              style={{
                backgroundImage:
                  "url(" +
                  `${process.env.REACT_APP_API_URL}/file?name=` +
                  props.logo +
                  ")",
              }}
            ></div>
            <div className="text-slate-400 mx-16 font-g z-30 absolute left-0 bottom-52">
              {props.genre.map((i, k) => {
                return <>{i + "       "}</>;
              })}
            </div>
            <div className="text-white mx-16 h-1/3 font-g z-30 absolute left-0 bottom-16">
              {props.desc}
            </div>
            <button
              onClick={async () => {
                const c = await Fetch(props.slide.name);
                navigate("/series", {
                  state: { info1: props.slide, info2: c, assets: props.assets },
                });
              }}
              className="w-36 h-8 rounded-sm bg-pink-500 bg-opacity-45 text-lg text-white font-g font-extrabold  absolute left-0 bottom-14 mx-16 z-30"
            >
              Watch Now
            </button>
          </div>
          <div
            className="w-full h-1/2 bg-gradient-to-t from-bubble2  to-transparent
       absolute bottom-0 right-0 "
          ></div>
        </>
      )}
      {!loaded && (
        <div className="absolute top-0 right-0 animate-pulse w-11/12 h-100 rounded-2xl mx-16">
          <div className="w-full h-100 bg-gray-700 rounded-2xl  bg-opacity-35"></div>
        </div>
      )}
    </div>
  );
}
export default Image;
