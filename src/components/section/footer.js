import Season from "./season";
import EpCard from "./epcard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useState } from "react";
function Footer(props) {
  const [selected, setSelect] = useState(0);
  return (
    <div className="absolute bottom-5 w-full">
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
    </div>
  );
}

export default Footer;
