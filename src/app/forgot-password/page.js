"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [timer, setTimer] = useState(0);

  // ⏳ OTP Countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // 📩 Send OTP
  async function handleSendOtp() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const matchedUser = users.find((u) => u.email === email);

    if (!matchedUser) {
      alert("No account found with this email.");
      return;
    }

    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(randomOtp);
    setTimer(120); // 2 minutes

    await fetch("/api/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp: randomOtp }),
    });

    setStep(2);
  }

  // ✅ Verify OTP
  function handleVerifyOtp() {
    if (timer === 0) {
      alert("OTP expired. Please resend.");
      return;
    }

    if (otp === generatedOtp) {
      setStep(3);
    } else {
      alert("Invalid OTP");
    }
  }

  // 🔐 Update Password
  function handleUpdatePassword() {
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const updatedUsers = users.map((user) =>
      user.email === email
        ? { ...user, password: newPassword }
        : user
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));

    alert("Password updated successfully!");
    router.push("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-600">
          Forgot Password
        </h2>

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-3 p-2 border rounded text-gray-500"
            />
            <button
              onClick={handleSendOtp}
              className="w-full bg-orange-500 text-white py-2 rounded"
            >
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full mb-3 p-2 border rounded text-gray-500"
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-blue-500 text-white py-2 rounded mb-2"
            >
              Verify OTP
            </button>

            <p className="text-sm text-gray-500 text-center">
              {timer > 0
                ? `OTP expires in ${timer} seconds`
                : "OTP expired"}
            </p>

            {timer === 0 && (
              <button
                onClick={handleSendOtp}
                className="w-full bg-red-500 text-white py-2 rounded mt-2"
              >
                Resend OTP
              </button>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mb-3 p-2 border rounded text-gray-500"
            />
            <button
              onClick={handleUpdatePassword}
              className="w-full bg-green-500 text-white py-2 rounded"
            >
              Update Password
            </button>
          </>
        )}
      </div>
    </div>
  );
}
