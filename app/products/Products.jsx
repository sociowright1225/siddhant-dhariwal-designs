"use client";

import api from "@/lib/api";
import Image from "next/image";
import { useEffect, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

export default function CategoryList() {
  const [categories, setCategories] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");

        const grouped = {};

        data.forEach((product) => {
          const category = product.category?.trim();

          if (!grouped[category]) {
            grouped[category] = [];
          }

          grouped[category].push(product);
        });

        setCategories(grouped);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        {Object.entries(categories).map(([category, products]) => {
          
          // slug create for id
          const slug = category.toLowerCase().replace(/\s+/g, "-");

          return (
            <div key={category} id={slug}>
              
              {/* Category Title */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold capitalize">
                  {category}
                </h2>
              </div>

              {/* Slider */}
              <Swiper
                modules={[Navigation]}
                navigation
                spaceBetween={20}
                breakpoints={{
                  0: { slidesPerView: 1.2 },
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                  1280: { slidesPerView: 4 },
                }}
              >
                {products.map((product) => (
                  <SwiperSlide key={product._id}>
                    <div className="block group">

                      <div className="relative aspect-square overflow-hidden rounded-2xl">
                        <Image
                          src={product.image?.url}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-110 transition duration-500"
                        />
                      </div>

                      <h3 className="mt-3 text-sm font-medium">
                        {product.title}
                      </h3>

                      <p className="text-sm text-gray-500">
                        ₹{product.price}
                      </p>

                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

            </div>
          );
        })}
      </div>
    </section>
  );
}