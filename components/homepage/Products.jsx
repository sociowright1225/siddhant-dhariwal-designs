"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Swiper Styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://siddhant-dhariwal-designs-e6u4.vercel.app/api/products");
        const data = await response.json();
        
        // Data extract karna
        const allData = Array.isArray(data) ? data : data.products || [];

        /* 
           LATEST 10 PRODUCTS LOGIC:
           1. .reverse() -> Taki naye products pehle aayein (agar API order purana hai)
           2. .slice(0, 10) -> Sirf shuruat ke 10 items lene ke liye
        */
        const latestTen = [...allData].reverse().slice(0, 10);
        
        setProducts(latestTen);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="py-24 text-center">Loading Collection...</div>;

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-xl">
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">
              Latest Collection
            </p>
            <h2 className="text-3xl md:text-5xl font-semibold leading-tight mb-3">
              Lighting That Makes a Statement
            </h2>
            <p className="text-sm md:text-base text-gray-500">
              Showing our top 10 most recent designs, meticulously crafted for your space.
            </p>
          </div>

          <a href="/products" className="hidden md:block bg-black text-white hover:bg-white hover:text-black border border-black transition px-8 py-3 rounded-full text-sm font-medium">
            Explore Full Collection
          </a>
        </div>

        {/* Swiper Slider */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1.2}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
          }}
          className="!pb-16"
        >
          {products.map((item) => (
            <SwiperSlide key={item._id}>
              <div className="group bg-gray-50 rounded-3xl p-4 md:p-6 text-center border border-gray-100 hover:shadow-xl transition duration-300">
                <div className="relative h-64 md:h-80 mb-6 overflow-hidden rounded-2xl">
                  <Image
                  src={item.mainImage?.url || item.gallery?.[0]?.url || "/placeholder.jpg"}
                    alt={item.title || "Product Image"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <h3 className="text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>

                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">
                  {item.category} 
                  {/* — ₹{item.price?.toLocaleString()} */}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Mobile View Button */}
        <div className="flex justify-center mt-4 md:hidden">
          <a href="/products" className="w-full text-center bg-black text-white py-4 rounded-full text-sm font-medium">
            View All Products
          </a>
        </div>
      </div>
    </section>
  );
}
