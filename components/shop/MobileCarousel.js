"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import Card from "./card";
import styles from "@/styles/shop/MobileCarousel.module.css";

function MobileCarousel({ items }) {
  return (
    <div className={styles.carouselContainer}>
      <Swiper
        className={styles.mobileSwiper}
        spaceBetween={24}
        slidesPerView={1.2}
        centeredSlides={true}
        loop={true}
        breakpoints={{
          768: {
            slidesPerView: 2,
            spaceBetween: 12,
          },
          992: {
            slidesPerView: 3,
            spaceBetween: 16,
          },
          1200: {
            slidesPerView: 4,
            spaceBetween: 24,
          },
        }}
        pagination={{
          clickable: true,
          el: ".custom-pagination", // 自訂容器
          bulletClass: "swiper-pagination-bullet",
          bulletActiveClass: "swiper-pagination-bullet-active",
        }}
        modules={[Pagination]}
      >
        {items.map((item) => (
          <SwiperSlide key={`slide-${item.id}`} className={styles.swiperSlide}>
            <div className={styles.swiperCardWrapper}>
              <Card item={item} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* 點點區域 */}
      <div className={`custom-pagination ${styles.paginationWrapper}`} />
      {/* 蓋過swiper套件預設顏色權重 */}
      <style jsx global>{`
        .swiper-pagination-bullet-active {
          background: #528f7c !important;
        }
      `}</style>
    </div>
  );
}

export default MobileCarousel;
