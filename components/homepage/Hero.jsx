"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import hero1 from "@/public/homepage/hero1.jpeg";
import hero2 from "@/public/homepage/hero2.jpeg";
import hero3 from "@/public/homepage/hero3.jpeg";

const slides = [
  [
    { img: hero1, text: "LEAD" },
    { img: hero2, text: "LIGHT" },
    { img: hero3, text: "LEGACY." },
  ],
  [
    { img: hero2, text: "LEAD" },
    { img: hero3, text: "LIGHT" },
    { img: hero1, text: "LEGACY" },
  ],
];

export default function Hero() {
  const delay = 4000;

  return (
    <section className="w-full h-screen max-lg:h-[40rem] px-10 pt-13 max-lg:pt-24 max-lg:px-4 relative">
      {/* PAGINATION STYLE */}
      <style jsx global>{`
        .swiper-pagination {
          bottom: 32px !important;
          display: flex;
          justify-content: center;
          gap: 12px;
        }

        .bar {
          width: 80px;
          height: 4px;
          background: rgba(255, 255, 255, 0.25);
          border-radius: 2px;
          overflow: hidden;
          position: relative;
        }

        .bar::after {
          content: "";
          position: absolute;
          inset: 0;
          background: white;
          transform: scaleX(0);
          transform-origin: left;
        }

        .swiper-pagination-bullet-active::after {
          animation: load ${delay}ms linear forwards;
        }

        @keyframes load {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `}</style>

      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        loop
        speed={1200}
        autoplay={{ delay, disableOnInteraction: false }}
        pagination={{
          clickable: true,
          renderBullet: (_, className) =>
            `<span class="${className} bar"></span>`,
        }}
        className="h-full rounded-3xl overflow-hidden"
      >
        {slides.map((items, index) => (
          <SwiperSlide key={index}>
            <div className="grid grid-cols-1 gap-1 md:grid-cols-3 h-full">
              {items.map((item, i) => (
                <div
                  key={i}
                  className={`relative ${
                    i !== 0 ? "hidden md:block" : "block"
                  }`}
                >
                  <Image
                    src={item.img}
                    alt={item.text}
                    fill
                    priority={index === 0}
                    className="object-cover"
                  />

                  {/* TEXT */}
                  <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
                    <div className="px-10 py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm">
                      <span className="text-white tracking-widest text-sm">
                        {item.text}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}