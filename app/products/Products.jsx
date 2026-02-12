"use client";

import api from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CategoryList() {
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get("/products");
        const categoriesMap = {};

        data.forEach((product) => {
          if (!categoriesMap[product.category]) {
            categoriesMap[product.category] = {
              name: product.category,
              imageUrl: product.image?.url || null,
            };
          }
        });
        setCategoryData(Object.values(categoriesMap));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <section className=" min-h-screen py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <p className=" text-sm font-medium mb-2">Products</p>
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <h2 className="text-3xl md:text-4xl font-serif  max-w-md leading-tight">
              Lorem Ipsum is dummy text of the printing
            </h2>
            <p className="text-gray-400 text-sm max-w-lg">
              Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoryData.map((cat, index) => (
            <Link
              key={index}
              href={`/products/${encodeURIComponent(cat.name.toLowerCase().replace(/\s+/g, '-'))}`}
              className="group flex flex-col items-center"
            >
              {/* Card Container */}
              <div className="relative w-full aspect-square  rounded-[2rem] overflow-hidden flex items-center justify-center transition-all duration-300 shadow-lg">
                {cat.imageUrl && (
                  <div className="relative w-full h-full transform transition-transform duration-500 group-hover:scale-110">
                    <Image
                      src={cat.imageUrl}
                      alt={cat.name}
                      fill
                      className=" object-cover" // Contain rakha hai taaki furniture kote nahi
                    />
                  </div>
                )}
                
               
              </div>

              {/* Category Name */}
              <h3 className="mt-6  text-lg font-medium tracking-wide capitalize">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}