import React from "react";
import Image from "next/image";
import about3 from '@/public/about/about3.jpg'; 

const Breadcrumbs = ({ title, breadcrumbs, image }) => {
  return (
    <section className="relative w-full py-46 flex flex-col items-center justify-center overflow-hidden">
      
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={image}
          alt={title}
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center text-white">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm md:text-base font-sans text-gray-200 mb-2">
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              <span
                className={
                  index === breadcrumbs.length - 1
                    ? "text-[#d4b08c] font-medium uppercase tracking-wider"
                    : "opacity-80"
                }
              >
                {item}
              </span>
              {index < breadcrumbs.length - 1 && <span>-</span>}
            </React.Fragment>
          ))}
        </nav>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight">
          {title}
        </h1>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
    </section>
  );
};

export default Breadcrumbs;
