"use client";

import api from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/products");
        
        const uniqueCategories = {};
        data.forEach((product) => {
          const catName = product.category?.trim() || "Uncategorized";
          if (!uniqueCategories[catName]) {
            uniqueCategories[catName] = {
              name: catName,
              // UPDATE: product.image ki jagah product.mainImage use karein
              image: product.mainImage?.url || product.image?.url, 
              slug: catName.toLowerCase().replace(/\s+/g, "-"),
            };
          }
        });

        setCategories(Object.values(uniqueCategories));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <div className="py-20 text-center font-medium">Loading Categories...</div>;

  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.slug} 
              href={`/products/${category.slug}`} 
              className="group"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100">
                {category.image && (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white text-xl font-bold capitalize px-4 text-center">
                    {category.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}