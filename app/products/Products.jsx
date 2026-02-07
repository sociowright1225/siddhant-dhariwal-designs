"use client";

import React, { useState } from "react";
import Image from "next/image";

const products = [
 

  {
    title: "Hanging Lamps",
    img: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a",
  },
   {
    title: "Hanging Lamps",
    img: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a",
  },
   {
    title: "Hanging Lamps",
    img: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a",
  },
   {
    title: "Hanging Lamps",
    img: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a",
  },
   {
    title: "Hanging Lamps",
    img: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a",
  },
   {
    title: "Hanging Lamps",
    img: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a",
  },
  
  {
    title: "Modern Armchair",
    img: "https://images.unsplash.com/photo-1598300046647-5c775ad477c4",
  }, {
    title: "Modern Armchair",
    img: "https://images.unsplash.com/photo-1598300046647-5c775ad477c4",
  }, {
    title: "Modern Armchair",
    img: "https://images.unsplash.com/photo-1598300046647-5c775ad477c4",
  }, {
    title: "Modern Armchair",
    img: "https://images.unsplash.com/photo-1598300046647-5c775ad477c4",
  }, {
    title: "Modern Armchair",
    img: "https://images.unsplash.com/photo-1598300046647-5c775ad477c4",
  }, {
    title: "Modern Armchair",
    img: "https://images.unsplash.com/photo-1598300046647-5c775ad477c4",
  },
  {
    title: "Accent Lighting",
    img: "https://images.unsplash.com/photo-1507473885765-e6ed657adbbd",
  },  {
    title: "Accent Lighting",
    img: "https://images.unsplash.com/photo-1507473885765-e6ed657adbbd",
  },  {
    title: "Accent Lighting",
    img: "https://images.unsplash.com/photo-1507473885765-e6ed657adbbd",
  },  {
    title: "Accent Lighting",
    img: "https://images.unsplash.com/photo-1507473885765-e6ed657adbbd",
  },  {
    title: "Accent Lighting",
    img: "https://images.unsplash.com/photo-1507473885765-e6ed657adbbd",
  },  {
    title: "Accent Lighting",
    img: "https://images.unsplash.com/photo-1507473885765-e6ed657adbbd",
  },
];

export default function Products() {
  const [selectedProduct, setSelectedProduct] = useState("All");

  // unique product names for dropdown
  const productNames = ["All", ...new Set(products.map(p => p.title))];

  // filter logic
  const filteredProducts =
    selectedProduct === "All"
      ? products
      : products.filter(p => p.title === selectedProduct);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold">Products</h2>

        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm focus:outline-none"
        >
          {productNames.map((name, index) => (
            <option key={index} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredProducts.map((item, index) => (
          <div key={index} className="group">
            <div className="relative w-full h-[320px] bg-[#e6e1d8] rounded-md overflow-hidden">
              <Image
                src={item.img}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <h3 className="mt-4 text-sm font-medium">
              {item.title}
            </h3>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredProducts.length === 0 && (
        <p className="text-center text-sm text-gray-500 mt-10">
          No products found
        </p>
      )}
    </section>
  );
}
