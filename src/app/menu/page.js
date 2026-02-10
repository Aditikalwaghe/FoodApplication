"use client";

import { useState, useRef, useEffect } from "react";
import { useCart } from "@/context/CartContext";


const categoriesData = [
  { name: "All", img: "/categories/all.png" },
  { name: "Salad", img: "/categories/salad.png" },
  { name: "Pizza", img: "/categories/pizza.png" },
  { name: "Burger", img: "/categories/burger.png" },
  { name: "Pasta", img: "/categories/pasta.png" },
  { name: "Dessert", img: "/categories/dessert.png" },
];

const foodItemsData = [
  { id: 1, name: "Caesar Salad", category: "Salad", price: 120, rating: 4.5, description: "Fresh greens with cheese", img: "/foods/caesar-salad.jpg" },
  { id: 2, name: "Greek Salad", category: "Salad", price: 100, rating: 4, description: "Tomatoes, cucumbers & feta", img: "/foods/greek-salad.jpg" },
  { id: 3, name: "Margherita Pizza", category: "Pizza", price: 200, rating: 4.8, description: "Classic cheese pizza", img: "/foods/margherita-pizza.jpg" },
  { id: 4, name: "Pepperoni Pizza", category: "Pizza", price: 250, rating: 5, description: "Pepperoni & cheese", img: "/foods/pepperoni-pizza.jpg" },
  { id: 5, name: "Cheeseburger", category: "Burger", price: 150, rating: 4.3, description: "Juicy beef burger", img: "/foods/cheeseburger.jpg" },
  { id: 6, name: "Veggie Pasta", category: "Pasta", price: 180, rating: 4.2, description: "Healthy veggie pasta", img: "/foods/veggie-pasta.jpg" },
  { id: 7, name: "Chocolate Cake", category: "Dessert", price: 90, rating: 5, description: "Rich chocolate cake", img: "/foods/chocolate-cake.jpg" },
];


export default function Menu() {
  const { cartItems, addToCart, removeFromCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
const [foods, setFoods] = useState([]);
useEffect(() => {
  const loadFoods = () => {
    const adminFoods = (JSON.parse(localStorage.getItem("foods")) || []).map(f => ({
      ...f,
      price: Number(f.price), // ensure price is a number
      category: f.category?.trim() || "Other", // trim spaces
      id: f.id || Date.now(), // ensure id exists
    }));
    setFoods([...foodItemsData, ...adminFoods]); // merge default + admin foods
  };

  // Load foods on page load
  loadFoods();

  // Sync if localStorage changes (multi-tab support)
  window.addEventListener("storage", loadFoods);
  return () => window.removeEventListener("storage", loadFoods);
}, []);




  const scrollRef = useRef(null);

  const checkArrows = () => {
    if (!scrollRef.current) return;
    const scrollContainer = scrollRef.current;
    setShowLeftArrow(scrollContainer.scrollLeft > 0);
    setShowRightArrow(
      scrollContainer.scrollLeft + scrollContainer.clientWidth < scrollContainer.scrollWidth
    );
  };

  useEffect(() => {
    checkArrows();
    window.addEventListener("resize", checkArrows);
    return () => window.removeEventListener("resize", checkArrows);
  }, []);

  const filteredFoods =
  selectedCategory === "All"
    ? foods
    : foods.filter(food => 
        food.category.toLowerCase() === selectedCategory.toLowerCase()
      );

 

  return (
   <div
  className="min-h-screen p-6 md:p-8"
  style={{ backgroundColor: "#FEEBC8" }} // change color here
>

      {/* Message */}
      <h2 className="text-2xl text-orange-600 md:text-3xl font-bold mb-8 text-center ">
        Discover Our Delicious Menu!
      </h2>

       <div className="max-w-xl mx-auto items-center">
      {/* Categories with left/right arrows */}
      <div className="relative mb-6 flex items-center">
  {/* Left Arrow */}
  {showLeftArrow && (
    <button
      onClick={() =>
        scrollRef.current.scrollBy({ left: -150, behavior: "smooth" })
      }
      className="bg-white shadow rounded-full p-2 mr-2 hover:bg-orange-500 hover:text-white transition"
    >
      ◀
    </button>
  )}

 {/* Fixed "All" button */}
<div className="flex flex-col items-center mr-4">
  <span className="mb-2 text-sm font-bold text-gray-700 text-center">
    All
  </span>
  <button
    onClick={() => setSelectedCategory("All")}
    className={`w-20 h-20 rounded-full flex items-center justify-center transition ${
      selectedCategory === "All"
        ? "ring-2 ring-gray-100"
        : "hover:ring-2 hover:ring-orange-400"
    }`}
    style={{
      backgroundImage: `url(/categories/all.png)`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  ></button>
</div>



 {/* Scrollable Categories */}
<div
  ref={scrollRef}
  className="flex space-x-4 overflow-x-hidden"
  onScroll={checkArrows}
>
  {categoriesData.slice(1).map((cat) => (
    <div key={cat.name} className="flex flex-col items-center">
      {/* Name above the circle */}
      <span className="mb-2 text-sm font-bold text-gray-700 text-center">
        {cat.name}
      </span>

      {/* Circle button with background image */}
      <button
        onClick={() => setSelectedCategory(cat.name)}
        className={`w-20 h-20 rounded-full flex items-center justify-center transition ${
          selectedCategory === cat.name
            ? "ring-2 ring-gray-100"
            : "hover:ring-2 hover:ring-orange-400"
        }`}
        style={{
          backgroundImage: `url(${cat.img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></button>
    </div>
  ))}
</div>

  {/* Right Arrow */}
  {showRightArrow && (
    <button
      onClick={() =>
        scrollRef.current.scrollBy({ left: 150, behavior: "smooth" })
      }
      className="bg-white shadow rounded-full p-2 ml-2 hover:bg-orange-500 hover:text-white transition"
    >
      ▶
    </button>
  )}
</div>

      </div>

      {/* Food Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {filteredFoods.map((food) => (
          <div
  key={food.id}
  className="border rounded-lg shadow p-4 flex flex-col justify-between hover:scale-105 transition bg-white"
>

            <div className="w-full rounded mb-2 overflow-hidden">
          <img
            src={food.img}
            alt={food.name}
            className="w-full aspect-[4/3] object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

            <h3 className="text-lg font-semibold text-gray-800">{food.name}</h3>
            <p className="text-gray-600 text-sm">{food.description}</p>
            <div className="flex justify-between items-center mt-2">
              <p className="font-bold text-orange-500">₹{food.price}</p>
              <p className="text-yellow-500">
                {"★".repeat(Math.floor(food.rating))}{" "}
                {"☆".repeat(5 - Math.floor(food.rating))}
              </p>
            </div>

            {/* Add / Minus */}
            <div className="flex justify-between items-center mt-3">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => removeFromCart(food.id)}

                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  -
                </button>
                <span className="px-2 text-gray-500 ">{cartItems[food.id] || 0}</span>
                <button
                  onClick={() => addToCart(food.id)}

                  className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  +
                </button>
              </div>
              <p className="font-semibold text-gray-500">
                ₹{(cartItems[food.id] || 0) * food.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
