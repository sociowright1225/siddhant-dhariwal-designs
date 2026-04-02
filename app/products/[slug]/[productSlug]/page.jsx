"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams();
  const categorySlug = params.slug;
  const productSlug = params.productSlug;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productSlug) return;
      try {
        const res = await fetch(
          `https://siddhant-dhariwal-designs-e6u4.vercel.app/api/products/single/${productSlug}`,
        );
        const data = await res.json();

        if (data) {
          setProduct(data);
          const initialImage =
            data.mainImage?.url || data.gallery?.[0]?.url || "/placeholder.jpg";
          setActiveImage(initialImage);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productSlug]);

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">
          Loading Excellence
        </p>
      </div>
    );

  if (!product)
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-light mb-4">Product Not Found</h2>
          <Link
            href="/"
            className="text-sm font-bold border-b border-black pb-1"
          >
            Return Home
          </Link>
        </div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-28">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-12">
        <Link href="/" className="hover:text-black transition-colors">
          Home
        </Link>
        <span className="text-gray-200">/</span>
        <Link
          href={`/products/${categorySlug}`}
          className="hover:text-black transition-colors"
        >
          {decodeURIComponent(categorySlug)}
        </Link>
        <span className="text-gray-200">/</span>
        <span className="text-black">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        {/* LEFT: IMAGES SECTION (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative aspect-[4/5] bg-red-500 rounded-3xl overflow-hidden bg-gray-50 group">
            <img
              src={activeImage}
              alt={product.title}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
            />
          </div>
          {/* Thumbnail Gallery Row */}
          {product.gallery && product.gallery.length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
              {/* Pehle Main Image ko as a thumbnail dikhayen (optional) */}
              <button
                onClick={() => setActiveImage(product.mainImage?.url)}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  activeImage === product.mainImage?.url
                    ? "border-black"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={product.mainImage?.url}
                  alt="Main"
                  className="w-full h-full object-cover"
                />
              </button>

              {/* Gallery Images */}
              {product.gallery.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(img.url)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === img.url
                      ? "border-black"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`${product.title} gallery ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: CONTENT SECTION (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col justify-start pt-4">
          <div className="mb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 block mb-2">
              Collection — {product.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 leading-[1.1] tracking-tight">
              {product.title}
            </h1>
          </div>

          <div className="flex items-baseline gap-4 mb-10">
            <p className="text-2xl font-medium text-gray-900">
              {product.price
                ? `₹${product.price.toLocaleString()}`
                : "Price on Request"}
            </p>
          </div>

          <div className="space-y-8 border-t border-gray-100 pt-8">
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-900 mb-4">
                Description
              </h3>
              <p className="text-gray-500 leading-relaxed text-lg font-light">
                {product.description ||
                  "A masterclass in design and craftsmanship, specifically tailored for those who appreciate the finer details in life."}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 pt-6">
              <button className="w-full bg-black text-white py-5 rounded-full font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 group active:scale-[0.98]">
                CONTACT US
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
