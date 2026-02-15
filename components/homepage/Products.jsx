"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const products = [
  { title: "Sofa Assets", img: "https://images.unsplash.com/photo-1615874959474-d609969a20ed" },
  { title: "Chair Assets", img: "https://images.unsplash.com/photo-1618220179428-22790b461013" },
  { title: "Hanging Lamps", img: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a" },
  { title: "Modern Armchair", img: "https://images.unsplash.com/photo-1598300046647-5c775ad477c4" },
  { title: "Minimalist Table", img: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88" },
  { title: "Accent Lighting", img: "https://images.unsplash.com/photo-1507473885765-e6ed657adbbd" },
];

export default function Products() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-xl">
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">Products</p>
            <h2 className="text-3xl md:text-4xl font-semibold leading-tight mb-3">
              Discover Our Curated <br className="hidden sm:block" /> Furniture Collection
            </h2>
            <p className="text-sm md:text-base text-gray-500">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            </p>
          </div>
          
          {/* Desktop-only button for better balance, hidden on mobile */}
          <a href="/products" className="hidden md:block bg-black text-white hover:bg-white
           hover:text-black border border-black transition max-lg:text-center px-8 py-3 rounded-full text-sm font-medium">
            View All Products
          </a>
        </div>

        {/* SWIPER CONTAINER */}
        <div className="relative group">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1.2} // Shows a peek of the next slide on mobile
            centeredSlides={false}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              // Mobile/Tablet
              640: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              // Desktop
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            className="!pb-16" // Space for pagination bullets
          >
            {products.map((item, index) => (
              <SwiperSlide key={index} className="h-auto">
                <div className="bg-gray-50 rounded-3xl p-4 md:p-6 text-center h-full border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-64 md:h-80 mb-6">
                    <Image
                      src={item.img}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover rounded-2xl"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-tighter">Premium Collection</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* MOBILE BUTTON (Visible only on small screens) */}
        <div className="flex justify-center mt-4 md:hidden">
          <a href="/products" className="w-full bg-black text-white py-4 rounded-full max-lg:text-center text-sm font-medium">
            View All Products
          </a>
        </div>
      </div>
    </section>
  );
}