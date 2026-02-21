"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  useEffect(() => {
  const remembered = localStorage.getItem("rememberedUser");
  if (remembered) {
    setForm((prev) => ({
      ...prev,
      email: remembered,
      remember: true,
    }));
  }
}, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  }

 function handleLogin() {
  if (!form.email.includes("@")) {
    toast.error("Please enter a valid email");
    return;
  }

  if (form.password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return;
  }

  const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

  if (storedUsers.length === 0) {
    toast.error("No account found. Please sign up first.");
    return;
  }

  const matchedUser = storedUsers.find(
    (user) =>
      user.email === form.email &&
      user.password === btoa(form.password)
  );

  if (matchedUser) {
  toast.success("Login successful!");

  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("currentUser", matchedUser.email);

    window.dispatchEvent(new Event("userChanged"));


  if (matchedUser.role === "admin") {
    localStorage.setItem("isAdmin", "true");
  }

  // ✅ Remember Me logic
  if (form.remember) {
    localStorage.setItem("rememberedUser", matchedUser.email);
  } else {
    localStorage.removeItem("rememberedUser");
  }

  router.push("/");
}
  else {
    toast.error("Invalid email or password");
  }}

  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
    <h1 className="text-2xl font-bold mb-6 text-gray-600 text-center">
    Login Here
    </h1>

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-3 p-2 border border-gray-300 rounded text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-3 p-2 border border-gray-300 rounded text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        {/* Remember Me + Forgot Password */}
        <div className="flex justify-between items-center mb-4">
          <label className="flex items-center text-sm text-gray-600">
            <input
              type="checkbox"
              name="remember"
              checked={form.remember}
              onChange={handleChange}
              className="mr-2"
            />
            Remember me
          </label>

          <span
            onClick={() => router.push("/forgot-password")}
            className="text-sm text-orange-500 cursor-pointer hover:underline"
          >
            Forgot password?
          </span>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}
