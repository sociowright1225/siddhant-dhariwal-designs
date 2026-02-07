"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

// Local image
import hero1 from "@/public/homepage/hero.webp";
import hero2 from "@/public/homepage/hero2.webp";
import hero3 from "@/public/homepage/hero3.jpg";

export default function Hero() {
  return (
    <section className="w-full h-screen">
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        loop
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        className="h-full"
      >
        {/* Slide 1 (Local Image) */}
        <SwiperSlide className="relative">
          <Image
            src={hero1}
            alt="Luxury Interior Design"
            fill
            priority
            className="object-cover"
          />
          <HeroContent />
        </SwiperSlide>

        {/* Slide 2 (External Image) */}
        <SwiperSlide className="relative">
          <Image
         src={hero2}
            alt="Modern Living Room"
            fill
            className="object-cover"
          />
          <HeroContent />
        </SwiperSlide>

        {/* Slide 3 (External Image) */}
        <SwiperSlide className="relative">
          <Image
             src={hero3}
            alt="Luxury Bedroom"
            fill
            className="object-cover"
          />
          <HeroContent />
        </SwiperSlide>
      </Swiper>
    </section>
  );
}

/* ---------- Hero Text Overlay ---------- */
function HeroContent() {
  return (
    <div className="absolute inset-0  flex items-center">
      {/* <div className="container mx-auto px-6 text-white">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Luxury Interior <br /> Design Studio
        </h1>

        <p className="mt-4 max-w-xl text-lg text-white/90">
          We create timeless interiors with modern elegance and premium finishes.
        </p>

        <div className="mt-6 flex gap-4">
          <button className="bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-200 transition">
            Get Quote
          </button>

          <button className="border border-white px-6 py-3 rounded-md font-medium hover:bg-white hover:text-black transition">
            View Projects
          </button>
        </div>
      </div> */}
    </div>
  );
}
