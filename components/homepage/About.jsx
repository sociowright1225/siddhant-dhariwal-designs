"use client";

import Image from "next/image";

// Categories data for easy management 
// Wall Decor
// Pendant Light
// Table Lamp
// Floor Lamp
// Home Decor
const categories = [
  { title: "Home Decor", img: "https://images.unsplash.com/photo-1615874959474-d609969a20ed" },
  { title: "Floor Lamp", img: "https://images.unsplash.com/photo-1618220179428-22790b461013" },
  { title: "Table Lamp", img: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a" },
  { title: "Pendant Light", img: "https://images.unsplash.com/photo-1618220179428-22790b461013" },
];

export default function CategorySection() {
  return (
 <div className="flex flex-col justify-center items-center">
     <section className="py-16 max-w-7xl w-full px-6 lg:px-20 bg-white">
      <div className="max-w-7xl mx-auto text-center mb-12">
        {/* HEADER TEXT */}
        <h2 className="text-2xl lg:text-3xl mb-3 ">
          Find pieces that define your home
        </h2>
        <p className="text-gray-600 text-sm max-w-3xl mx-auto leading-relaxed">
          Explore our collection by category — whether you&apos;re furnishing your living room, 
          bedroom, or workspace, we have timeless pieces made just for you.
        </p>
      </div>

      {/* CATEGORY GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((item, index) => (
          <div key={index} className="relative group cursor-pointer overflow-hidden rounded-sm">
            {/* Image Container */}
            <div className="relative aspect-[3/4] w-full border border-gray-100">
              <Image
                src={item.img}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Badge/Label */}
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-white/90 backdrop-blur-sm text-black text-sm px-4 py-1.5 rounded-full shadow-sm font-medium">
                  {item.title}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-16 px-6">
        <a href="/projects" className="w-full sm:w-auto max-lg:text-center bg-black text-white hover:bg-white hover:text-black border border-black transition-all duration-300 px-10 py-4 rounded-full text-sm font-medium">
          About Us
        </a>
      </div>
    </section>
 </div>
  );
}