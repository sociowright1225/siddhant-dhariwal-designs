import React from "react";

const MeetOurFounder = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 bg-white font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Column: Image & Branding */}
        <div className="relative group">
          <div className="overflow-hidden rounded-lg shadow-xl aspect-square relative">
            {/* Main Image Placeholder */}
            <img
              src="https://res.cloudinary.com/dwdmczhsn/image/upload/v1773977801/DSC_1276_copy_2_2_ixhedt.jpg"
              alt="Founders"
              className="w-full h-full object-cover"
            />

           
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="flex flex-col space-y-8 py-4">
          <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
            Meet Our Founder
          </h1>

          <div className="space-y-6 text-gray-600 leading-relaxed text-sm lg:text-base">
            <p className="font-medium text-gray-800">
              In the evolving landscape of contemporary design, Siddhant
              Dhariwal represents a new generation of creators who seamlessly
              merge heritage with innovation. A graduate in Lifestyle Accessory
              Design from UID Ahmedabad, his foundation in design thinking
              informs a practice that is both intuitive and deeply
              material-driven. Establishing his studio in 2022, at a time when
              the world was recalibrating, he chose to build with
              intent—transforming uncertainty into an opportunity to create
              objects of lasting value.
            </p>

            <p>
              Rooted in an entrepreneurial mindset and guided by an instinct for
              design, Siddhant’s journey is defined by initiative. From ideation
              to execution, his practice is deeply hands-on—driven by a pursuit
              of originality and a commitment to excellence.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeetOurFounder;
