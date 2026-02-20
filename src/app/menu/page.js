"use client";

import { useState, useRef, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { foodItemsData } from "@/data/foods";


const categoriesData = [
  { name: "All", img: "/categories/all.png" },
  { name: "Salad", img: "/categories/salad.png" },
  { name: "Pizza", img: "/categories/pizza.png" },
  { name: "Burger", img: "/categories/burger.png" },
  { name: "Pasta", img: "/categories/pasta.png" },
  { name: "Dessert", img: "/categories/dessert.png" },
];




export default function Menu() {
  const { cartItems, addToCart, removeFromCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
const [selectedFoodReviews, setSelectedFoodReviews] = useState([]);


  useEffect(() => {
  const loadReviews = () => {
    const storedReviews =
      JSON.parse(localStorage.getItem("reviews")) || [];
    setReviews(storedReviews);
  };

  loadReviews();

  window.addEventListener("storage", loadReviews);
  return () => window.removeEventListener("storage", loadReviews);
}, []);


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

  const getAverageRating = (foodId) => {
  const reviews = JSON.parse(localStorage.getItem("reviews")) || [];

  const foodReviews = reviews.filter(
    (r) => r.foodId === foodId
  );

  if (foodReviews.length === 0) {
    return { avg: 0, count: 0 };
  }

  const total = foodReviews.reduce(
    (sum, r) => sum + r.rating,
    0
  );

  return {
    avg: total / foodReviews.length,
    count: foodReviews.length,
  };
};


const renderStars = (rating) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => {
        if (rating >= star) {
          return (
            <span key={star} className="text-yellow-400 text-lg">
              ★
            </span>
          );
        } else if (rating >= star - 0.5) {
          return (
            <span key={star} className="relative text-lg">
              <span className="absolute text-yellow-400 w-1/2 overflow-hidden">
                ★
              </span>
              <span className="text-gray-300">★</span>
            </span>
          );
        } else {
          return (
            <span key={star} className="text-gray-300 text-lg">
              ★
            </span>
          );
        }
      })}
    </div>
  );
};

const openReviews = (foodId) => {
  const allReviews =
    JSON.parse(localStorage.getItem("reviews")) || [];

  const foodReviews = allReviews.filter(
    (r) => r.foodId === foodId
  );

  setSelectedFoodReviews(foodReviews);
  setShowReviews(true);
};

  let filteredFoods =
  selectedCategory === "All"
    ? foods
    : foods.filter(
        (food) =>
          food.category.toLowerCase() ===
          selectedCategory.toLowerCase()
      );

// 🔥 Sort by highest average rating
filteredFoods = [...filteredFoods].sort((a, b) => {
  return (
    getAverageRating(b.id).avg -
    getAverageRating(a.id).avg
  );
});


 

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
        {filteredFoods.map((food) => {
  const { avg, count } = getAverageRating(food.id);
  


  return (

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
            <p className="text-gray-600 text-sm mt-1">
  {food.description}
</p>
           <div className="flex items-center justify-between text-sm mt-2">
  <div className="flex items-center gap-2">
    {renderStars(avg)}

    <span className="text-gray-500">
      ({count})
    </span>

    {count > 0 && (
      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold">
        {avg.toFixed(1)}
      </span>
    )}
  </div>

  <button
    onClick={() => openReviews(food.id)}
    className="text-orange-600 text-xs hover:underline"
  >
    View Reviews
  </button>
</div>

           
            <div className="flex justify-between items-center mt-2">
              <p className="font-bold text-orange-500">₹{food.price}</p>
             
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
  );
})}

      </div>
      {showReviews && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <div className="bg-white p-4 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
      <h3 className="text-lg font-semibold mb-3">
        User Reviews
      </h3>

      {selectedFoodReviews.length === 0 ? (
        <p className="text-sm text-gray-500">
          No reviews yet.
        </p>
      ) : (
        selectedFoodReviews.map((review, index) => (
  <div
    key={review.id || index}
    className="border-b py-2"
  >
            <p className="text-sm font-medium">
              {review.user}
            </p>

            {renderStars(review.rating)}

            {review.comment && (
              <p className="text-xs text-gray-600">
                "{review.comment}"
              </p>
            )}
          </div>
        ))
      )}

      <button
        onClick={() => setShowReviews(false)}
        className="mt-3 bg-orange-500 text-white px-3 py-1 rounded text-sm"
      >
        Close
      </button>
    </div>
  </div>
)}
    </div>
  );
}
