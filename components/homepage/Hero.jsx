"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

// Local images
import hero1 from "@/public/homepage/hero1.jpeg";
import hero2 from "@/public/homepage/hero2.jpeg";
import hero3 from "@/public/homepage/hero3.jpeg";

const slides = [
  { title: "Collection One", images: [hero1, hero2, hero3] },
  { title: "Collection Two", images: [hero2, hero3, hero1] },
  { title: "Collection Three", images: [hero3, hero1, hero2] },
  { title: "Collection Four", images: [hero1, hero2, hero3] },
];

export default function Hero() {
  const paginationDelay = 4000;

  return (
    <section className="w-full h-screen max-lg:h-[40rem] p-10 pt-13 max-xl:p-4 max-xl:pt-24 relative">
      <style jsx global>{`
        .swiper-pagination-bullets {
          display: flex !important;
          justify-content: center;
          bottom: 40px !important;
          gap: 10px;
        }
        .custom-bullet {
          width: 80px !important;
          height: 4px !important;
          background: rgba(255, 255, 255, 0.3) !important;
          border-radius: 2px !important;
          position: relative;
          overflow: hidden;
          opacity: 1 !important;
          cursor: pointer;
        }
        .custom-bullet::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #ffffff;
          transform: scaleX(0);
          transform-origin: left;
        }
        .swiper-pagination-bullet-active::after {
          animation: progressAnim ${paginationDelay}ms linear forwards;
        }
        @keyframes progressAnim {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
      `}</style>

      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        loop={true}
        speed={1200}
        autoplay={{
          delay: paginationDelay,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className} custom-bullet"></span>`;
          },
        }}
        className="h-full w-full rounded-2xl overflow-hidden"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="w-full h-full">
            {/* Yahan main change hai:
                - Mobile par: grid-cols-1 (Ek image poori screen par)
                - Desktop par (md:): grid-cols-3 (Wapas teen images)
            */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1 w-full h-full">
              {slide.images.map((img, imgIndex) => (
                <div 
                  key={imgIndex} 
                  /* Mobile par: Agar image 0 nahi hai to 'hidden' rakho.
                    Desktop par (md:): 'block' dikhao (teeno images dikhengi).
                  */
                  className={`relative w-full h-full ${imgIndex !== 0 ? 'hidden md:block' : 'block'}`}
                >
                  <Image
                    src={img}
                    alt={`${slide.title}-${imgIndex}`}
                    fill
                    priority={index === 0}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}