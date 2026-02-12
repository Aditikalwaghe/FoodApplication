"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);

  // Load orders from localStorage
  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(storedOrders);
  }, []);

  // ✅ Delete order function
  const handleDelete = (index) => {
    if (confirm("Are you sure you want to delete this order?")) {
      const updatedOrders = [...orders];
      updatedOrders.splice(index, 1); // remove order at index
      setOrders(updatedOrders);
      localStorage.setItem("orders", JSON.stringify(updatedOrders));
    }
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
                <h2 className="font-semibold mb-2 text-sm sm:text-base">Order #{idx + 1}</h2>
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
                    onClick={() => handleDelete(idx)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-xs sm:text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
