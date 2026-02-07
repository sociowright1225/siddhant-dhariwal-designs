"use client";

import Image from "next/image";
import contact from "@/public/homepage/contact.jpg"

export default function CTA() {
  return (
    <section className="relative h-[80vh] md:h-[90vh] w-full overflow-hidden">
      
      {/* BACKGROUND IMAGE */}
      <Image
        src={contact}
        alt="Luxury Sofa"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      {/* DARK OVERLAY - Mobile par overlay thoda dark rakha hai taaki text readable ho */}
      <div className="absolute inset-0 bg-black/30 md:bg-black/25" />

      {/* CONTENT */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="max-w-2xl text-center px-6">
          
          <p className="text-xs md:text-sm tracking-[0.2em] text-white/90 mb-4 uppercase">
            Comfort • Style • Luxury
          </p>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight mb-6">
            Discover Elegant Comfort
          </h2>

          <p className="text-sm md:text-lg text-white/80 mb-10 max-w-lg mx-auto leading-relaxed">
            Elevate your living space with thoughtfully designed furniture
            that blends comfort, elegance, and timeless craftsmanship.
          </p>

          {/* BUTTONS - Mobile par stack, Small screen se row mein */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="w-full sm:w-auto px-10 py-4 rounded-full bg-white text-black text-sm font-semibold hover:bg-black hover:text-white border border-white transition-all duration-300">
              Shop Now
            </button>

            <button className="w-full sm:w-auto px-10 py-4 rounded-full border border-white/50 text-white text-sm font-semibold backdrop-blur-sm hover:bg-white hover:text-black transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}