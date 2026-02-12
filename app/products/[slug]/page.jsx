"use client";

import api from "@/lib/api";
import { useEffect, useState, use } from "react";
import Image from "next/image";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";

export default function CategoryPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug; // Ye category name (hyphenated) hoga

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchFilteredProducts = async () => { 
      const { data } = await api.get("/products");
      // Slug ko wapas normal text banakar filter karein
      const categoryToFind = slug.replace(/-/g, " ");

      const filtered = data.filter(
        (p) => p.category.toLowerCase() === categoryToFind.toLowerCase(),
      );
      setProducts(filtered);
    };
    fetchFilteredProducts();
  }, [slug]);

  return (
    <div className="">
      <Breadcrumbs
        title={`${slug.replace(/-/g, " ")}`}
        breadcrumbs={["Home", "Products", `${slug.replace(/-/g, " ")}`]}
      />
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* <h1 className="text-3xl font-bold mb-10 capitalize">
          {slug.replace(/-/g, " ")}
        </h1> */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {products.map((item) => (
            <div key={item._id}>
              {/* Aapka product card design yahan aayega */}
              <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={item.image.url}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="mt-4 font-bold">{item.title}</h2>
              <p>₹{item.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
