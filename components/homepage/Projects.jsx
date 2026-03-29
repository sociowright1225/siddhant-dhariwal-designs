"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";

export default function ProjectsScrollSection() {
  const sectionRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://siddhant-dhariwal-designs-e6u4.vercel.app/api/projects",
        );
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

  // Animation Ranges
  const moveRange = isMobile ? ["0%", "-20%"] : ["0%", "-40%"];
  const moveRangeReverse = ["-20%", "0%"];

  const xTop = useTransform(scrollYProgress, [0, 1], moveRange);
  const xBottom = useTransform(scrollYProgress, [0, 1], moveRangeReverse);
  const xDesktop = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]); // Desktop single row speed

  // Data Splitting for Mobile 2 rows
  const half = Math.ceil(products.length / 2);
  const projectsTop = products.slice(0, half);
  const projectsBottom = products.slice(half);

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 overflow-hidden bg-white"
    >
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center md:text-left">
        <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">
          Projects
        </p>
        <h2 className="text-3xl md:text-5xl font-semibold max-w-2xl leading-tight mx-auto md:mx-0">
          Spaces We Have Had the Honour to Transform
        </h2>
      </div>

      {loading ? (
        <div className="py-24 text-center">Loading Gallery...</div>
      ) : (
        <div className="flex justify-center items-center">
          <div className=" max-w-7xl w-full">
            {/* --- DESKTOP VIEW: Single Row (Hidden on Mobile) --- */}
            <div className="hidden md:block">
              <motion.div
                style={{ x: xDesktop }}
                className="flex gap-8 whitespace-nowrap px-6"
              >
                {products.map((item) => (
                  <ProjectCard
                    key={item._id}
                    img={item.image.url}
                    title={item.title}
                    category={item.category}
                  />
                ))}
              </motion.div>
            </div>

            {/* --- MOBILE VIEW: Two Rows (Hidden on Desktop) --- */}
            <div className="md:hidden flex flex-col items-center">
              {/* Top Row Mobile */}
              <motion.div
                style={{ x: xTop }}
                className="flex gap-4 mb-4 whitespace-nowrap px-6"
              >
                {projectsTop.map((item) => (
                  <ProjectCard
                    key={`top-${item._id}`}
                    img={item.image.url}
                    title={item.title}
                    category={item.category}
                  />
                ))}
              </motion.div>

              {/* Bottom Row Mobile */}
              <motion.div
                style={{ x: xBottom }}
                className="flex gap-4 whitespace-nowrap px-6"
              >
                {projectsBottom.map((item) => (
                  <ProjectCard
                    key={`bottom-${item._id}`}
                    img={item.image.url}
                    title={item.title}
                    category={item.category}
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {!loading && (
        <div className="flex justify-center mt-16 px-6">
          <a
            href="/projects"
            className="w-full sm:w-auto text-center bg-black text-white hover:bg-gray-800 transition-all duration-300 px-10 py-4 rounded-full text-sm font-medium"
          >
            View All Projects
          </a>
        </div>
      )}
    </section>
  );
}

function ProjectCard({ img, title, category }) {
  return (
    <Link
      href={`projects/${title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "")}`}
      className="min-w-[280px] md:min-w-[450px] group select-none inline-block"
    >
      <div className="relative h-56 md:h-[500px] rounded-2xl  overflow-hidden mb-4 pointer-events-none shadow-sm">
        <Image
          src={img}
          alt={title}
          fill
          sizes="(max-width: 768px) 280px, 450px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />
      </div>

      <div className="px-2">
        <p className="text-[10px] md:text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">
          {category || "Interior Design"}
        </p>
        <h3 className="text-base md:text-2xl font-semibold text-gray-900 leading-tight">
          {title}
        </h3>
      </div>
    </Link>
  );
}
