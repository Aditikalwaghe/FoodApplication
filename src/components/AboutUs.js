"use client";

import { useRef, useState } from "react";

const aboutImages = [
  "/about/1.jpg",
  "/about/2.jpg",
  "/about/3.jpg",
  "/about/4.jpg",
  "/about/5.jpg",
];

export default function AboutUs() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section id="about-us" className="py-12 bg-gray-100 w-full ">
      <div className="max-w-6xl mx-auto p-4 md:p-8 bg-white rounded-2xl shadow-2xl border-4 border-gray-200 bg-gradient-to-b from-white to-orange-500">
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-orange-600 mb-6 ">
          About Us
        </h2>

        {/* Description */}
        <p className="max-w-3xl mx-auto text-center text-gray-700 text-base sm:text-lg md:text-xl mb-8 px-2 sm:px-4">
          At FoodieCafe, we believe in delivering fresh, high-quality food right to your doorstep.
          Our mission is to bring delicious meals to your home quickly and safely. We value
          freshness, flavor, and customer satisfaction in every dish we serve.
        </p>

        {/* Scrollable Gallery */}
        <div
          className={`overflow-hidden relative`}
        >
          <div
            className={`scroll-container`}
            style={{
              animationPlayState: isHovered ? "paused" : "running",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {[...aboutImages, ...aboutImages].map((img, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-40 sm:w-48 md:w-56 h-60 sm:h-72 rounded-xl overflow-hidden shadow-lg hover:scale-110 transition-transform duration-300 mx-2"
              >
                <img
                  src={img}
                  alt={`About ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
