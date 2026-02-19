"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);

  // Load orders from localStorage
 useEffect(() => {
  const currentUser = localStorage.getItem("currentUser");

  if (!currentUser) {
    alert("Please login first!");
    router.push("/login");
    return;
  }

  const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];

  // 🔐 Filter only this user's orders
  const userOrders = storedOrders.filter(
    (order) => order.user === currentUser
  );

  setOrders(userOrders);
}, []);


  // ✅ Delete order function
  const handleDelete = (orderId) => {
  if (confirm("Are you sure you want to delete this order?")) {

    const allOrders = JSON.parse(localStorage.getItem("orders")) || [];

    // Remove only the selected order
    const updatedOrders = allOrders.filter(
      (order) => order.id !== orderId
    );

    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    // Update UI (only current user's orders)
    const currentUser = localStorage.getItem("currentUser");

    const userOrders = updatedOrders.filter(
      (order) => order.user === currentUser
    );

    setOrders(userOrders);
  }
};


const handleRating = (orderId, rating) => {
  const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
  const currentUser = localStorage.getItem("currentUser");

  const updatedOrders = allOrders.map(order =>
    order.id === orderId
      ? { ...order, rating }
      : order
  );

  localStorage.setItem("orders", JSON.stringify(updatedOrders));

  const order = updatedOrders.find(o => o.id === orderId);

  const reviews = JSON.parse(localStorage.getItem("reviews")) || [];

  order.items.forEach(item => {
    // prevent duplicate review
    const alreadyReviewed = reviews.find(
      r => r.foodId === item.id && r.user === currentUser
    );

    if (!alreadyReviewed) {
      reviews.push({
        foodId: item.id,
        user: currentUser,
        rating,
        comment: ""
      });
    }
  });

  localStorage.setItem("reviews", JSON.stringify(reviews));

  const userOrders = updatedOrders.filter(
    order => order.user === currentUser
  );

  setOrders(userOrders);
};

// 🔹 Handle half-star ratings
const handleHalfRating = (orderId, event) => {
  const order = orders.find(o => o.id === orderId);
  if (order.rating) return; // Prevent changing rating if already rated

  const { left, width } = event.currentTarget.getBoundingClientRect();
  const clickX = event.clientX - left;
  const relativeX = clickX / width; // 0 → 1 across all stars

  // Convert to 0.5 increments (0.5, 1, 1.5, ..., 5)
  const newRating = Math.ceil(relativeX * 10) / 2;

  handleRating(orderId, newRating);
};


  return (
    
    <div className="min-h-screen p-4 sm:p-6 md:p-8 bg-orange-100 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6 text-gray-500">Your Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-400 text-center">No orders yet!</p>
      ) : (
        <div className="w-full max-w-6xl space-y-6 ">
          
          {orders.map((order, idx) => (
            <div
              key={idx}
              className="flex flex-row justify-between bg-gradient-to-t from-orange-400 to-orange-200 p-4 rounded shadow text-gray-700 hover:shadow-lg transition flex-wrap "
            >
              {/* Left: Order Items */}
              <div className="flex-1 min-w-[200px]">
                <h2 className="font-semibold mb-2 text-sm sm:text-base">Order {idx + 1}</h2>
                <p className="text-xs">Order ID: {order.id}</p>
                <p className="text-xs py-1">Order Date: {order.date}</p>

                {order.items.map((food) => (
                  <div key={food.id} className="flex justify-between mb-1 text-xs sm:text-sm">
                    <span>{food.name} x {food.quantity}</span>
                    <span className="font-semibold px-20"> ₹{food.price * food.quantity}</span>
                  </div>
                ))}
                
              </div>

              {/* Right: Totals, Status & Actions */}
              <div className="flex flex-col items-end mt-2 md:mt-0 min-w-[180px]">
                <div className="flex justify-between w-full mb-1 text-xs sm:text-sm">
                  <span>Total Items:</span>
                  <span>{order.totalItems}</span>
                </div>
                <div className="flex justify-between w-full mb-1 text-xs sm:text-sm">
                  <span>Subtotal:</span>
                  <span>₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between w-full mb-1 text-xs sm:text-sm">
                  <span>Delivery Fee:</span>
                  <span>₹{order.deliveryFee}</span>
                </div>
                <div className="flex justify-between w-full font-bold text-sm sm:text-base border-t border-gray-200 pt-1 mt-1 mb-2">
                  <span>Total:</span>
                  <span>₹{order.total}</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-xs sm:text-sm">Status: {order.status}</span>
                


                  <button
                    onClick={() => router.push("/track-order")}
                    className="px-2 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition text-xs sm:text-sm"
                  >
                    Track Order
                  </button>

                  {/* ✅ Delete Button */}
                  <button 
                    onClick={() => handleDelete(order.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-xs sm:text-sm"
                  >
                    Delete
                  </button>
                </div>
             {order.status === "Delivered" && (
  <div className="flex items-center gap-2 mt-1">
    <span className="font-medium text-xs sm:text-sm">
      Ratings:
    </span>

    <div
  className="flex items-center gap-1 mt-1 cursor-pointer"
  onClick={(e) => handleHalfRating(order.id, e)}
>
  {Array.from({ length: 5 }).map((_, i) => {
    const starValue = i + 1;
    return (
      <span
        key={i}
        className={`text-2xl ${
          order.rating >= starValue ? "text-yellow-300" :
          order.rating >= starValue - 0.5 ? "text-yellow-200" :
          "text-white"
        }`}
      >
        ★
      </span>
    );
  })}
 
</div>


    {order.rating && (
      <span className="text-xs text-gray-600 ml-2">
        {order.rating} / 5
      </span>
    )}
  </div>
)}

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
