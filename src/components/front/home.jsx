import Slider from "./slider.jsx";
import Carousel from "./carousel.jsx";
import { useState } from "react";

function Home(props) {
  return (
    <>
      {props.assets.length !== 0 ? (
        <Slider data={props.assets} />
      ) : (
        <div className="w-full h-100 animate-pulse px-4">
          <div className="w-full h-100 bg-pink-900/55 rounded-2xl "></div>
        </div>
      )}
      {props.assets.length !== 0 ? (
        <>
          <Carousel assets={props.assets} name={"Latest In 2025"} id={0} />
          <Carousel assets={props.assets} name={"Action"} id={1} />
          <Carousel assets={props.assets} name={"Fantasy"} id={2} />
        </>
      ) : (
        <>
          <div className="w-full h-1/12 py-7 px-8 animate-pulse">
            <div className="w-full h-32 bg-pink-900/55 rounded-2xl "></div>
          </div>
          <div className="w-full h-1/12 py-7 px-8 animate-pulse">
            <div className="w-full h-32 bg-pink-900/55 rounded-2xl "></div>
          </div>{" "}
          <div className="w-full h-1/12 py-7 px-8 animate-pulse">
            <div className="w-full h-32 bg-pink-900/55 rounded-2xl "></div>
          </div>
        </>
      )}
    </>
  );
}
export default Home;
