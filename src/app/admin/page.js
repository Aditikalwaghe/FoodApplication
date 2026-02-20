"use client";

import { useState, useEffect } from "react";
import { foodItemsData } from "@/data/foods";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("add");
  // add | list | orders

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* LEFT SIDEBAR */}
<div className="w-full sm:w-1/4 bg-white shadow p-4 space-y-4">        <h2 className="text-xl font-bold text-gray-500">Admin Panel</h2>

        <button
          onClick={() => setActiveTab("add")}
          className="w-full bg-orange-500 text-white py-1 rounded hover:text-orange-500 hover:bg-gray-200 transition"
        >
          Add Food
        </button>

        <button
          onClick={() => setActiveTab("list")}
          className="w-full bg-orange-500 text-white py-1 rounded hover:text-orange-500 hover:bg-gray-200 transition"
        >
          Menu List
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className="w-full bg-orange-500 text-white py-1 rounded hover:text-orange-500 hover:bg-gray-200 transition"
        >
          Orders
        </button>
      </div>

      {/* RIGHT CONTENT */}
      <div className="w-3/4 p-6">
        {activeTab === "add" && <AddFood />}
        {activeTab === "list" && <MenuList />}
        {activeTab === "orders" && <Orders />}
      </div>
    </div>
  );
}

function AddFood() {
  const [food, setFood] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    img: "",
  });
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");

    if (!isAdmin) {
      alert("Unauthorized Access");
      window.location.href = "/";
    }
  }, []);

  const handleAdd = () => {
    if (!food.name.trim()) {
      alert("Food name is required");
      return;
    }

    if (!food.category.trim()) {
      alert("Category is required");
      return;
    }

    if (!food.price || isNaN(food.price)) {
      alert("Valid price is required");
      return;
    }

    if (!food.img.trim()) {
      alert("Image URL is required");
      return;
    }

    if (!food.description.trim()) {
      alert("Description is required");
      return;
    }

    const foods = JSON.parse(localStorage.getItem("foods")) || [];
    localStorage.setItem(
      "foods",
      JSON.stringify([...foods, { ...food, id: Date.now() }]),
    );

    alert("Food added successfully");

    setFood({
      name: "",
      category: "",
      price: "",
      img: "",
      description: "",
    });
  };

  return (
    <div className="bg-white p-6 rounded shadow space-y-3">
      <h2 className="text-xl font-bold text-gray-500">Add Food</h2>

      <input
        placeholder="Name"
          value={food.name}
        className="border p-2 w-full text-gray-400"
        onChange={(e) => setFood({ ...food, name: e.target.value })}
      />

      <input
        placeholder="Category"
        value={food.category}
        className="border p-2 w-full text-gray-400"
        onChange={(e) => setFood({ ...food, category: e.target.value })}
      />

      <input
        placeholder="Price"
        value={food.price}
        className="border p-2 w-full text-gray-400"
        onChange={(e) => setFood({ ...food, price: e.target.value })}
      />

      <input
        placeholder="Image URL"
        value={food.img}
        className="border p-2 w-full text-gray-400"
        onChange={(e) => setFood({ ...food, img: e.target.value })}
      />

      <textarea
        placeholder="Description"
        value={food.description}
        className="border p-2 w-full text-gray-400"
        onChange={(e) => setFood({ ...food, description: e.target.value })}
      />

      <button
        onClick={handleAdd}
        className="bg-orange-500 text-white px-4 py-2 rounded"
      >
        Add Food
      </button>
    </div>
  );
}

