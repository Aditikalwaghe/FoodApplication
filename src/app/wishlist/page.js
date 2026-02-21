"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { foodItemsData } from "@/data/foods";
import toast from "react-hot-toast";

export default function Wishlist() {
  const { addToCart } = useCart();
  const [wishlistFoods, setWishlistFoods] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) return;

    const allWishlists = JSON.parse(localStorage.getItem("wishlists")) || {};
    const userWishlist = allWishlists[currentUser] || [];

    const adminFoods = JSON.parse(localStorage.getItem("foods")) || [];
    const allFoods = [...foodItemsData, ...adminFoods];

    setWishlistFoods(allFoods.filter((f) => userWishlist.includes(f.id)));
  }, []);
  const handleBuy = (foodId) => {
    addToCart(foodId); // Add the item to cart
    toast.success("Added to Cart!"); // Optional feedback
    router.push("/cart"); // Navigate to cart page
  };

  const removeFromWishlist = (foodId) => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) return;

    const updated = wishlistFoods.filter((f) => f.id !== foodId);
    setWishlistFoods(updated);

    const allWishlists = JSON.parse(localStorage.getItem("wishlists")) || {};
    allWishlists[currentUser] = (allWishlists[currentUser] || []).filter(
      (id) => id !== foodId,
    );
    localStorage.setItem("wishlists", JSON.stringify(allWishlists));
  };

  const addToWishlist = (foodId) => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) return;

    const allWishlists = JSON.parse(localStorage.getItem("wishlists")) || {};
    const userWishlist = allWishlists[currentUser] || [];

    if (!userWishlist.includes(foodId)) {
      const updatedWishlist = [...userWishlist, foodId];
      allWishlists[currentUser] = updatedWishlist;
      localStorage.setItem("wishlists", JSON.stringify(allWishlists));

      const food = [
        ...foodItemsData,
        ...(JSON.parse(localStorage.getItem("foods")) || []),
      ].find((f) => f.id === foodId);
      setWishlistFoods((prev) => [...prev, food]);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-orange-50">
      <h1 className="text-2xl font-bold mb-6 text-center text-orange-500">
        My Wishlist
      </h1>

      {wishlistFoods.length === 0 ? (
        <p className="text-center text-gray-400">Your wishlist is empty!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wishlistFoods.map((food) => (
            <div
              key={food.id}
              className="flex items-center justify-between bg-white p-4 rounded shadow relative"
            >
              <img
                src={food.img}
                alt={food.name}
                className="w-20 h-20 object-cover rounded mr-4"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-orange-400">{food.name}</h3>
                <p className="text-gray-500">Price: ₹{food.price}</p>
              </div>
              <div className="flex flex-col space-y-2 ">
                <button
                  onClick={() => removeFromWishlist(food.id)}
                  className="px-3 py-1 text-red-500 hover:text-red-700 hover:scale-110 transition duration-200"
                >
                  ❌
                </button>
                <button
                  onClick={() => handleBuy(food.id)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
