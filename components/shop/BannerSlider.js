"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import styles from "@/styles/shop/BannerSlider.module.css";

const images = [
  "/photo/banner_1.png",
  "/photo/banner_1.png",
  "/photo/banner_1.png",
];

export default function BannerSlider() {
  return (
    <div className={styles.bannerWrapper}>
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation={{
          prevEl: `.${styles.leftArrow}`,
          nextEl: `.${styles.rightArrow}`,
        }}
        autoplay={{ delay: 3000 }}
        loop
        className={styles.swiper}
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <img
              src={src}
              alt={`banner-${index}`}
              className={styles.bannerImage}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 左鍵 */}
      <button className={`${styles.iconButton} ${styles.leftArrow}`}>
        <span className={`icon-Left ${styles.iconInner} ${styles.iconLeft}`} />
      </button>

      {/* 右鍵 */}
      <button className={`${styles.iconButton} ${styles.rightArrow}`}>
        <span
          className={`icon-Right ${styles.iconInner} ${styles.iconRight}`}
        />
      </button>
    </div>
  );
}
