"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";

export default function ProjectsScrollSection() {
  const sectionRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [products, setProducts] = useState([]); // Removed TypeScript <any[]>
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://siddhant-dhariwal-designs-e6u4.vercel.app/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

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

  const half = Math.ceil(products.length / 2);
  const projectsTop = products.slice(0, half);
  const projectsBottom = products.slice(half);

  if (loading) return <div className="py-24 text-center">Loading Gallery...</div>;

  return (
    <section ref={sectionRef} className="py-16 md:py-24 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">
          Projects
        </p>
        <h2 className="text-3xl md:text-5xl font-semibold max-w-2xl leading-tight">
          Spaces We Have Had the Honour to Transform
        </h2>
      </div>

      <div className="flex justify-center items-center">
        <div className="cursor-grab active:cursor-grabbing w-full">
          {/* TOP ROW */}
          <motion.div
            style={{ x: xTop }}
            className="flex gap-4 md:gap-8 mb-4 md:mb-8 whitespace-nowrap px-6"
          >
            {projectsTop.map((item) => (
              <ProjectCard 
                key={item._id} 
                img={item.image.url} 
                title={item.title} 
                category={item.category}
              />
            ))}
          </motion.div>

          {/* BOTTOM ROW */}
          <motion.div
            style={{ x: xBottom }}
            className="flex gap-4 md:gap-8 whitespace-nowrap px-6"
          >
            {projectsBottom.map((item) => (
              <ProjectCard 
                key={item._id} 
                img={item.image.url} 
                title={item.title} 
                category={item.category}
              />
            ))}
          </motion.div>
        </div>
      </div>

      <div className="flex justify-center mt-16 px-6">
        <a
          href="/projects"
          className="w-full sm:w-auto text-center bg-black text-white hover:bg-gray-800 transition-all duration-300 px-10 py-4 rounded-full text-sm font-medium"
        >
          View All Projects
        </a>
      </div>
    </section>
  );
}

function ProjectCard({ img, title, category }) {
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
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
      </div>

      <div className="px-2">
        <p className="text-[10px] md:text-xs uppercase tracking-widest text-gray-400 font-bold">
          {category || "Interior Design"}
        </p>
        <h3 className="text-base md:text-lg font-medium text-gray-900 group-hover:underline decoration-1 underline-offset-4">
          {title}
        </h3>
      </div>
    </div>
  );
}
