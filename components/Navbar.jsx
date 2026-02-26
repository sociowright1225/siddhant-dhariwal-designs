"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/Navbar/logo.png";
import { Menu, X } from "lucide-react";
import { JetBrains_Mono } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "SIDDHANT DHARIWAL", href: "/" },
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Products", href: "/products" },
  ];

  return (
    <nav className="w-full fixed z-50 top-0 left-0 px-4">
      <div
        className={`max-w-4xl mx-auto mt-5 bg-white/20 backdrop-blur-xl border 
        ${isOpen ? "rounded-xl" : "rounded-full"} 
        border-white/20 shadow-lg overflow-hidden`}
      >
        <div className="px-6 py-2 flex items-center justify-between">
          {/* Logo */}
          <div className="relative h-12 w-12">
            <Image
              src={logo}
              alt="Brand Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Desktop Menu */}
          <ul
            className={`hidden md:flex items-center gap-8  ${jetbrainsMono.className}`}
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="hover:text-black transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </ul>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="hidden sm:block px-5 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-white hover:text-black border border-black transition"
            >
              Contact Us
            </Link>

            {/* Mobile Toggle */}
            <button
              className="md:hidden p-1"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`${isOpen ? "block" : "hidden"}`}>
          <ul
            className={`flex flex-col items-center gap-4 pb-6 font-medium border-t border-white/10 mt-2 pt-4 ${jetbrainsMono.className}`}
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2 hover:bg-white/10"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/contact"
              className="sm:hidden px-6 py-2 rounded-full bg-black text-white text-sm font-medium"
            >
              Contact Us
            </Link>
          </ul>
        </div>
      </div>
    </nav>
  );
}