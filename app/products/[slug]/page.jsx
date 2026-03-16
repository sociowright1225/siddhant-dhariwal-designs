"use client";

import api from "@/lib/api";
import { useEffect, useState, use } from "react";
import Image from "next/image";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";

export default function CategoryPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug; 
  const categoryTitle = slug.replace(/-/g, " ");

  const [products, setProducts] = useState([]);

  // 1. Demo Descriptions ka Mapping Object
  const categoryDescriptions = {
    "pendent-light": "Illuminate your space with our elegant pendent lights, perfect for modern dining and living areas.",
    "wall-light": "Add a touch of warmth to your walls with our premium range of decorative wall lamps.",
    "chandelier": "Make a grand statement with our luxurious chandeliers, designed for sophisticated interiors.",
    "table-lamp": "Enhance your workspace or bedside with our stylish and functional table lamps.",
    // Nayi categories yahan add kar sakte hain...
  };

  // Current category ka description nikalna
  const currentDescription = categoryDescriptions[slug.toLowerCase()] || 
    `Explore our exclusive collection of ${categoryTitle}. High-quality designs for your home.`;

  useEffect(() => {
    const fetchFilteredProducts = async () => { 
      const { data } = await api.get("/products");
      const categoryToFind = categoryTitle;

      const filtered = data.filter(
        (p) => p.category.toLowerCase() === categoryToFind.toLowerCase(),
      );
      setProducts(filtered);
    };
    fetchFilteredProducts();
  }, [slug, categoryTitle]);

  return (
    <div className="">
      <Breadcrumbs
        title={`${categoryTitle}`}
        breadcrumbs={["Home", "Products", `${categoryTitle}`]}
      />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* 2. Category Heading and Demo Description */}
        <div className="mb-12 border-b pb-8">
          {/* <h1 className="text-4xl font-bold capitalize mb-4">{categoryTitle}</h1> */}
          <p className="text-gray-600 text-lg max-w-3xl leading-relaxed">
            {currentDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {products.map((item) => (
            <div key={item._id} className="group cursor-pointer">
              <div className="relative w-full h-72 bg-gray-100 rounded-xl overflow-hidden">
                <Image
                  src={item.image.url}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition duration-500"
                />
              </div>
              
              {/* Product Info */}
              <div className="mt-4">
                <h2 className="font-bold text-lg">{item.title}</h2>
                {/* Agar product ka apna description hai toh wo dikhega, warna category wala chhota part */}
                <p className="text-gray-500 text-sm line-clamp-2 my-1">
                  {item.description || `Premium ${categoryTitle} fixture.`}
                </p>
                <p className="text-black font-semibold">₹{item.price?.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            No products found in this category.
          </div>
        )}
      </div>
    </div>
  );
}