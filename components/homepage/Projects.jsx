"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const projectsTop = [
  {
    img: "https://images.unsplash.com/photo-1615874959474-d609969a20ed",
    title: "Private Residence, Mumbai",
  },
  {
    img: "https://images.unsplash.com/photo-1618220179428-22790b461013",
    title: "Luxury Penthouse — Worli",
  },
  {
    img: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a",
    title: "Boutique Hotel Lobby",
  },
  {
    img: "https://images.unsplash.com/photo-1615874959474-d609969a20ed",
    title: "Fine Dining Restaurant",
  },
];

const projectsBottom = [
  {
    img: "https://images.unsplash.com/photo-1615529182904-14819c35db37",
    title: "Corporate Headquarters",
  },
  {
    img: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0",
    title: "Heritage Villa Restoration",
  },
  {
    img: "https://images.unsplash.com/photo-1615873968403-89e068629265",
    title: "Rooftop Terrace Lighting",
  },
  {
    img: "https://images.unsplash.com/photo-1615874959474-d609969a20ed",
    title: "Spa & Wellness Retreat",
  },
];

export default function ProjectsScrollSection() {
  const sectionRef = useRef(null);
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

  const moveRange = isMobile ? ["0%", "-10%"] : ["0%", "-30%"];
  const moveRangeReverse = isMobile ? ["-10%", "0%"] : ["-30%", "0%"];

  const xTop = useTransform(scrollYProgress, [0, 1], moveRange);
  const xBottom = useTransform(scrollYProgress, [0, 1], moveRangeReverse);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">
          Projects
        </p>

        <h2 className="text-3xl md:text-5xl font-semibold max-w-2xl leading-tight">
          Spaces We Have Had the Honour to Transform
        </h2>

        <p className="text-base max-w-2xl">
          Every project we undertake is a collaboration between light, space, and
          vision. Here is a glimpse into the worlds we have helped bring to life.
        </p>
      </div>

     <div className=" flex justify-center items-center">
       <div className="cursor-grab active:cursor-grabbing">
        {/* TOP ROW */}
        <motion.div
          style={{ x: xTop }}
          drag="x"
          dragConstraints={{ left: -1000, right: 0 }}
          className="flex gap-4 md:gap-8 mb-4 md:mb-8 whitespace-nowrap px-6"
        >
          {projectsTop.map((item, i) => (
            <ProjectCard key={i} img={item.img} title={item.title} />
          ))}
        </motion.div>

        {/* BOTTOM ROW */}
        <motion.div
          style={{ x: xBottom }}
          drag="x"
          dragConstraints={{ left: -1000, right: 0 }}
          className="flex gap-4 md:gap-8 whitespace-nowrap px-6"
        >
          {projectsBottom.map((item, i) => (
            <ProjectCard key={i} img={item.img} title={item.title} />
          ))}
        </motion.div>
      </div>
     </div>

      <div className="flex justify-center mt-16 px-6">
        <a
          href="/projects"
          className="w-full sm:w-auto max-lg:text-center bg-black text-white hover:bg-white hover:text-black border border-black transition-all duration-300 px-10 py-4 rounded-full text-sm font-medium"
        >
          View All Projects
        </a>
      </div>
    </section>
  );
}

function ProjectCard({ img, title }) {
  return (
    <div className="min-w-[260px] md:min-w-[400px] group select-none">
      <div className="relative h-48 md:h-72 rounded-2xl md:rounded-3xl overflow-hidden mb-4 pointer-events-none">
        <Image
          src={img}
          alt={title}
          fill
          sizes="(max-width: 768px) 260px, 400px"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />
      </div>

      <div className="px-2">
        <p className="text-[10px] md:text-xs uppercase tracking-widest text-gray-400 font-bold">
          Interior Design
        </p>

        <h3 className="text-base md:text-lg font-medium text-gray-900 group-hover:underline decoration-1 underline-offset-4">
          {title}
        </h3>
      </div>
    </div>
  );
}