"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import name from "@/public/Navbar/name.png";
import logo from "@/public/Navbar/logo.png";
import { Menu, X } from "lucide-react"; // Install lucide-react or use SVG icons

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(null);

  const navLinks = [
    // { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Products", href: "/products" },
  ];

  return (
    <nav className="w-full fixed z-50 top-0 left-0 px-4">
      <div
        className={`max-w-4xl mx-auto mt-5 bg-white/20 backdrop-blur-xl border ${isOpen ? "max-lg:rounded-xl rounded-full" : "rounded-full"} border-white/20  shadow-lg overflow-hidden`}
      >
        <div className="px-6 py-2 flex items-center  justify-between">
          {/* Logo */}

          <Link href="/" className="flex items-center">
            {/* Mobile / Tablet – NAME (wide) */}
            <div className="relative h-12 w-12 ">
              <Image
                src={logo}
                alt="Brand Name"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Desktop – LOGO (compact) */}
            {/* <div className="relative h-12 w-14 hidden max-lg:hidden lg:block">
              <Image
                src={logo}
                alt="Brand Logo"
                fill
                className="object-contain"
                priority
              />
            </div> */}
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-8 font-medium">
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

          {/* Right Side: CTA & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <a
              href="/contact"
              className="hidden sm:block px-5 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-white hover:text-black border border-black transition"
            >
              Contact Us
            </a>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-1"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={` ${isOpen ? "max-h-screen opacity-100 block" : "max-h-0 opacity-0 hidden"}`}
        >
          <ul className="flex flex-col items-center gap-4 pb-6 font-medium border-t border-white/10 mt-2 pt-4">
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
            <a
              href="/contact"
              className="sm:hidden px-6 py-2 rounded-full bg-black text-white text-sm font-medium"
            >
              Contact Us
            </a>
          </ul>
        </div>
      </div>
    </nav>
  );
}
