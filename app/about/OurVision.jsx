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
              At the heart of the studio lies an uncompromising belief: true design begins with
fascination.Each piece emerges from a continuous search—for forms, materials,
and ideas that evoke emotion and intrigue. The process is instinctive yet
deliberate, resulting in objects that transcend utility and enter the realm of
collectible design.Indian craftsmanship forms the soul of this exploration.
Traditional techniques and regional artistry are not merely referenced—they are
reinterpreted, refined, and elevated into contemporary expressions that resonate
globally.
              </p>
            </div>
          </div>
          {/* Right: Vision Image */}
          <div className="order-1 lg:order-2 relative">
            <div className="overflow-hidden rounded-2xl shadow-sm aspect-[4/3]">
              <img
                src="https://res.cloudinary.com/dwdmczhsn/image/upload/q_auto/f_auto/v1775493846/our_vision.jpg_nelm9m.jpg"
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