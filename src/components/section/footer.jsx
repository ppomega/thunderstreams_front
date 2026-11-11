import Season from "./season.jsx";
import EpCard from "./epcard.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { useEffect, useState } from "react";
function Footer(props) {
  const [selected, setSelect] = useState(0);
  useEffect(() => {
    console.log(props.data);
  }, [props]);
  return (
    <div className="series-episodes absolute bottom-5 w-full">
      {props.data.length != 0 ? (
        <>
          <div className="series-season-tabs w-full flex justify-start">
            {props.data ? (
              props.data.map((i, k) => {
                return (
                  <Season
                    key={i._id || k}
                    number={i.seasonNumber}
                    data={i}
                    id={k}
                    selected={selected === k}
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
            slidesPerView={1.2}
            breakpoints={{
              480: { slidesPerView: 2, spaceBetween: 12 },
              760: { slidesPerView: 3, spaceBetween: 14 },
              1100: { slidesPerView: 4, spaceBetween: 16 },
              1400: { slidesPerView: 5, spaceBetween: 18 },
            }}
            loop={false}
            navigation
            modules={[Navigation]}
            className="series-episode-swiper min-w-full my-4"
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
        <div className="series-episode-loading" role="status" aria-label="Loading episodes">
          <div className="episode-skeleton-season shimmer-block" />
          <div className="episode-skeleton-grid" aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => (
              <div className="episode-skeleton-card" key={index}>
                <div className="episode-skeleton-art shimmer-block" />
                <div className="episode-skeleton-copy">
                  <div className="episode-skeleton-title shimmer-block" />
                  <div className="episode-skeleton-summary shimmer-block" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Footer;
