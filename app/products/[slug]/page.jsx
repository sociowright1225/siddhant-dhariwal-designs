"use client";

import api from "@/lib/api";
import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link"; 
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";

export default function CategoryPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug; 
  // "pendent-light" ko "Pendent Light" mein convert karne ke liye regex
  const categoryTitle = slug.replace(/-/g, " ");

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        const { data } = await api.get("/products");
        const filtered = data.filter(
          (p) => p.category.toLowerCase() === categoryTitle.toLowerCase()
        );
        setProducts(filtered);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchFilteredProducts();
  }, [categoryTitle]);

  return (
    <div>
      <Breadcrumbs
        title={categoryTitle}
        breadcrumbs={["Home", "Products", categoryTitle]}
      />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {products.map((item) => {
            // Backend slug "Ensemble 2.O" ko URL friendly "ensemble-2-o" banayein agar backend slug ajeeb hai
            const safeProductSlug = item.slug.replace(/\s+/g, '-').toLowerCase();
            
            return (
              // IMPORTANT: Route structure matching folder (products/[slug]/[productSlug])
              <Link href={`/products/${slug}/${safeProductSlug}`} key={item._id}>
                <div className="group cursor-pointer">
                  <div className="relative w-full aspect-4/5 bg-gray-100 rounded-xl overflow-hidden">
                    <Image
                      src={item.image.url}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition duration-500"
                    />
                  </div>
                  <div className="mt-4">
                    <h2 className="font-bold text-lg">{item.title}</h2>
                    <p className="text-sm text-gray-500 mt-1 italic">View details</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}