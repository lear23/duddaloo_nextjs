import Image from "next/image";
import Link from "next/link";

import { LuYoutube, LuInstagram } from "react-icons/lu";

const Footer = () => {
  const currentYear = new Date().getFullYear();

return (
    <footer className="bg-[#F8F6F2] py-12">
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-start gap-8">
       
        {/* Logo - Centrerado SOLO en móvil */}            
        <div className="flex flex-col items-center md:items-start w-full md:w-auto gap-4">
          <Image
            src="https://sszyfwfazrxewdarezbn.supabase.co/storage/v1/object/public/duddallos_products/logoduddaloo.svg"
            alt="logo"
              width={180}
              height={180}
            className="object-contain"
            unoptimized // Añade esto para que Next.js no intente procesar el SVG/URL externa
          />
        </div>
       
        <div className="flex flex-col items-center md:items-start w-full md:w-auto gap-2">
          <h3 className="font-semibold text-lg mb-2">Company</h3>
          <Link className="text-gray-400" href="/">Home</Link>
          <Link className="text-gray-400"href="/shop">Shop</Link>
          <Link className="text-gray-400" href="/about">About</Link>
          <Link className="text-gray-400" href="/contact">Contact</Link>
        </div>    

      
        <div className="flex justify-center md:justify-start w-full md:w-auto gap-4 mt-2">
          <Link href="https://www.youtube.com/@Duddaloos" target="_blank" rel="noopener noreferrer">
            <LuYoutube className="w-6 h-6 text-gray-400 hover:text-blue-600 transition" />
          </Link>
          <Link href="https://www.instagram.com/duddaloos?igsh=MTlxaGhkOXY2ZWhmbw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer">
            <LuInstagram className="w-6 h-6 text-gray-400 hover:text-pink-500 transition" />
          </Link>
        </div>  

      </div>

      <hr className="border-gray-300 mt-8" />

      <div className="text-center mt-4">
        <p className="text-gray-400">
          &copy; {currentYear} Duddaloos AB Org.nr 559555-5367. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
