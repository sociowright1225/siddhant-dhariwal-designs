"use client";

import api from "@/lib/api";
import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link"; 
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import { ArrowUpRight, ImageIcon } from "lucide-react";

export default function CategoryPage({ params }) {
  const resolvedParams = use(params);
  const rawSlug = resolvedParams.slug; 
  
  // URL Decoding (%26 -> &)
  const decodedSlug = decodeURIComponent(rawSlug).toLowerCase();
  const categoryTitle = decodedSlug.replace(/-/g, " ");

  const [displayItems, setDisplayItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/products");
        
        // Filter products by category
        const filteredProducts = data.filter((p) => {
          if (!p.category) return false;
          const dbSlug = p.category.toLowerCase().trim().replace(/\s+/g, '-');
          return dbSlug === decodedSlug;
        });

        // --- LOGIC: Har Gallery Image ko ek alag "Card Item" banana ---
        let finalGridItems = [];

        filteredProducts.forEach((product) => {
          const productSlug = product.slug?.replace(/\s+/g, '-').toLowerCase();

          // 1. Main Image Card
          finalGridItems.push({
            id: `${product._id}-main`,
            title: product.title,
            price: product.price,
            image: product.mainImage?.url,
            link: `/products/${rawSlug}/${productSlug}`,
            isMain: true
          });

          // 2. Gallery Image Cards
          if (product.gallery && product.gallery.length > 0) {
            product.gallery.forEach((galImg, index) => {
              finalGridItems.push({
                id: galImg._id || `${product._id}-gal-${index}`,
                title: `${product.title} (View ${index + 1})`,
                price: product.price,
                image: galImg.url,
                link: `/products/${rawSlug}/${productSlug}`,
                isMain: false
              });
            });
          }
        });

        setDisplayItems(finalGridItems);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFilteredProducts();
  }, [decodedSlug, rawSlug]);

  if (loading) return <div className="text-center py-20 font-bold text-indigo-600">Loading {categoryTitle} Gallery...</div>;

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <Breadcrumbs
        title={categoryTitle}
        breadcrumbs={["Home", "Portfolio", categoryTitle]}
      />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12 border-l-4 border-indigo-600 pl-6">
           <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">
             {categoryTitle} Collection <span className="text-indigo-600">/</span> {displayItems.length} Shots
           </h2>
        </header>

        {displayItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {displayItems.map((item) => (
              <Link href={item.link} key={item.id} className="group">
                <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 border border-slate-100 flex flex-col h-full">
                  
                  {/* Image Holder */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden">
                    <Image
                      src={item.image || "/placeholder.jpg"}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    
                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <div className="h-14 w-14 bg-white rounded-full flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500">
                          <ArrowUpRight className="text-slate-900" size={24} />
                       </div>
                    </div>

                    {/* Badge */}
                    <div className="absolute top-4 left-4">
                       <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter shadow-sm ${item.isMain ? 'bg-indigo-600 text-white' : 'bg-white/90 text-slate-600'}`}>
                          {item.isMain ? 'Cover' : 'Angle Shot'}
                       </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6">
                    <h3 className="font-bold text-slate-800 text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-between mt-3">
                       <span className="text-xs font-black text-indigo-600">
                         {item.price ? `₹${item.price}` : "INQUIRY"}
                       </span>
                       <div className="flex items-center gap-1 text-slate-300 group-hover:text-indigo-400 transition-colors">
                          <ImageIcon size={14} />
                          <span className="text-[10px] font-bold">VIEW PROJECT</span>
                       </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
             <p className="text-slate-400 font-bold">No images available for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}