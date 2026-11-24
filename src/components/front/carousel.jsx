import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Card from "./card";

function Carousel(props) {
  return (
    <section className="carousel-section w-full py-6">
      <div className="min-w-full flex justify-start">
        <div className="carousel-heading py-2 px-2 my-4 font-g text-fg">
          {props.name}
        </div>
      </div>
      {props.assets.length != 0 ? (
        <Swiper
          key={`swiper-${props.id}`}
          spaceBetween={8}
          slidesPerView={1.35}
          breakpoints={{
            480: { slidesPerView: 2.1, spaceBetween: 12 },
            700: { slidesPerView: 3, spaceBetween: 16 },
            1000: { slidesPerView: 4, spaceBetween: 18 },
            1400: { slidesPerView: 5, spaceBetween: 20 },
          }}
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
          <div className="w-full h-32 skeleton rounded-2xl "></div>
        </div>
      )}
    </section>
  );
}

export default Carousel;
