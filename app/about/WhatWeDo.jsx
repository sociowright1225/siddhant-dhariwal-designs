import React from 'react';

const WhatWeDo = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 bg-white font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Column: Process/Craft Image */}
        <div className="relative">
          <div className="overflow-hidden rounded-lg shadow-md aspect-square">
            <img
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000"
              alt="Craftsmanship and Process"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="flex flex-col space-y-8 lg:pl-8">
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
            What We Do
          </h2>

          <div className="space-y-6 text-gray-600 leading-relaxed text-sm lg:text-base">
            <p className="font-medium text-gray-800">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim 
              veniam, quis nostrud exercitation ullamco laboris.
            </p>

            <p>
              The materials we choose are selected not only for their texture and durability, 
              but also to uphold our commitment to sustainability and longevity. At the core 
              of our practice lies a distinctive design language — an exploration of lines, 
              intersections, and balance.
            </p>

            <p>
              Each piece is reimagined through our collections to invite a deeper 
              appreciation of form and connection. We are fascinated by how diverse 
              materials can interact, complement, and elevate one another in a shared space.
            </p>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default WhatWeDo;