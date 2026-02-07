import React from 'react';

const MeetOurFounder = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 bg-white font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left Column: Image & Branding */}
        <div className="relative group">
          <div className="overflow-hidden rounded-lg shadow-xl aspect-square relative">
            {/* Main Image Placeholder */}
            <img
              src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=1000"
              alt="Founders"
              className="w-full h-full object-cover"
            />
            
            {/* Branding Overlay (Matches the Green Wall) */}
            <div className="absolute inset-0 bg-emerald-900/10 flex flex-col items-center justify-start pt-12">
               <div className="bg-emerald-800 p-8 rounded-sm flex flex-col items-center gap-4 border border-emerald-700/50 shadow-2xl">
                  {/* Mock Logo */}
                  <div className="w-16 h-16 border-2 border-amber-200 rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 border border-amber-100 rotate-45" />
                  </div>
                  <h2 className="text-4xl font-light tracking-[0.3em] text-amber-200 uppercase">
                    LOREM
                  </h2>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="flex flex-col space-y-8 py-4">
          <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
            Meet Our Founders
          </h1>

          <div className="space-y-6 text-gray-600 leading-relaxed text-sm lg:text-base">
            <p className="font-medium text-gray-800">
              Founded by visionaries — Ipsum and Dolor Sit, Lorem grew from a simple idea - 
              that everyday objects can carry the depth and refinement of art. The founders 
              bring their combined expertise to bridge the gap between art and accessibility.
            </p>

            <p>
              With a background in creative direction, Ipsum’s world is defined by a deep 
              fascination with color and form. Her practice revolves around the quiet power 
              of detail — how a shift in hue, a line of stitch, or a change in proportion 
              can completely alter the way a piece is felt. This sensitivity infuses the 
              language of design, where palettes feel intentional and textures are expressive.
            </p>

            <p>
              With a foundation that lies in structural engineering, Dolor brings a technical 
              curiosity and a passion for material innovation. His approach combines 
              functionality with design integrity — constantly exploring new possibilities 
              in how materials can interact. From pairing metal with ceramic to reimagining 
              familiar forms through unexpected textures, his work pushes the boundaries 
              of craft and construction.
            </p>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default MeetOurFounder;