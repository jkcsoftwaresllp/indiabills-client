import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import styles from "./styles/BannerSlider.module.css";

export default function BannerSlider({ images = [], onClick }) {
  return (
    <div className={styles.wrapper} onClick={onClick}>
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        loop
        speed={900}
        className={styles.swiper}
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <img src={img} alt={`banner-${index}`} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
