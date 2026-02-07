"use client"

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const WhatWeCreate = () => {
  // 1. Create a reference to the scrollable container
  const scrollRef = useRef(null);

  const categories = [
    {
      title: "Custom Lighting Design",
      image:
        "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Sculptural Lighting",
      image:
        "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Design Consultation",
      image:
        "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Process Lights",
      image:
        "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&q=80&w=800",
    },
  ];

  // 2. Navigation function
  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = 400; // Adjust based on card width
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 bg-[#FAF9F6]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div className="space-y-2">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">What We Create</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Thoughtful Designs for Every Corner of Your Home
          </h2>
        </div>

        {/* 3. Attach the scroll functions to buttons */}
        <div className="flex gap-2">
          <button 
            onClick={() => scroll('left')}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 active:scale-95 transition-all"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* 4. Add ref and hide scrollbar */}
      <div 
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category, index) => (
          <div key={index} className="min-w-[300px] md:min-w-[400px] snap-start group cursor-pointer">
            <div className="overflow-hidden rounded-xl aspect-[4/5] mb-4">
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex items-center gap-2 text-lg font-medium text-gray-900 group-hover:underline underline-offset-4">
              {category.title}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhatWeCreate;