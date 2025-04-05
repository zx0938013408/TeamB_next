'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import styles from '@/styles/shop/BannerSlider.module.css'


const images = [
  '/photo/banner_1.png',
  '/photo/',
  '/photo/',
]

export default function BannerSlider() {
  return (
    <div className={styles.bannerWrapper}>
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        autoplay={{ delay: 3000 }}
        loop
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
    </div>
  )
}
