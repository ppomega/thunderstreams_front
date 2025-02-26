import Season from "./season.jsx";
import EpCard from "./epcard.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useEffect, useState } from "react";
function Footer(props) {
  const [selected, setSelect] = useState(0);
  useEffect(() => {
    console.log(props.data);
  }, [props]);
  return (
    <div className="absolute bottom-5 w-full">
      {props.data.length != 0 ? (
        <>
          <div className="w-full h-7  flex justify-start">
            {" "}
            {props.data ? (
              props.data.map((i, k) => {
                return (
                  <Season
                    number={i.seasonNumber}
                    data={i}
                    id={k}
                    click={setSelect}
                  />
                );
              })
            ) : (
              <></>
            )}
          </div>
          <Swiper
            key={`swiper-${props.id}`}
            spaceBetween={8}
            slidesPerView={5}
            loop={false}
            modules={[Navigation]}
            className="min-w-full my-3"
          >
            {props.data[selected].episodes ? (
              props.data[selected].episodes.map((slide, k) => {
                return (
                  <SwiperSlide key={slide._id}>
                    <EpCard
                      assets={props.assets}
                      k={k}
                      slide={slide}
                      data1={props.data1}
                      data2={props.data[selected].episodes}
                    />
                  </SwiperSlide>
                );
              })
            ) : (
              <></>
            )}
          </Swiper>
        </>
      ) : (
        <div className="relative bottom-0 left-0 w-full h-1/12 py-7 px-8 animate-pulse">
          <div className="w-full h-32 bg-pink-900/55 rounded-2xl "></div>
        </div>
      )}
    </div>
  );
}

export default Footer;
