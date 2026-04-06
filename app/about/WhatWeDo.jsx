import React from "react";

const WhatWeDo = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 bg-white font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Process/Craft Image */}
        <div className="relative">
          <div className="overflow-hidden rounded-lg shadow-md aspect-square">
            <img
              src="https://res.cloudinary.com/dwdmczhsn/image/upload/q_auto/f_auto/v1775493945/what_we_do_section_image.jpg_o8mqnk.jpg"
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
              Siddhant Dhariwal is a design studio specializing in bespoke
              lighting and collectible home objects, distinguished by its
              sculptural approach and refined materiality.
            </p>

            <p>
              The studio’s signature lies in its masterful interplay of
              materials—hand-blown glass, cast brass, alabaster, marble, wood,
              ceramic, resin, and semi-precious stones. Each element is
              carefully curated and composed, allowing contrasts—translucent and
              opaque, raw and polished—to coexist in harmony. Every creation is
              100% made in India, realized by generational artisans whose
              expertise transforms raw materials into objects of precision and
              beauty. This collaboration between designer and craftsman results
              in pieces that are not only visually striking but inherently rare.
            </p>

           
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
