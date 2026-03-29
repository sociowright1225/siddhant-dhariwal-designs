import logo from "@/public/Navbar/logo.png";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="w-30 h-30 max-lg:w-20 max-lg:h-20">
            <Image src={logo} alt="" width={1000} height={1000} />
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            We craft bespoke lighting experiences that transform spaces into
            stories.
          </p>
        </div>

        {/* Company */}
        <div>
          <h3 className=" font-semibold mb-4">Company</h3>
          <ul className="space-y-3 text-sm">
            <Link href={"/about"}><li className="hover: cursor-pointer">About Us</li></Link>
             <Link href={"/contact"}><li className="hover: cursor-pointer">Contact Us</li></Link>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className=" font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            <Link href={"/projects"}><li className="hover: cursor-pointer">Projects</li></Link>
             <Link href={"/products"}><li className="hover: cursor-pointer">Products</li></Link>
           
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className=" font-semibold mb-4">Contact</h3>

          <p className="text-sm mb-2">📞 +91 8128202359</p>
          <p className="text-sm mb-2">✉️ letsdesignsid23@gmail.com</p>
          <p className="text-sm text-gray-400">
            202, 2nd Floor, Ajmera Midtown, 454, 456/458, Corner of Kalbadevi
            and Popatwadi Lane, Marine Lines, Mumbai, Maharashtra 400002
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1c2f29]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-center text-xs text-gray-400">
          <span>
            © {new Date().getFullYear()} Siddhant Dhariwal Designs. All Rights
            Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
