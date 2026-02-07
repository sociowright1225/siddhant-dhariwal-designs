"use client";

import Image from "next/image";
import about1 from "@/public/about/about1.jpg"
import about2 from "@/public/about/about2.jpg"
import about3 from "@/public/about/about3.jpg"

export default function About() {
  return (
    <section className="py-16 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 max-lg:flex max-lg:flex-col-reverse gap-4 items-center">
        {/* LEFT CONTENT */}
        <div>
          <p className="text-sm text-gray-400 mb-2 max-lg:hidden">About Us</p>

          <h2 className="text-3xl lg:text-4xl font-semibold leading-tight mb-4">
            Lorem Ipsum is <br />
            dummy text of the printing
          </h2>

          <p className="text-gray-400 text-sm mb-8 max-w-md">
            Lorem Ipsum has been the industry’s standard dummy text ever since
            the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book.
          </p>

          {/* STATS */}
          <div className="grid grid-cols-2 gap-6 mb-8 max-w-sm">
            {[1, 2, 3, 4].map((item) => (
              <div key={item}>
                <h3 className="text-2xl font-semibold">255+</h3>
                <p className="text-xs text-gray-400">Lorem Ipsum</p>
              </div>
            ))}
          </div>

          <a href="/about" className="bg-black max-lg:w-full text-white hover:bg-white hover:text-black border transition px-8 text-white py-3 rounded-full text-base font-medium">
            About Us
          </a>
        </div>

        {/* RIGHT IMAGES GRID */}
        <div className="flex gap-4">
          {/* Large Image */}
          <div className="col-span-1 row-span-2 rounded-2xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1615874959474-d609969a20ed"
              alt="Interior"
              width={600}
              height={800}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Top Right */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1618220179428-22790b461013"
                alt="Decor"
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Bottom Right */}
            <div className="rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a"
                alt="Modern Room"
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {/* Bottom Right */}
            <div className="rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a"
                alt="Modern Room"
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1618220179428-22790b461013"
                alt="Decor"
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
