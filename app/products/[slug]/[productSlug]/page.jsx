"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams();
  
  // Folder structure: products/[slug]/[productSlug]
  const categorySlug = params.slug; 
  const productSlug = params.productSlug; 
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productSlug) return;
      try {
        // --- IMPORTANT: Backend ka sahi route use karein ---
        // Agar aapka backend slug se data nikalne ke liye /single/:slug use karta hai to wahi likhein
        const res = await fetch(`http://localhost:5000/api/products/single/${productSlug}`);
        const data = await res.json();
        
        if (data) {
          setProduct(data);
          // --- IMAGE FIX: Agar mainImage null hai to gallery ki pehli image uthao ---
          const initialImage = data.mainImage?.url || (data.gallery && data.gallery.length > 0 ? data.gallery[0].url : "/placeholder.jpg");
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

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-2xl animate-pulse tracking-widest uppercase text-gray-400">Loading Designs...</div>;
  
  if (!product) return <div className="p-20 text-center text-red-500 font-bold">Product Not Found! (Slug: {productSlug})</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10">
      {/* Breadcrumbs */}
      <nav className="flex space-x-2 text-xs font-bold uppercase tracking-widest text-gray-300 mb-10">
        <Link href="/" className="hover:text-black transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/products/${categorySlug}`} className="hover:text-black transition-colors">
            {decodeURIComponent(categorySlug)}
        </Link>
        <span>/</span>
        <span className="text-black font-extrabold">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* LEFT: IMAGES SECTION */}
        <div className="space-y-6">
          <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-gray-100 border border-gray-100 shadow-2xl">
            {/* Main Active Image */}
            <img 
              src={activeImage} 
              alt={product.title} 
              className="w-full h-full object-cover transition-opacity duration-500"
              onError={(e) => { e.target.src = "/placeholder.jpg"; }} // Fallback agar URL corrupt ho
            />
          </div>
          
          {/* Gallery Thumbnails */}
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {/* Gallery array check */}
            {product.gallery && product.gallery.length > 0 ? (
              product.gallery.map((img, i) => (
                <button 
                  key={img._id || i} 
                  onClick={() => setActiveImage(img.url)}
                  className={`w-24 h-24 flex-shrink-0 rounded-[1.5rem] overflow-hidden border-2 transition-all duration-300 ${activeImage === img.url ? "border-black scale-95 shadow-lg" : "border-transparent opacity-50 hover:opacity-100"}`}
                >
                  <img src={img.url} className="w-full h-full object-cover" alt={`Gallery ${i}`} />
                </button>
              ))
            ) : (
              <p className="text-xs text-gray-400 italic">No extra gallery images</p>
            )}
          </div>
        </div>

        {/* RIGHT: CONTENT SECTION */}
        <div className="flex flex-col justify-center">
          <div className="mb-6">
             <span className="bg-black text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
                {product.category}
             </span>
          </div>

          <h1 className="text-6xl font-black text-gray-900 mb-4 leading-none tracking-tighter">
            {product.title}
          </h1>

          <p className="text-3xl font-medium text-gray-400 mb-10 italic tracking-tight">
            {product.price ? `₹${product.price.toLocaleString()}` : "Price on Request"}
          </p>

          <div className="space-y-10">
            <div className="border-l-4 border-black pl-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-300 mb-3 font-sans">The Story</h3>
              <p className="text-gray-600 leading-relaxed text-xl">
                {product.description || "Every piece is crafted to tell a story of luxury and timeless elegance."}
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button className="flex-[3] bg-black text-white py-6 rounded-full font-black hover:bg-gray-800 shadow-2xl active:scale-95 transition-all uppercase tracking-[0.2em] text-xs">
                Inquire via WhatsApp
              </button>
              <button className="flex-1 px-8 py-6 border-2 border-gray-100 rounded-full hover:bg-gray-50 transition-all flex items-center justify-center group shadow-sm active:scale-90">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="group-hover:text-red-500 transition-colors">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}