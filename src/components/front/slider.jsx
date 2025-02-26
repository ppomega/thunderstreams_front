import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { Navigation, Autoplay, EffectFade } from "swiper/modules";

import Image from "./image";
const Slider = (props) => {
  return (
    <Swiper
      key={`swiper-${props.id}`}
      spaceBetween={2}
      speed={750}
      autoplay={{ delay: 3500 }}
      effect={"fade"}
      slidesPerView={1}
      loop={true}
      modules={[Navigation, Autoplay, EffectFade]}
      className="w-full"
    >
      {props.data.map((slide) => {
        const path =
          `${import.meta.env.VITE_APP_API_URL}/file?name=` + slide.thumbnail1;
        return (
          <SwiperSlide key={slide._id}>
            <Image
              slide={slide}
              src={path}
              logo={slide.logo}
              genre={slide.genre}
              desc={slide.description}
              assets={props.data}
            ></Image>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default Slider;
