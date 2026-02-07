import React from 'react';

const WhatWeDo = () => {
  return (
    <div className="bg-[#FAF9F6] text-gray-900 font-sans">
      {/* Our Vision Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left: Text Content */}
          <div className="order-2 lg:order-1 space-y-8">
            <h2 className="text-4xl font-bold tracking-tight">
              Our Vision
            </h2>
            <div className="space-y-6 text-gray-600 leading-relaxed text-base lg:text-lg">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do 
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut 
                enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </p>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse 
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat 
                cupidatat non proident, sunt in culpa qui officia deserunt mollit.
              </p>
            </div>
          </div>
          {/* Right: Vision Image */}
          <div className="order-1 lg:order-2 relative">
            <div className="overflow-hidden rounded-2xl shadow-sm aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1200"
                alt="Showroom display"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-6 right-6">
                <p className="text-white text-lg font-light tracking-wide opacity-90 drop-shadow-md">
                  here's what we do
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

   
    </div>
  );
};

export default WhatWeDo;