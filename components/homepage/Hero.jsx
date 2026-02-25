"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import hero1 from "@/public/homepage/hero1.jpeg";
import hero2 from "@/public/homepage/hero2.jpeg";
import hero3 from "@/public/homepage/hero3.jpeg";
import Image from "next/image";

const images = [
  hero1,
  hero2,
  hero3,
  hero1,
  hero2,
  hero3,
  hero1,
  hero2,
  hero3,
  hero1,
  hero2,
  hero3,
  hero3,
];

export default function HeroCarousel() {
  const stageRef = useRef(null);
  const boxesRef = useRef([]);

  useEffect(() => {
    const boxes = boxesRef.current;
    const totalImages = images.length;
    const angleStep = 360 / totalImages;
    const radius = 400; // Curve ko thoda flat rakhne ke liye bada radius

    gsap.set(stageRef.current, {
      perspective: 1000,
      transformStyle: "preserve-3d",
    });

    boxes.forEach((box, i) => {
      gsap.set(box, {
        rotationY: i * angleStep,
        transformOrigin: `50% 50% ${radius}px`,
        backfaceVisibility: "hidden",
      });
    });

    // Continuous rotation
    const animation = gsap.to(boxes, {
      rotationY: "-=360",
      duration: 40, // Slow speed for premium feel
      ease: "none",
      repeat: -1,
      modifiers: {
        rotationY: gsap.utils.unitize((r) => parseFloat(r) % 360),
      },
    });

    return () => animation.kill();
  }, []);

  return (
    <div className="relative pt-28 bg-[#F9F7F2] min-h-screen flex flex-col items-center justify-start  overflow-hidden font-sans">
      {/* --- Main Heading --- */}
      <div className="text-center font-serif z-10 px-4">
        <h1 className="text-5xl  text-[#1a1a1a] tracking-tight leading-tight">
          Engage Audiences <br /> with Stunning Videos
        </h1>

        <p className="mt-6 text-gray-600 max-w-xl mx-auto text-lg leading-relaxed">
          Boost Your Brand with High-Impact Short Videos from our expert content
          creators. Our team is ready to propel your business forward.
        </p>
      </div>

      {/* --- 3D Carousel Section --- */}
      <div className="relative  w-full h-[400px] flex items-center justify-center">
        {/* Curved Container */}
        <div
          ref={stageRef}
          className="relative w-[180px] h-[300px] md:w-[180px] md:h-[240px] flex items-center justify-center"
        >
          {images.map((src, i) => (
            <div
              key={i}
              ref={(el) => (boxesRef.current[i] = el)}
              className="absolute w-full h-full rounded-xl overflow-hidden shadow-xl"
              style={{
                WebkitBackfaceVisibility: "hidden",
                transformStyle: "preserve-3d",
              }}
            >
              <Image
                src={src}
                width={1000}
                height={1000}
                priority
                alt="creators work"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* --- CTA & Decorations --- */}
      <div className="pb-20 flex flex-col items-center gap-4 z-10">
        <button className="bg-black hover:bg-white text-white hover:text-black hover:border-b px-10 py-4 rounded-full text-lg font-medium transition-all shadow-lg hover:scale-105 active:scale-95">
          Get Started
        </button>
      </div>
    </div>
  );
}
