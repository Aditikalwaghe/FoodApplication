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
    const currentUser = localStorage.getItem("currentUser");

    // Mark as "Cancelled by User" for admin
    const updatedOrders = allOrders.map((order) => {
      if (order.id === orderId && order.user === currentUser) {
        return { ...order, status: "Cancelled by User" };
      }
      return order;
    });

    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    // Remove from user's view
    const userOrders = updatedOrders.filter(
      (order) => order.user === currentUser && order.id !== orderId
    );
    setOrders(userOrders);
  }
};


  // ✅ Handle rating (one-time per order)
  const handleRating = (orderId, rating) => {
    const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const currentUser = localStorage.getItem("currentUser");

    // Prevent updating if already rated
    const order = allOrders.find((o) => o.id === orderId);
    if (order.rating) return;

    // Update order rating
    const updatedOrders = allOrders.map((o) =>
      o.id === orderId ? { ...o, rating } : o
    );
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    // Update reviews
    const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    order.items.forEach((item) => {
      const alreadyReviewed = reviews.find(
        (r) => r.foodId === item.id && r.user === currentUser
      );
      if (!alreadyReviewed) {
        reviews.push({
          foodId: item.id,
          user: currentUser,
          rating,
          comment: "",
        });
      }
    });
    localStorage.setItem("reviews", JSON.stringify(reviews));

    // Update state
    setOrders(updatedOrders.filter((o) => o.user === currentUser));
  };

  // 🔹 Render stars with half-star support
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(
          <span key={i} className="text-yellow-300 text-xl sm:text-2xl">
            ★
          </span>
        ); // full star
      } else if (rating >= i - 0.5) {
        stars.push(
          <span
            key={i}
            className="relative text-xl sm:text-2xl"
            style={{ display: "inline-block" }}
          >
            <span
              className="text-yellow-300 absolute top-0 left-0 overflow-hidden"
              style={{ width: "50%" }}
            >
              ★
            </span>
            <span className="text-white">★</span>
          </span>
        ); // half star
      } else {
        stars.push(
          <span key={i} className="text-white text-xl sm:text-2xl">
            ★
          </span>
        ); // empty star
      }
    }
    return stars;
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 bg-orange-100 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6 text-gray-500">Your Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-400 text-center">No orders yet!</p>
      ) : (
        <div className="w-full max-w-6xl space-y-6">
          {orders.map((order, idx) => (
            <div
              key={idx}
              className="flex flex-row justify-between bg-gradient-to-t from-orange-400 to-orange-200 p-4 rounded shadow text-gray-700 hover:shadow-lg transition flex-wrap"
            >
              {/* Left: Order Items */}
              <div className="flex-1 min-w-[200px]">
                <h2 className="font-semibold mb-2 text-sm sm:text-base">
                  Order {idx + 1}
                </h2>
                <p className="text-xs">Order ID: {order.id}</p>
                <p className="text-xs py-1">Order Date: {order.date}</p>

                {order.items.map((food) => (
                  <div
                    key={food.id}
                    className="flex justify-between mb-1 text-xs sm:text-sm"
                  >
                    <span>
                      {food.name} x {food.quantity}
                    </span>
                    <span className="font-semibold px-20">
                      ₹{food.price * food.quantity}
                    </span>
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
                  <span className="font-medium text-xs sm:text-sm">
                    Status: {order.status}
                  </span>

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

                {/* Ratings Section */}
                {order.status === "Delivered" && (
                  <div className="flex flex-col items-start mt-2 w-full sm:w-auto">
                    <span className="font-medium text-xs sm:text-sm mb-1">
                      Ratings:
                    </span>

                    <div
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={(e) => {
                        if (order.rating) return; // prevent multiple ratings
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickX = e.clientX - rect.left;
                        const newRating =
                          Math.ceil((clickX / rect.width) * 10) / 2; // 0.5 increments
                        handleRating(order.id, newRating);
                      }}
                    >
                      {renderStars(order.rating || 0)}
                      {order.rating && (
                        <span className="text-xs text-gray-600 ml-2">
                          ({order.rating} / 5)
                        </span>
                      )}
                    </div>
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
