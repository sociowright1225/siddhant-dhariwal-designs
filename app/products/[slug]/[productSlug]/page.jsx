"use client";

import api from "@/lib/api";
import { useEffect, useState, use } from "react";
import Image from "next/image";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import Link from "next/link";

export default function ProductDetailsPage({ params }) {
  const resolvedParams = use(params);
  const { slug, productSlug } = resolvedParams; 

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(""); // Gallery click handle karne ke liye
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const { data } = await api.get("/products");
        
        const found = data.find(p => {
          const itemSlug = p.slug.replace(/\s+/g, '-').toLowerCase();
          return itemSlug === productSlug;
        });
        
        if (found) {
          setProduct(found);
          // Default active image set karein
          setActiveImage(found.mainImage?.url || found.image?.url);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [productSlug]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!product) return <div className="text-center py-20">Product not found.</div>;

  return (
    <div>
      <Breadcrumbs 
        title={product.title} 
        breadcrumbs={["Home", slug.replace(/-/g, " "), product.title]} 
      />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
          
          {/* LEFT: IMAGES SECTION */}
          <div className="flex flex-col gap-4">
            {/* Main Big Image */}
            <div className="relative h-[500px] bg-gray-100 rounded-3xl overflow-hidden border border-gray-100">
              <Image 
                src={activeImage || "/placeholder.jpg"} 
                alt={product.title} 
                fill 
                className="object-contain" 
                priority 
              />
            </div>

            {/* Gallery Thumbnails */}
            {product.gallery && product.gallery.length > 0 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {/* Pehla thumbnail hamesha Main Image hoga */}
                <div 
                  className={`relative min-w-[80px] h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition ${activeImage === product.mainImage?.url ? 'border-black' : 'border-transparent'}`}
                  onClick={() => setActiveImage(product.mainImage?.url)}
                >
                  <Image src={product.mainImage?.url} alt="Main" fill className="object-cover" />
                </div>

                {/* Baaki gallery items */}
                {product.gallery.map((img, index) => (
                  <div 
                    key={img._id || index}
                    className={`relative min-w-[80px] h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition ${activeImage === img.url ? 'border-black' : 'border-transparent'}`}
                    onClick={() => setActiveImage(img.url)}
                  >
                    <Image src={img.url} alt={`Gallery ${index}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: DETAILS SECTION */}
          <div className="flex flex-col">
            <h1 className="text-4xl font-extrabold mb-4">{product.title}</h1>
            <p className="text-2xl text-gray-400 font-semibold mb-6">
              {product.price ? `₹${product.price}` : "Price on Request"}
            </p>
            <p className="mb-4 text-sm text-gray-500 bg-gray-100 inline-block w-fit px-3 py-1 rounded-full">
              Category: {product.category}
            </p>
            
            <div className="prose prose-gray mb-8">
               <h3 className="text-lg font-bold">Product Specifications:</h3>
               <p className="whitespace-pre-line text-gray-600 mt-2">{product.description}</p>
            </div>
           
            <Link href={"/contact"} className="w-fit border border-gray-900 text-center text-gray-900 hover:bg-gray-900 hover:text-white font-bold py-3 px-10 rounded-full transition-all">
              Contact Us for Inquiry
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}