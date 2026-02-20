"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);

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
      (order) => order.user === currentUser,
    );

    setOrders(userOrders);
    const storedReviews = JSON.parse(localStorage.getItem("reviews")) || [];
    setReviews(storedReviews);
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
        (order) => order.user === currentUser && order.id !== orderId,
      );
      setOrders(userOrders);
    }
  };

  // ✅ Handle rating (one-time per order)
  const handleRating = (orderId, foodId, rating, comment) => {
    const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const allReviews = JSON.parse(localStorage.getItem("reviews")) || [];

    const order = allOrders.find((o) => o.id === orderId);
    if (!order) return;

    const customerName = order.name; // ✅ Name from payment page

    const existingReview = allReviews.find(
      (r) => r.orderId === orderId && r.foodId === foodId,
    );

    if (existingReview) {
      alert("You already rated this item for this order.");
      return;
    }

    const newReview = {
      id: Date.now(),
      foodId,
      orderId,
      rating,
      comment,
      user: customerName, // ✅ IMPORTANT CHANGE
      date: new Date().toLocaleDateString(),
    };

    localStorage.setItem("reviews", JSON.stringify([...allReviews, newReview]));

    setReviews([...allReviews, newReview]); // ✅ instant UI update
  };
  const getUserReview = (orderId, foodId) => {
    return reviews.find((r) => r.orderId === orderId && r.foodId === foodId);
  };

  // 🔹 Render stars with half-star support
  const renderStars = (rating, orderId, foodId) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      let starType;

      if (rating >= i) {
        starType = "full";
      } else if (rating >= i - 0.5) {
        starType = "half";
      } else {
        starType = "empty";
      }

      stars.push(
        <span
          key={i}
          className="relative cursor-pointer text-lg  sm:text-xl md:text-2xl "
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;

            let newRating;
            if (clickX < rect.width / 2) {
              newRating = i - 0.5;
            } else {
              newRating = i;
            }

            handleRating(orderId, foodId, newRating, "");
          }}
        >
          {/* Empty Star */}
          <span className="text-white">★</span>

          {/* Full or Half Fill */}
          {starType !== "empty" && (
            <span
              className="absolute left-0 top-0 text-yellow-300 overflow-hidden"
              style={{
                width: starType === "half" ? "50%" : "100%",
              }}
            >
              ★
            </span>
          )}
        </span>,
      );
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
              className="flex flex-col md:flex-row md:justify-between md:gap-16 lg:gap-24 bg-gradient-to-t from-orange-400 to-orange-200 p-4 rounded shadow text-gray-700 hover:shadow-lg transition"
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
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-2 text-xs sm:text-sm"
                  >
                    <span>
                      {food.name} x {food.quantity}
                    </span>
                    <span className="font-semibold sm:ml-4">
                      ₹{food.price * food.quantity}
                    </span>
                    {order.status === "Delivered" && (
                      <div className="mt-2 w-full sm:w-auto">
                        <div className="flex items-center gap-1 sm:gap-2">
                          {renderStars(
                            getUserReview(order.id, food.id)?.rating || 0,
                            order.id,
                            food.id,
                          )}
                        </div>

                        <button
                          onClick={() => {
                            const existing = getUserReview(order.id, food.id);

                            // ❌ If no rating yet
                            if (!existing) {
                              alert("Please rate the item first.");
                              return;
                            }

                            // ❌ If comment already exists
                            if (existing.comment) {
                              alert(
                                "You already added a comment for this item.",
                              );
                              return;
                            }

                            const comment = prompt("Write comment (optional)");

                            if (comment && comment.trim() !== "") {
                              const allReviews =
                                JSON.parse(localStorage.getItem("reviews")) ||
                                [];

                              const updated = allReviews.map((r) =>
                                r.id === existing.id ? { ...r, comment } : r,
                              );

                              localStorage.setItem(
                                "reviews",
                                JSON.stringify(updated),
                              );
                              setReviews(updated);
                            }
                          }}
                          className="text-xs text-orange-600 hover:underline"
                        >
                          Add Comment
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Right: Totals, Status & Actions */}
              <div className="flex flex-col items-start md:items-end mt-4 md:mt-0 w-full md:w-auto text-xs sm:text-sm">
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
