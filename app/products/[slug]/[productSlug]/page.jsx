"use client";

import api from "@/lib/api";
import { useEffect, useState, use } from "react";
import Image from "next/image";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import { Mail, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function ProductDetailsPage({ params }) {
  const resolvedParams = use(params);
  const { slug, productSlug } = resolvedParams; 

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const { data } = await api.get("/products");
        
        // Match logic: title/slug dono ko hyphenated format mein compare karein
        const found = data.find(p => {
          const itemSlug = p.slug.replace(/\s+/g, '-').toLowerCase();
          return itemSlug === productSlug;
        });
        
        setProduct(found);
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
    <div className="max-w-7xl mx-auto px-6 py-12">
      <Breadcrumbs 
        title={product.title} 
        breadcrumbs={["Home", slug.replace(/-/g, " "), product.title]} 
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
        <div className="relative h-[500px] bg-gray-100 rounded-3xl overflow-hidden">
          <Image 
             src={product.image.url} 
             alt={product.title} 
             fill 
             className="object-contain " 
             priority 
          />
        </div>
        <div className="">
          <h1 className="text-4xl font-extrabold mb-4">{product.title}</h1>
          <p className="text-2xl text-gray-400 font-semibold mb-6">
            {product.price ? `₹${product.price}` : "Price on Request"}
          </p>
           <p className="mb-4 text-sm text-gray-500">Category: {product.category}</p>
          <div className="prose prose-gray mb-8">
             <h3 className="text-lg font-bold">Product Specifications:</h3>
             <p className="whitespace-pre-line text-gray-600">{product.description}</p>
          </div>
         
          <Link href={"/contact"} className=" border border-gray-900 text-gray-900 hover:bg-gray-900
           hover:text-white font-bold py-2 px-6 rounded-full gap-2 transition-all">
              {/* <Mail size={20} /> */}
              Contact Us
            </Link>
        </div>
      </div>
    </div>
  );
}