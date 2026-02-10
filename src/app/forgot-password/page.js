"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  function handleReset() {
    if (!email.includes("@")) {
      alert("Please enter a valid email");
      return;
    }

    alert("Password reset link sent to your email (demo)");
    router.push("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-600">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border border-gray-300 rounded text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <button
          onClick={handleReset}
          className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
        >

          Reset Password
        </button>
        <div className="flex justify-center mt-2">
  <button
    onClick={() => router.push("/login")}
    className="bg-orange-500 text-white py-2 px-10 rounded hover:bg-orange-600 transition"
  >
    Login
  </button>
</div>

      </div>
    </div>
  );
}
