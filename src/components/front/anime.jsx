import Carousel from "./carousel.jsx";

function Anime(props) {
  return (
    <>
      {props.assets ? (
        <Carousel assets={props.assets} name={"Top Picks of 2025"} />
      ) : (
        <div className="w-full h-1/12 py-7 px-8 animate-pulse">
          <div className="w-full h-32 bg-pink-900/55 rounded-2xl "></div>
        </div>
      )}
      {props.assets ? (
        <Carousel assets={props.assets} name={"Winter Arcs"} />
      ) : (
        <div className="w-full h-1/12 py-7 px-8 animate-pulse">
          <div className="w-full h-32 bg-pink-900/55 rounded-2xl "></div>
        </div>
      )}
      {props.assets ? (
        <Carousel assets={props.assets} name={"Best of 2024"} />
      ) : (
        <div className="w-full h-1/12 py-7 px-8 animate-pulse">
          <div className="w-full h-32 bg-pink-900/55 rounded-2xl "></div>
        </div>
      )}
      {props.assets ? (
        <Carousel assets={props.assets} name={"Adventure"} />
      ) : (
        <div className="w-full h-1/12 py-7 px-8 animate-pulse">
          <div className="w-full h-32 bg-pink-900/55 rounded-2xl "></div>
        </div>
      )}
      {props.assets ? (
        <Carousel assets={props.assets} name={"Sci-Fi"} />
      ) : (
        <div className="w-full h-1/12 py-7 px-8 animate-pulse">
          <div className="w-full h-32 bg-pink-900/55 rounded-2xl "></div>
        </div>
      )}
      {props.assets ? (
        <Carousel assets={props.assets} name={"Top Picks of 2024"} />
      ) : (
        <div className="w-full h-1/12 py-7 px-8 animate-pulse">
          <div className="w-full h-32 bg-pink-900/55 rounded-2xl "></div>
        </div>
      )}
    </>
  );
}
export default Anime;
