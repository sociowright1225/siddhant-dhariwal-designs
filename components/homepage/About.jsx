"use client";

import Image from "next/image";
import about1 from "@/public/about/about1.jpg";
import about2 from "@/public/about/about2.jpg";
import about3 from "@/public/about/about3.jpg";

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

          <p className="text-gray-400 text-sm mb-4 max-w-md">
            Lorem Ipsum has been the industry’s standard dummy text ever since
            the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book.
          </p>
          <p className="text-gray-400 text-sm mb-8 max-w-md">
            Lorem Ipsum has been the industry’s standard dummy text ever since
            the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book.
          </p>

          <a
            href="/about"
            className="bg-black max-lg:w-full text-white hover:bg-white hover:text-black border transition px-8 text-white py-3 rounded-full text-base font-medium"
          >
            About Us
          </a>
        </div>

        {/* RIGHT IMAGES GRID */}
        <div className="flex flex-col w-full gap-4">
           <div className="flex w-full gap-4">
              <Image
                src="https://images.unsplash.com/photo-1615874959474-d609969a20ed"
                alt="Decor"
                width={400}
                height={300}
                className="w-[30%] h-34 rounded-lg"
              /><Image
                src="https://images.unsplash.com/photo-1618220179428-22790b461013"
                alt="Decor"
                width={400}
                height={300}
                className="w-[70%] h-34 rounded-lg"
              />
            </div> <div className="flex w-full gap-4">
              <Image
                src="https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a"
                alt="Decor"
                width={400}
                height={300}
                className="w-[60%] h-34 rounded-lg"
              /><Image
                src="https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a"
                alt="Decor"
                width={400}
                height={300}
                className="w-[40%] h-34 rounded-lg"
              />
            </div> <div className="flex w-full gap-4">
              <Image
                src="https://images.unsplash.com/photo-1618220179428-22790b461013"
                alt="Decor"
                width={400}
                height={300}
                className="w-[40%] h-34 rounded-lg"
              /><Image
                src="https://images.unsplash.com/photo-1618220179428-22790b461013"
                alt="Decor"
                width={400}
                height={300}
                className="w-[60%] h-34 rounded-lg"
              />
            </div>
        </div>
      </div>
    </section>
  );
}
