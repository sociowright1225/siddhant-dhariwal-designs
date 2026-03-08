"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import { X } from "lucide-react";

import hero1 from "@/public/homepage/hero1.jpeg";
import hero2 from "@/public/homepage/hero2.jpeg";
import hero3 from "@/public/homepage/hero3.jpeg";

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
  const overlayRef = useRef(null);

  const [activeImage, setActiveImage] = useState(null);

  // ===============================
  // 3D Carousel Animation
  // ===============================
  useEffect(() => {
    const boxes = boxesRef.current;
    const totalImages = images.length;
    const angleStep = 360 / totalImages;
    const radius = 400;

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

    const animation = gsap.to(boxes, {
      rotationY: "-=360",
      duration: 40,
      ease: "none",
      repeat: -1,
      modifiers: {
        rotationY: gsap.utils.unitize((r) => parseFloat(r) % 360),
      },
    });

    return () => animation.kill();
  }, []);

  // ===============================
  // Zoom Animation
  // ===============================
  useEffect(() => {
    if (activeImage && overlayRef.current) {
      gsap.fromTo(
        overlayRef.current.querySelector(".zoom-image"),
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out" },
      );
    }
  }, [activeImage]);

  return (
    <div className="relative pt-28 bg-[#F9F7F2] min-h-screen flex flex-col items-center justify-start overflow-hidden font-sans">
      {/* ================= Heading ================= */}
      <div className="text-center font-serif z-10 px-4">
        <h1 className="text-5xl text-[#1a1a1a] tracking-tight leading-tight">
          Where Light Becomes Art
        </h1>

        <p className="mt-6 text-gray-600 max-w-xl mx-auto text-lg leading-relaxed">
          We craft bespoke lighting experiences that transform spaces into
          stories. Explore our world of handcrafted luminaires, sculptural
          pendants, and statement lighting — designed for those who refuse to
          settle for ordinary.
        </p>
      </div>

      {/* ================= 3D Carousel ================= */}
      <div className="relative w-full h-[400px] flex items-center justify-center">
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
                onClick={() => setActiveImage(src)}
                className="w-full h-full object-cover cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ================= CTA ================= */}
      <div className="pb-20 flex flex-col items-center gap-4 z-10">
        <a href="/contact" className="bg-black hover:bg-white text-white hover:text-black hover:border-b px-10 py-4 rounded-full text-lg font-medium transition-all shadow-lg hover:scale-105 active:scale-95">
          Explore Our World
        </a>
      </div>

      {/* ================= Fullscreen Zoom ================= */}
      {activeImage && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[999] bg-black/80 flex items-center justify-center"
          onClick={() => setActiveImage(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setActiveImage(null)}
            className="absolute top-6 right-6 z-[1000] bg-white/90 hover:bg-white text-black p-2 rounded-full shadow-lg transition"
          >
            <X size={24} />
          </button>

          {/* Image */}
          <Image
            src={activeImage}
            alt="Zoomed Image"
            width={1600}
            height={1600}
            onClick={(e) => e.stopPropagation()}
            className="zoom-image max-w-[90vw] max-h-[90vh] rounded-xl object-contain"
          />
        </div>
      )}
    </div>
  );
}
