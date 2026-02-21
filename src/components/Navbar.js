"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const [isSignupDropdownOpen, setIsSignupDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef(null);
  const signupRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      // Close hamburger menu
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }

      // Close signup dropdown
      if (signupRef.current && !signupRef.current.contains(event.target)) {
        setIsSignupDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("isLoggedIn");
    const admin = localStorage.getItem("isAdmin");

    setIsLoggedIn(user === "true" || admin === "true");
  }, [pathname]);

  const links = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];
  const ordersLink = { name: "My Orders", href: "/orders" };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isAdmin");

    setIsLoggedIn(false);

    // ✅ VERY IMPORTANT: Trigger cart reload instantly
    window.dispatchEvent(new Event("userChanged"));
    router.replace("/");
  };

  return (
    <nav className="bg-white  sticky top-0  z-50 ">
      <div className="px-4 py-4 flex justify-between items-center relative">
        {/* Left: Hamburger + Logo */}

        <div className="flex items-center space-x-4">
          {/* Hamburger always visible */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 hover:text-orange-500 focus:outline-none"
          >
            {isMenuOpen ? "✖" : "☰"}
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold text-orange-500 hover:text-orange-600"
          >
            FoodieCafe
          </Link>
        </div>

        {/* Right-side navbar always visible */}
        <div className="flex items-center space-x-4 px-3 ">
          {/* Search bar */}
          <input
            type="text"
            placeholder="Search food..."
            value={searchQuery}
            onChange={(e) => {
              const value = e.target.value;
              setSearchQuery(value);

              if (value.trim() === "") {
                router.push("/menu");
              } else {
                router.push(`/menu?search=${value}`);
              }
            }}
            className="px-2 py-1 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 text-black"
          />

          {links.map((link) =>
            link.name === "Home" ? (
              <button
                key={link.name}
                onClick={() => {
                  setIsMenuOpen(false);
                  window.location.href = "/";
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="relative group text-gray-700 px-2 py-1 font-medium transition-colors duration-300 hover:text-orange-500"
              >
                {link.name}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
            ) : link.name === "About Us" ? (
              <button
                key={link.name}
                onClick={() => {
                  if (window.location.pathname === "/") {
                    document
                      .getElementById("about-us")
                      ?.scrollIntoView({ behavior: "smooth" });
                  } else {
                    window.location.href = "/#about-us";
                  }
                  setIsMenuOpen(false);
                }}
                className="relative group text-gray-700 px-2 py-1 font-medium transition-colors duration-300 hover:text-orange-500"
              >
                {link.name}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
            ) : link.name === "Contact Us" ? (
              <button
                key={link.name}
                onClick={() => {
                  if (window.location.pathname === "/") {
                    document
                      .getElementById("contact-us")
                      ?.scrollIntoView({ behavior: "smooth" });
                  } else {
                    window.location.href = "/#contact-us";
                  }
                  setIsMenuOpen(false);
                }}
                className="relative group text-gray-700 px-2 py-1 font-medium transition-colors duration-300 hover:text-orange-500"
              >
                {link.name}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className="relative group text-gray-700 px-2 py-1 font-medium transition-colors duration-300 hover:text-orange-500"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ),
          )}

          {/* Cart */}
          <button
            onClick={() => router.push("/cart")}
            className="relative text-gray-700 hover:text-orange-500 transition-colors duration-300"
          >
            🛒
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs px-1">
              {cartCount}
            </span>
          </button>

          {/* Sign Up with dropdown */}
          {!isLoggedIn && (
            <div ref={signupRef} className="relative">
              <button
                onClick={() => setIsSignupDropdownOpen(!isSignupDropdownOpen)}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-300 flex-shrink-0 min-w-[80px]"
              >
                Sign Up
              </button>

              {isSignupDropdownOpen && (
                <div className="absolute right-0 mt-2 w-38 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-3">
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setIsSignupDropdownOpen(false);
                        router.push("/signup");
                      }}
                      className="w-full text-left px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 transition hover:bg-orange-500 hover:text-white hover:border-orange-500"
                    >
                      👤 User
                    </button>

                    <button
                      onClick={() => {
                        setIsSignupDropdownOpen(false);
                        router.push("/admin-login");
                      }}
                      className="w-full text-left px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 transition hover:bg-orange-500 hover:text-white hover:border-orange-500"
                    >
                      🛠 Admin
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile-like dropdown (optional) triggered by hamburger */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute top-full left-0 w-56 bg-white shadow-md border rounded-md mt-2 p-2 flex flex-col space-y-2 z-50"
          >
            {links.map((link) => {
              // HOME
              if (link.name === "Home") {
                return (
                  <button
                    key={link.name}
                    onClick={() => {
                      setIsMenuOpen(false);
                      window.location.href = "/";
                    }}
                    className="w-full text-center py-2 text-gray-700 hover:text-orange-500 hover:bg-gray-100 transition rounded"
                  >
                    Home
                  </button>
                );
              }

              // ABOUT US
              if (link.name === "About Us") {
                return (
                  <button
                    key={link.name}
                    onClick={() => {
                      if (window.location.pathname === "/") {
                        document
                          .getElementById("about-us")
                          ?.scrollIntoView({ behavior: "smooth" });
                      } else {
                        window.location.href = "/#about-us";
                      }
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-center py-2 text-gray-700 hover:text-orange-500 hover:bg-gray-100 transition rounded"
                  >
                    About Us
                  </button>
                );
              }

              if (link.name === "Contact Us") {
                return (
                  <button
                    key={link.name}
                    onClick={() => {
                      if (window.location.pathname === "/") {
                        document
                          .getElementById("contact-us")
                          ?.scrollIntoView({ behavior: "smooth" });
                      } else {
                        window.location.href = "/#contact-us";
                      }
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-center py-2 text-gray-700 hover:text-orange-500 hover:bg-gray-100 transition rounded"
                  >
                    Contact Us
                  </button>
                );
              }

              // CONTACT / MENU / OTHERS
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-center py-2 text-gray-700 hover:text-orange-500 hover:bg-gray-100 transition rounded"
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Add My Orders button */}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                router.push("/orders"); // redirect to Orders page
              }}
              className="w-full text-center py-2 text-gray-700 hover:text-orange-500 hover:bg-gray-100 transition rounded"
            >
              My Orders
            </button>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                router.push("/wishlist");
              }}
              className="w-full text-center py-2 text-gray-700 hover:text-orange-500 hover:bg-gray-100 transition rounded"
            >
              Wishlist
            </button>
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="w-full text-center py-2 text-red-500 hover:bg-gray-100 transition rounded"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