function MenuList() {
  const [foods, setFoods] = useState([]);
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    const adminFoods = JSON.parse(localStorage.getItem("foods")) || [];
    const storedReviews = JSON.parse(localStorage.getItem("reviews")) || [];

    setFoods([...foodItemsData, ...adminFoods]);
    setReviews(storedReviews);
  }, []);

  const removeFood = (id) => {
    // ❌ Prevent deleting default foods
    if (id <= 7) {
      alert("Default items cannot be deleted");
      return;
    }

    const adminFoods = JSON.parse(localStorage.getItem("foods")) || [];
    const updatedFoods = adminFoods.filter((food) => food.id !== id);

    localStorage.setItem("foods", JSON.stringify(updatedFoods));
    setFoods([...foodItemsData, ...updatedFoods]);
  };

  const getFoodStats = (foodId) => {
    const foodReviews = reviews.filter((r) => r.foodId === foodId);

    if (foodReviews.length === 0) {
      return { avg: 0, count: 0 };
    }

    const total = foodReviews.reduce((sum, r) => sum + r.rating, 0);
    const avg = total / foodReviews.length;

    return { avg, count: foodReviews.length };
  };

  const getTopRatedFoodId = () => {
    if (reviews.length === 0) return null;

    const ratingMap = {};

    reviews.forEach((r) => {
      if (!ratingMap[r.foodId]) {
        ratingMap[r.foodId] = [];
      }
      ratingMap[r.foodId].push(r.rating);
    });

    let topFoodId = null;
    let highestAvg = 0;

    Object.keys(ratingMap).forEach((foodId) => {
      const avg =
        ratingMap[foodId].reduce((a, b) => a + b, 0) / ratingMap[foodId].length;

      if (avg > highestAvg) {
        highestAvg = avg;
        topFoodId = Number(foodId);
      }
    });

    return topFoodId;
  };

  const getLowestRatedFoodId = () => {
    if (reviews.length === 0) return null;

    const ratingMap = {};

    reviews.forEach((r) => {
      if (!ratingMap[r.foodId]) {
        ratingMap[r.foodId] = [];
      }
      ratingMap[r.foodId].push(r.rating);
    });

    let lowFoodId = null;
    let lowestAvg = 5;

    Object.keys(ratingMap).forEach((foodId) => {
      const avg =
        ratingMap[foodId].reduce((a, b) => a + b, 0) / ratingMap[foodId].length;

      if (avg < lowestAvg) {
        lowestAvg = avg;
        lowFoodId = Number(foodId);
      }
    });

    return lowFoodId;
  };

  const topRatedFoodId = getTopRatedFoodId();
  const lowestRatedFoodId = getLowestRatedFoodId();

  return (
    <div className="bg-white p-4 rounded shadow ">
      <h2 className="text-xl font-bold mb-4 text-gray-500 text-center">
        Menu List
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-gray-100 border-gray-500 text-left text-orange-500">
              <th className="p-2 px-4">Image</th>
              <th className="p-2 text-sm">Name</th>
              <th className="p-2 text-sm">Category</th>
              <th className="p-2 text-sm">Price</th>
              <th className="p-2 text-center">Avg Rating</th>
              <th className="p-2 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {foods.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-2">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>
                <td className="p-2 text-gray-500">{item.name}</td>
                <td className="p-2 text-gray-500">{item.category}</td>
                <td className="p-2 text-gray-500">₹{item.price}</td>
                <td className="p-2 text-center">
                  {(() => {
                    const { avg, count } = getFoodStats(item.id);

                    if (count === 0) {
                      return (
                        <span className="text-gray-400 text-sm">
                          No Reviews
                        </span>
                      );
                    }

                    return (
                      <div className="flex flex-wrap items-center justify-center gap-1">
                        <span className="text-sm font-medium text-gray-600">
                          {avg.toFixed(1)}
                        </span>

                        <span className="text-xs text-gray-400">({count})</span>

                        {item.id === topRatedFoodId && (
                          <span className="text-xs bg-yellow-400 text-white px-2 py-0.5 rounded">
                            ⭐ Top Rated
                          </span>
                        )}
                        {item.id === lowestRatedFoodId && (
                          <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded">
                            🔴 Low Rated
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </td>
                <td className="p-2 text-center">
                  {item.id > 7 && (
                    <button
                      onClick={() => removeFood(item.id)}
                      className="text-red-500 font-bold text-xl  hover:text-red-700 transition"
                    >
                      &times;
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  // Load all orders from localStorage
  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const storedReviews = JSON.parse(localStorage.getItem("reviews")) || [];

    setOrders(storedOrders);
    setReviews(storedReviews);
  }, []);
  const renderStars = (rating) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(
          <span key={i} className="text-yellow-500">
            ★
          </span>,
        );
      } else if (rating >= i - 0.5) {
        stars.push(
          <span key={i} className="relative text-gray-300">
            ★
            <span className="absolute left-0 top-0 text-yellow-500 w-1/2 overflow-hidden">
              ★
            </span>
          </span>,
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-300">
            ★
          </span>,
        );
      }
    }

    return stars;
  };

  const getFoodReviews = (orderId, foodId) => {
    return reviews.filter((r) => r.orderId === orderId && r.foodId === foodId);
  };
  // Update status and save to localStorage
  const updateStatus = (index, newStatus) => {
    const updatedOrders = [...orders];
    updatedOrders[index].status = newStatus;
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  const handleAdminDelete = (orderId) => {
    if (confirm("Are you sure you want to delete this order permanently?")) {
      const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
      const updatedOrders = allOrders.filter((order) => order.id !== orderId);
      localStorage.setItem("orders", JSON.stringify(updatedOrders));
      setOrders(updatedOrders);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow space-y-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-500 text-center">
        Orders
      </h2>

      {orders.length === 0 ? (
        <p className="text-gray-400 text-center">No orders placed yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order, idx) => (
            <div
              key={order.id}
              className="relative p-4 border rounded-lg shadow hover:shadow-lg transition flex flex-col gap-3 bg-gradient-to-r from-orange-200 to-orange-300"
            >
              {/* Admin Delete Cross Button */}
              <button
                onClick={() => handleAdminDelete(order.id)}
                className="absolute top-2 right-2 text-red-500 font-bold text-xl hover:text-red-700 transition"
                title="Delete Order"
              >
                &times;
              </button>

              {/* Row 1: Order Info */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col min-w-[100px] sm:min-w-[150px]">
                  <p className="font-semibold text-gray-700">
                    Order #{idx + 1}
                  </p>
                  <p className="text-xs text-gray-500">ID: {order.id}</p>
                  <p className="text-xs text-gray-500">Date: {order.date}</p>
                </div>
                {/* Divider */}
<hr className="my-2 border-gray-200" />

{/* Foods Like ID & Date Style */}
<div className="flex flex-col gap-2">
  {order.items.map((food) => {
    const foodReviews = getFoodReviews(order.id, food.id);
    const review = foodReviews[0];

    return (
      <div
        key={food.id}
className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 text-sm"      >
        {/* Left Side - Food */}
        <p className="text-gray-600">
          {food.name} x {food.quantity}
        </p>

        {/* Right Side - Rating */}
        {review ? (
          <div className="flex items-center gap-1">
            <div className="flex text-xs">
              {renderStars(review.rating)}
            </div>
            <span className="text-xs text-gray-500">
              {review.rating}/5
            </span>
          </div>
        ) : (
          <span className="text-xs text-gray-400">
            Not rated
          </span>
        )}
      </div>
    );
  })}
</div>

                
                {/* Total */}
                <div className="min-w-[120px]">
                  <p className="font-semibold text-gray-700 text-sm">
                    Total: ₹{order.total}
                  </p>
                </div>
              </div>

              {/* Row 2: User Info and Status */}
              <div className="flex justify-between flex-wrap gap-4 border-t pt-2 items-start">
                <div className="flex flex-col text-gray-600 min-w-[200px]">
                  <p className="font-medium text-gray-700">{order.name}</p>
                  <p className="text-sm">{order.address}</p>
                  <p className="text-sm">{order.mobile}</p>
                </div>

                <div className="flex flex-col sm:min-w-[150px] w-full sm:w-auto text-sm text-gray-600">
                  {/* Status Dropdown */}
                  <span className="text-sm font-medium text-gray-600">
                    Status:
                  </span>
                  <select
                    value={order.status}
                    onChange={(e) => {
                      // prevent changing if user cancelled or delivered
                      if (
                        order.status === "Cancelled by User" ||
                        order.status === "Delivered"
                      )
                        return;
                      updateStatus(idx, e.target.value);
                    }}
                    className={`border px-2 py-1 rounded text-sm ${
                      order.status === "Cancelled by User" ||
                      order.status === "Delivered"
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={
                      order.status === "Cancelled by User" ||
                      order.status === "Delivered"
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  {/* Ratings */}

                  {/* Show cancelled in red */}
                  {order.status === "Cancelled by User" && (
                    <p className="text-red-500 font-semibold mt-1">
                      Cancelled by User
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
