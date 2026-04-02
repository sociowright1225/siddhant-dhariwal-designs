"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("https://siddhant-dhariwal-designs-e6u4.vercel.app/api/products/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <div className="p-10 text-center font-bold text-2xl">Loading Categories...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-black mb-10 text-center uppercase tracking-widest text-gray-800">
        Shop By Category
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <Link 
            href={`/products/${encodeURIComponent(cat.name)}`} 
            key={cat._id}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100 shadow-sm group-hover:shadow-xl transition-all duration-500">
              {/* Category Image */}
              <img
                src={cat.thumbnail?.url || "/placeholder.jpg"}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              {/* Overlay with Name */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <h2 className="text-white text-xl md:text-2xl font-semibold font-black uppercase tracking-tight drop-shadow-md px-4 text-center">
                  {cat.name}
                </h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}