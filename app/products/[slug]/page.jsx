"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function CategoryProductsPage() {
  const params = useParams();
  const categoryName = params.slug ? decodeURIComponent(params.slug) : "";
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`https://siddhant-dhariwal-designs-e6u4.vercel.app/api/products/category/${categoryName}`);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryName) fetchProducts();
  }, [categoryName]);

  // Modern Skeleton Loader
  if (loading) return (
    <div className="max-w-7xl mx-auto p-6 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded mb-10" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="space-y-4">
            <div className="aspect-[3/4] bg-gray-100 rounded-2xl" />
            <div className="h-4 w-3/4 bg-gray-100 rounded" />
            <div className="h-4 w-1/2 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <main className="max-w-7xl mx-auto p-6 md:py-12">
      {/* Header Section */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between border-b border-gray-100 pb-8 gap-4">
        <div>
          <nav className="flex gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-bold">{categoryName}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-light capitalize text-slate-900 tracking-tight">
            {categoryName}
          </h1>
          <p className="text-slate-400 mt-3 font-medium text-sm">
            Showing {products.length} curated designs
          </p>
        </div>
        
        <Link 
          href="/" 
          className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-black transition-all"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Collections
        </Link>
      </header>

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {products.map((product) => (
            <Link 
              key={product._id}
              href={`/products/${params.slug}/${product.slug}`}
              className="group"
            >
              <div className="relative overflow-hidden rounded-2xl bg-gray-50 aspect-[4/5]">
                {/* Product Image */}
                <img
                  src={product.mainImage?.url || product.gallery?.[0]?.url || "/placeholder.jpg"}
                  alt={product.title}
                  className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-110"
                />
                
                {/* Hover Button Overlay */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                   <div className="w-full bg-white/90 backdrop-blur-sm py-3 rounded-xl text-center text-xs font-bold uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                     View Details
                   </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="mt-4 space-y-1">
                <div className="flex justify-between items-start">
                  <h2 className="text-sm font-semibold text-slate-800 tracking-tight leading-tight uppercase truncate pr-4">
                    {product.title}
                  </h2>
                  {/* <span className="text-sm font-black text-slate-900">
                    {product.price ? `₹${product.price.toLocaleString()}` : "P.O.R"}
                  </span> */}
                </div>
                {/* <p className="text-xs text-slate-400 line-clamp-1 italic">
                  {product.description || "No description available"}
                </p> */}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl">
          <p className="text-gray-400 text-sm tracking-widest uppercase font-medium">No items found in this category.</p>
        </div>
      )}
    </main>
  );
}