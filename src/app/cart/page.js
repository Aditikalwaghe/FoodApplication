"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useEffect, useState } from "react";

const foodItemsData = [
  { id: 1, name: "Caesar Salad", category: "Salad", price: 120, rating: 4.5, description: "Fresh greens with cheese", img: "/foods/caesar-salad.jpg" },
  { id: 2, name: "Greek Salad", category: "Salad", price: 100, rating: 4, description: "Tomatoes, cucumbers & feta", img: "/foods/greek-salad.jpg" },
  { id: 3, name: "Margherita Pizza", category: "Pizza", price: 200, rating: 4.8, description: "Classic cheese pizza", img: "/foods/margherita-pizza.jpg" },
  { id: 4, name: "Pepperoni Pizza", category: "Pizza", price: 250, rating: 5, description: "Pepperoni & cheese", img: "/foods/pepperoni-pizza.jpg" },
  { id: 5, name: "Cheeseburger", category: "Burger", price: 150, rating: 4.3, description: "Juicy beef burger", img: "/foods/cheeseburger.jpg" },
  { id: 6, name: "Veggie Pasta", category: "Pasta", price: 180, rating: 4.2, description: "Healthy veggie pasta", img: "/foods/veggie-pasta.jpg" },
  { id: 7, name: "Chocolate Cake", category: "Dessert", price: 90, rating: 5, description: "Rich chocolate cake", img: "/foods/chocolate-cake.jpg" },
];
const getAllFoods = () => {
  const adminFoods = JSON.parse(localStorage.getItem("foods")) || [];

  return [
    ...foodItemsData, // default menu items
    ...adminFoods.map((f) => ({
      id: f.id,
      name: f.name,
      category: f.category,
      price: Number(f.price),
      img: f.img,
    })),
  ];
};

export default function CartPage() {
  const { cartItems, removeFromCart, removeItemFromCart } = useCart();
const [allFoods, setAllFoods] = useState([]);

useEffect(() => {
  setAllFoods(getAllFoods());
}, []);

const cartFoods = allFoods.filter(
  (food) => cartItems[food.id] > 0
);

  const subtotal = cartFoods.reduce((sum, food) => sum + food.price * cartItems[food.id], 0);
  const deliveryFee = subtotal >= 150 || subtotal === 0 ? 0 : 20;
  const total = subtotal + deliveryFee;
const handleProceed = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (!isLoggedIn) {
    alert("Please login first!");
    router.push("/login");
  } else {
    router.push("/payment");
  }
};

  return (
    <div className="min-h-screen p-6 bg-orange-50">
      <h1 className="text-2xl font-bold mb-6 text-center text-orange-500">Your Cart</h1>

      {cartFoods.length === 0 ? (
        <p className="text-center text-gray-400 ">Your cart is empty !</p>
      ) : (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          {/* Cart Items */}
         
            {cartFoods.map((food) => (
              <div
                key={food.id}
                className="flex items-center justify-between bg-white p-4 rounded shadow relative"
              >
                {/* Remove product completely */}
                <button
                  onClick={() => removeItemFromCart(food.id)}
                  className="absolute top-2 right-2 text-red-500 font-bold text-xl hover:text-red-700"
                  title="Remove item completely"
                >
                  &times;
                </button>

                {/* Food Image */}
                <img
                  src={food.img}
                  alt={food.name}
                  className="w-20 h-20 object-cover rounded mr-4"
                />

                {/* Food Details */}
                <div className="flex-1">
                  <h3 className="font-semibold">{food.name}</h3>
                  <p className="text-gray-500">Price: ₹{food.price}</p>
                  <p className="text-gray-500">Qty: {cartItems[food.id]}</p>

                  {/* Reduce quantity */}
                  
                  <button
                    onClick={() => removeFromCart(food.id)}
                    className="mt-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Reduce Qty
                  </button>
                </div>

                {/* Total for this item */}
                <p className="font-semibold text-gray-700">
                  ₹{food.price * cartItems[food.id]}
                </p>
                
              </div>
            ))}
          </div>
         

          {/* Cart Summary */}
          <div className="mt-6 p-4 bg-white rounded shadow w-full max-w-md center mx-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-500">Cart Total</h2>
            <div className="flex justify-between mb-2 text-gray-400">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between mb-2 text-gray-400">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold text-lg text-gray-400">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          <Link href="/payment">
            <button className="mt-4 bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition center mx-auto block">
              Proceed to Payment
            </button>
          </Link>
        </>
      )}
    </div>
  );
}
