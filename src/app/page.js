"use client";

import Link from "next/link";
import AboutUs from "../components/AboutUs";
import ContactUs from "@/components/ContactUs";



export default function Home() {
  return (
    <main className="bg-gray-100 min-h-screen flex  flex-col items-center px-4">
      {/* Hero Container */}
      <section className="bg-white rounded-lg shadow-lg mt-6 w-full mx-2 overflow-hidden">
        {/* Image + Overlay */}
        <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[28rem]">
          <img
            src="/hero.jpg"
            alt="Delicious Food"
            className="w-full h-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Delicious Food at Your Fingertips
            </h1>
            <p className="text-lg md:text-2xl text-white mb-6">
              Enjoy your favorite meals anytime, anywhere
            </p>

            {/* 🔧 FIXED: redirect to menu page */}
            <Link
              href="/menu"
              className="bg-orange-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 transition"
            >
              View Menu
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl w-full mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
  
  <div className="bg-gradient-to-b from-white to-orange-300 rounded-xl shadow p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
    <div className="text-4xl mb-3">🥗</div>
    <h3 className="text-xl font-bold mb-2 text-gray-800">
      Fresh Ingredients
    </h3>
    <p className="text-gray-600">
      We use only fresh and high-quality ingredients.
    </p>
  </div>

  <div className="bg-gradient-to-b from-white to-orange-300 rounded-xl shadow p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
    <div className="text-4xl mb-3">🚀</div>
    <h3 className="text-xl font-bold mb-2 text-gray-800">
      Fast Delivery
    </h3>
    <p className="text-gray-600">
      Hot and delicious food delivered on time.
    </p>
  </div>

  <div className="bg-gradient-to-b from-white to-orange-300 rounded-xl shadow p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
    <div className="text-4xl mb-3">💰</div>
    <h3 className="text-xl font-bold mb-2 text-gray-800">
      Best Prices
    </h3>
    <p className="text-gray-600">
      Enjoy tasty meals at affordable prices.
    </p>
  </div>

</section>

      <section className="bg-white rounded-lg  mt-6 w-full mx-2 ">
     <AboutUs />
     </section>
    <section id="contact-us">
  <ContactUs />
    </section>
    </main>
  );
}
