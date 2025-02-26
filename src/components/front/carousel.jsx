import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Card from "./card";

function Carousel(props) {
  return (
    <div className="min-w-full py-8 px-28 h-full">
      <div className="min-w-full flex justify-center">
        <div className="text-4xl py-2 px-2  my-4 font-g font-black text-white  ">
          {props.name}
        </div>
      </div>
      {props.assets.length != 0 ? (
        <Swiper
          key={`swiper-${props.id}`}
          spaceBetween={8}
          slidesPerView={4}
          modules={[Navigation]}
          className="w-full"
        >
          {props.assets.map((slide) => (
            <SwiperSlide key={slide._id}>
              <Card slide={slide} assets={props.assets} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="w-full h-1/12 py-7 px-8 animate-pulse">
          <div className="w-full h-32 bg-pink-900/55 rounded-2xl "></div>
        </div>
      )}
    </div>
  );
}

export default Carousel;
