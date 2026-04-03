"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Categories data
const categories = [
  {
    title: "Wall Decor",
    slug: "wall-decor",
    img: "https://res.cloudinary.com/dwdmczhsn/image/upload/v1773163877/products/z0tf1qgjly5i85rrafsr.jpg",
  },
  {
    title: "Pendent Light",
    slug: "pendent-light",
    img: "https://res.cloudinary.com/dwdmczhsn/image/upload/v1773163107/products/puwlh4vn2hhnfhtcs2sb.jpg",
  },
  {
    title: "Table Lamp",
    slug: "table-lamp",
    img: "https://res.cloudinary.com/dwdmczhsn/image/upload/v1773162945/products/o2mhjbzetghoro8kg67l.jpg",
  },
  {
    title: "Chandelier",
    slug: "chandelier",
    img: "https://res.cloudinary.com/dwdmczhsn/image/upload/v1773163613/products/s0w6bqgg2pdptlsu9ql6.png",
  },
  {
    title: "Floor Light",
    slug: "floor-light",
    img: "https://res.cloudinary.com/dwdmczhsn/image/upload/v1771137487/products/awknls8ljcdwopq2fyhf.jpg",
  },
  {
    title: "Home Decor",
    slug: "home-decor",
    img: "https://res.cloudinary.com/dwdmczhsn/image/upload/v1773163676/products/g5qh0wpb6o003vaidwo9.png",
  },
];

export default function CategorySection() {
  return (
    <div className="flex justify-center">
      <section className="py-16 max-w-7xl w-full px-6 lg:px-20 bg-white">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl mb-3">
            Illuminate Every Corner of Your Home
          </h2>
          <p className="text-gray-600 text-sm max-w-3xl mx-auto leading-relaxed">
            Browse our curated categories — from statement chandeliers to
            intimate table lamps, each piece is designed to bring warmth,
            character, and beauty to your space.
          </p>
        </div>

        {/* Swiper Grid */}
        <Swiper
          modules={[Grid, Navigation, Pagination]}
          spaceBetween={16}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            0: {
              slidesPerView: 2,
              grid: {
                rows: 3,
                fill: "row",
              },
            },
            768: {
              slidesPerView: 3,
              grid: {
                rows: 2,
              },
            },
            1024: {
              slidesPerView: 4,
              grid: {
                rows: 1,
              },
            },
          }}
          className="!pb-14"
        >
          {categories.map((item, index) => (
            <SwiperSlide key={index}>
              <a href={`/products#${item.slug}`} className="relative group cursor-pointer overflow-hidden rounded-sm">
                <div className="relative aspect-[3/4] w-full border  border-gray-100">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform rounded-xl duration-500 group-hover:scale-105"
                  />

                  {/* Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-white/20  text-black text-sm px-4 py-1.5 rounded-full shadow-sm font-medium">
                      {item.title}
                    </span>
                  </div>
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Button */}
        <div className="flex justify-center px-6">
          <a
            href="/products"
            className="w-full sm:w-auto text-center bg-black text-white hover:bg-white hover:text-black border border-black transition-all duration-300 px-10 py-4 rounded-full text-sm font-medium"
          >
           Discover All Categories
          </a>
        </div>
      </section>
    </div>
  );
}
