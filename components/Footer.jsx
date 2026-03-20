import logo from "@/public/Navbar/logo.png"
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
     <div className="w-30 h-30 max+lg:w+15 max-lg:h-15">
       <Image src={logo} alt="" width={1000} height={1000}/>
     </div>
          {/* <p className="text-sm leading-relaxed text-gray-400">
            Lorem ipsum is simply dummy text of the printing and typesetting industry.
          </p> */}

          {/* Social icons */}
          {/* <div className="flex gap-4 mt-5">
            <span className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer hover:bg-[#1e3a32]">in</span>
            <span className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer hover:bg-[#1e3a32]">X</span>
            <span className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer hover:bg-[#1e3a32]">ig</span>
            <span className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer hover:bg-[#1e3a32]">yt</span>
          </div> */}
        </div>

        {/* Company */}
        <div>
          <h3 className=" font-semibold mb-4">Company</h3>
          <ul className="space-y-3 text-sm">
            <li className="hover: cursor-pointer">Our Clients</li>
            <li className="hover: cursor-pointer">Contact</li>
           
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className=" font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            <li className="hover: cursor-pointer">Projects</li>
            <li className="hover: cursor-pointer">Products</li>
           
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className=" font-semibold mb-4">Contact</h3>
         
          <p className="text-sm mb-2">📞 +91 8128202359</p>
          <p className="text-sm mb-2">✉️  letsdesignsid23@gmail.com</p>
           <p className="text-sm text-gray-400">
            202, 2nd Floor, Ajmera Midtown, 454, 456/458, Corner of Kalbadevi and Popatwadi Lane,
Marine Lines, Mumbai, Maharashtra 400002

          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1c2f29]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-center text-xs text-gray-400">
       <span>
  © {new Date().getFullYear()} Siddhant Dhariwal Designs. All Rights Reserved.
</span>

        </div>
      </div>
    </footer>
  );
}
