"use client";

import { useState, useEffect } from "react";
import { foodItemsData } from "@/data/foods";


export default function AdminDashboard() {
  

  const [activeTab, setActiveTab] = useState("add"); 
  // add | list | orders

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* LEFT SIDEBAR */}
      <div className="w-1/4 bg-white shadow p-4 space-y-4">
        <h2 className="text-xl font-bold text-gray-500">Admin Panel</h2>

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
  JSON.stringify([
    ...foods,
    { ...food, id: Date.now() }
  ])
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

      <input placeholder="Name" className="border p-2 w-full text-gray-400"
        onChange={(e) => setFood({ ...food, name: e.target.value })} />

      <input placeholder="Category" className="border p-2 w-full text-gray-400"
        onChange={(e) => setFood({ ...food, category: e.target.value })} />

      <input placeholder="Price" className="border p-2 w-full text-gray-400"
        onChange={(e) => setFood({ ...food, price: e.target.value })} />

      <input
  placeholder="Image URL"
  className="border p-2 w-full text-gray-400"
  onChange={(e) => setFood({ ...food, img: e.target.value })}
/>

      <textarea placeholder="Description" className="border p-2 w-full text-gray-400"
        onChange={(e) => setFood({ ...food, description: e.target.value })} />

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

  useEffect(() => {
    const adminFoods = JSON.parse(localStorage.getItem("foods")) || [];
   setFoods([...foodItemsData, ...adminFoods]);

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

  return (
    <div className="bg-white p-4 rounded shadow ">
      <h2 className="text-xl font-bold mb-4 text-gray-500 text-center">Menu List</h2>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-gray-100 border-gray-500 text-left text-orange-500">
            <th className="p-2 px-4">Image</th>
            <th className="p-2">Name</th>
            <th className="p-2">Category</th>
            <th className="p-2">Price</th>
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
  );
}
  

function Orders() {
  const [orders, setOrders] = useState([]);

  // Load all orders from localStorage
  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(storedOrders);
  }, []);

  // Update status and save to localStorage
  const updateStatus = (index, newStatus) => {
    const updatedOrders = [...orders];
    updatedOrders[index].status = newStatus;
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  return (
    <div className="bg-white p-4 rounded shadow space-y-4">
  <h2 className="text-xl font-bold mb-4 text-gray-500 text-center">Orders</h2>

  {orders.length === 0 ? (
    <p>No orders placed yet.</p>
  ) : (
    <div className="flex flex-col gap-4 ">
      {orders.map((order, idx) => (
        <div
          key={idx}
          className="p-4 border rounded flex flex-col gap-3"
        >
          {/* Row 1: Order # and Food List */}
          <div className="flex justify-between items-start flex-wrap gap-4">
            {/* Order Number */}
            <div className="min-w-[100px]">
              <p className="font-semibold text-gray-700">Order #{idx + 1}</p>
            </div>

            {/* Foods & Qty */}
            <div className="flex flex-col flex-1 gap-1">
              {order.items.map((food) => (
                <p key={food.id} className="text-gray-600">
                  {food.name} x {food.quantity}
                </p>
              ))}
            </div>

            {/* Total Price */}
            <div className="min-w-[120px]">
              <p className="font-semibold text-gray-700">Total: ₹{order.total}</p>
            </div>
          </div>

          {/* Row 2: User Info and Status */}
          <div className="flex justify-between items-center flex-wrap gap-4 border-t pt-2">
            {/* User Info */}
            <div className="flex flex-col text-gray-600 min-w-[200px]">
              <p className="font-medium text-gray-700">{order.name}</p>
              <p>{order.address}</p>
              <p>{order.mobile}</p>
            </div>

            {/* Status Dropdown */}
            <div className="min-w-[150px]">
              <span className="text-sm font-medium text-gray-600">Status:</span>
              <select
                value={order.status}
                onChange={(e) => updateStatus(idx, e.target.value)}
                className="border px-2 py-1 rounded text-sm"
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Preparing">Preparing</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

  );
}
