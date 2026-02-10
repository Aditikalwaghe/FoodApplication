"use client";

import Link from "next/link";
import { useRouter } from "next/navigation"; // import router
import { FaInstagram, FaFacebookF, FaTwitter, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  const router = useRouter();

  const handleHomeClick = () => {
    router.push("/");          // navigate to home page
    window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to top
  };

  return (
    <footer className="bg-orange-500 border-t border-gray-200 py-1">
      <div className="max-w-6xl mx-auto px-6 px-4 sm:px-1 py-3">
        <div className="grid grid-cols-3 gap-10 items-start text-gray-700 py-4 px-8">

          {/* App Info */}
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-white">FoodieCafe</h2>
            <p className="text-xs leading-snug">
              Delicious food delivered fresh to your doorstep. Fast, reliable & tasty 🍔🍕
            </p>

            {/* Social Icons */}
            <div className="flex gap-3 text-orange-100 text-base mt-1">
              <FaInstagram className="hover:text-orange-900 cursor-pointer" />
              <FaFacebookF className="hover:text-orange-900 cursor-pointer" />
              <FaTwitter className="hover:text-orange-900 cursor-pointer" />
              <FaWhatsapp className="hover:text-orange-900 cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-1 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
            <h3 className="text-sm font-semibold text-white">Quick Links</h3>
            <button
              onClick={handleHomeClick} // fixed here
              className="text-xs hover:text-black text-left"
            >
              Home
            </button>
            <Link href="/menu" className="text-xs hover:text-black">Menu</Link>
            <Link href="/#about-us" className="text-xs hover:text-black">About Us</Link>
            <Link href="/#contact-us" className="text-xs hover:text-black">Contact</Link>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-1 px-4 sm:px-6 md:px-12 lg:px-20">
            <h3 className="text-sm font-semibold text-white">Contact</h3>
            <p className="text-xs">📍 India</p>
            <p className="text-xs">📧 support@foodiecafe.com</p>
            <p className="text-xs">📞 +91 98765 43210</p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="text-center text-[11px] text-white py-1 border border-black rounded rounded-md mt-1">
          © {new Date().getFullYear()} FoodieCafe. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
