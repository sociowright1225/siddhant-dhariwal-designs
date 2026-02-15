"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const projectsTop = [
  "https://images.unsplash.com/photo-1615874959474-d609969a20ed",
  "https://images.unsplash.com/photo-1618220179428-22790b461013",
  "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a",
  "https://images.unsplash.com/photo-1615874959474-d609969a20ed",
  "https://images.unsplash.com/photo-1618220179428-22790b461013",
  "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a",
];

const projectsBottom = [
  "https://images.unsplash.com/photo-1615529182904-14819c35db37",
  "https://images.unsplash.com/photo-1616594039964-ae9021a400a0",
  "https://images.unsplash.com/photo-1615873968403-89e068629265",
  "https://images.unsplash.com/photo-1615874959474-d609969a20ed",
  "https://images.unsplash.com/photo-1618220179428-22790b461013",
  "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a",
];

export default function ProjectsScrollSection() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null); // Drag constraints के लिए
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax movement ranges
  const moveRange = isMobile ? ["0%", "-10%"] : ["0%", "-30%"];
  const moveRangeReverse = isMobile ? ["-10%", "0%"] : ["-30%", "0%"];

  const xTop = useTransform(scrollYProgress, [0, 1], moveRange);
  const xBottom = useTransform(scrollYProgress, [0, 1], moveRangeReverse);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">Projects</p>
        <h2 className="text-3xl md:text-5xl font-semibold max-w-2xl leading-tight">
          Crafting spaces that <br className="hidden md:block" /> inspire daily living
        </h2>
      </div>

      <div ref={containerRef} className="cursor-grab active:cursor-grabbing">
        {/* TOP ROW - Drag enabled */}
        <motion.div 
          style={{ x: xTop }} 
          drag="x"
          dragConstraints={{ left: -1000, right: 0 }} // इसकी वैल्यू कंटेंट की लम्बाई के हिसाब से सेट करें
          className="flex gap-4 md:gap-8 mb-4 md:mb-8 whitespace-nowrap px-6"
        >
          {projectsTop.map((img, i) => (
            <ProjectCard key={i} img={img} />
          ))}
        </motion.div>

        {/* BOTTOM ROW - Drag enabled */}
        <motion.div 
          style={{ x: xBottom }} 
          drag="x"
          dragConstraints={{ left: -1000, right: 0 }}
          className="flex gap-4 md:gap-8 whitespace-nowrap px-6"
        >
          {projectsBottom.map((img, i) => (
            <ProjectCard key={i} img={img} />
          ))}
        </motion.div>
      </div>

      <div className="flex justify-center mt-16 px-6">
        <a href="/projects" className="w-full sm:w-auto max-lg:text-center bg-black text-white hover:bg-white hover:text-black border border-black transition-all duration-300 px-10 py-4 rounded-full text-sm font-medium">
          View All Projects
        </a>
      </div>
    </section>
  );
}

function ProjectCard({ img }) {
  return (
    <div className="min-w-[260px] md:min-w-[400px] group select-none">
      <div className="relative h-48 md:h-72 rounded-2xl md:rounded-3xl overflow-hidden mb-4 pointer-events-none">
        <Image
          src={img}
          alt="Project"
          fill
          sizes="(max-width: 768px) 260px, 400px"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />
      </div>
      <div className="px-2">
        <p className="text-[10px] md:text-xs uppercase tracking-widest text-gray-400 font-bold">Interior Design</p>
        <h3 className="text-base md:text-lg font-medium text-gray-900 group-hover:underline decoration-1 underline-offset-4">Modern Minimalist Concept</h3>
      </div>
    </div>
  );
}