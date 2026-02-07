"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const services = [
  {
    step: "1",
    title: "Custom Lighting Design",
    desc: "Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200", 
  },
  {
    step: "2",
    title: "Sculptural Lighting",
    desc: "Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book..",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200",
  },
  {
    step: "3",
    title: "Design Consultation",
    desc: "Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?q=80&w=1200",
  },
  {
    step: "4",
    title: "Process Lights",
    desc: "Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200",
  },
 
];

const ServiceCard = ({ service, index, progress, range, targetScale }) => {
  // This handles the scaling down of cards as the next one comes over it
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div className="h-screen flex items-start justify-center sticky top-0">
      <motion.div
        style={{
          scale,
          top: `calc(10% + ${index * 25}px)`,
        }}
        className="relative w-full max-w-6xl bg-white rounded-[40px] max-lg:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px] max-lg:h-[700px] border border-gray-100"
      >
        {/* Left Section: Text Content */}
        <div className="flex-1 p-10 md:p-20 flex flex-col justify-center">
          <span className="text-8xl font-light text-[#EBE6E0] mb-6">
            {service.step}
          </span>
          
          <h3 className="text-4xl font-semibold text-[#333] leading-tight mb-6">
            {/* Logic to highlight specific words in gold like the image */}
            {service.title.includes("Support") ? (
              <>
                After-Sales <span className="text-[#B59A7D]">Support</span> <br /> 
                and <span className="text-[#B59A7D]">Maintenance</span>
              </>
            ) : service.title}
          </h3>

          <p className="text-gray-500 text-lg leading-relaxed max-w-md">
            {service.desc}
          </p>
        </div>

        {/* Right Section: Image */}
        <div className="flex-1 relative overflow-hidden">
          <img
            src={service.image}
            alt={service.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default function ServicesStackSection() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={container} className="relative bg-[#F8F6F3] pb-10">
      <div className="max-w-7xl mx-auto px-6 pt-20">
        <h2 className="text-5xl font-light text-[#2D2D2D] ">
          How We <span className="text-[#B59A7D] italic">Simplify</span> Your <br /> 
          Enlightment Experience
        </h2>
      </div>

      <div className="pb-[10vh]">
        {services.map((service, i) => {
          const targetScale = 1 - (services.length - i) * 0.05;
          return (
            <ServiceCard
              key={`p_${i}`}
              index={i}
              service={service}
              progress={scrollYProgress}
              range={[i * 0.25, 1]}
              targetScale={targetScale}
            />
          );
        })}
      </div>
    </div>
  );
}