"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { foodItemsData } from "@/data/foods";

export default function PaymentPage() {
  const router = useRouter();
const { cartItems, clearCart } = useCart();
 
 // ✅ State to hold all foods (default + admin)
  const [allFoods, setAllFoods] = useState([]);

  // ✅ Load admin foods from localStorage (browser only)
  useEffect(() => {
    const adminFoods = JSON.parse(localStorage.getItem("foods")) || [];

    setAllFoods([
      ...foodItemsData,
      ...adminFoods.map(f => ({
        ...f,
        price: Number(f.price), // ensure price is a number
      })),
    ]);
  }, []);

  // ✅ Protect Page - Check Login
useEffect(() => {
  const currentUser = localStorage.getItem("currentUser");

  if (!currentUser) {
    alert("Please login first!");
    router.push("/login");
  }
}, [router]);


  // Form Data
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    mobile: "",
    altMobile: "",
  });

  // Popup
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [paymentProof, setPaymentProof] = useState(null);

  // Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  
  
// Now calculate cartFoods using allFoods
const cartFoods =
  cartItems && allFoods
    ? allFoods.filter((food) => cartItems[food.id] > 0)
    : [];

  const subtotal = cartFoods.reduce(
    (sum, food) => sum + food.price * cartItems[food.id],
    0
  );

  const deliveryFee = subtotal >= 150 ? 0 : 20;
  const total = subtotal + deliveryFee;

  // Show popup
const handlePaymentClick = () => {
  if (!formData.name || !formData.address || !formData.email || !formData.mobile) {
    alert("Please fill all required fields!");
    return;
  }

  // ✅ Mobile validation (exactly 10 digits)
  const mobileRegex = /^[0-9]{10}$/;

  if (!mobileRegex.test(formData.mobile)) {
    alert("Mobile number must be exactly 10 digits!");
    return;
  }

  // ✅ Optional: Alternative mobile validation (if filled)
  if (formData.altMobile && !mobileRegex.test(formData.altMobile)) {
    alert("Alternative mobile must be exactly 10 digits!");
    return;
  }

  setShowPaymentPopup(true);
};


  // Confirm payment
  const handlePaymentConfirm = () => {
    if (!selectedPaymentMethod) {
  alert("Please select a payment method!");
  return;
}

if (!paymentProof) {
  alert("Please upload payment proof!");
  return;
}

  // 1️⃣ Create the order object
 const currentUser = localStorage.getItem("currentUser");

const order = {
  id: Date.now(), // unique order ID
  user: currentUser, // attach order to logged-in user
  date: new Date().toLocaleString(), // order date

  name: formData.name,
  address: formData.address,
  mobile: formData.mobile,
  email: formData.email,
  altMobile: formData.altMobile,

  items: cartFoods.map((food) => ({
    id: food.id,
    name: food.name,
    price: food.price,
    quantity: cartItems[food.id],
  })),

  totalItems: cartFoods.reduce(
    (sum, food) => sum + cartItems[food.id],
    0
  ),

  subtotal,
  deliveryFee,
  total,
  status: "Pending",
};


  // 2️⃣ Get existing orders from localStorage
  const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];

  // 3️⃣ Add new order
  storedOrders.push(order);

  // 4️⃣ Save back to localStorage
  localStorage.setItem("orders", JSON.stringify(storedOrders));

  // 5️⃣ Alert and redirect to Orders page
  alert(`Payment of ₹${total} confirmed via ${selectedPaymentMethod}!`);
clearCart();
router.push("/orders");

};


  // Redirect to payment app
  const handleAppRedirect = (app) => {
    let url = "";
    switch (app) {
      case "GPay":
        url = `https://pay.google.com/upi/pay?amount=${total}&note=Food+Order`;
        break;
      case "Paytm":
        url = `https://paytm.com/upi/?amount=${total}&note=Food+Order`;
        break;
      case "PhonePe":
        url = `https://www.phonepe.com/upi/`; // example link
        break;
      default:
        url = "#";
    }
    // open app in new tab
    window.open(url, "_blank");
    setSelectedPaymentMethod(app);
  };

  return (
    <div className="min-h-screen p-6 bg-orange-50 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6 text-gray-500">Checkout & Payment</h1>

      {/* Cart Summary */}
      <div className="bg-white p-4 rounded shadow w-full max-w-md mb-6">
        <h2 className="text-xl font-semibold mb-3 text-gray-400">Order Summary</h2>
        {cartFoods.map((food) => (
          <div key={food.id} className="flex justify-between mb-2 text-gray-400">
            <span>
              {food.name} x {cartItems[food.id]}
            </span>
            <span>₹{food.price * cartItems[food.id]}</span>
          </div>
        ))}
        <div className="flex justify-between font-semibold border-t border-gray-200 pt-2 text-gray-400">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between font-semibold text-gray-400">
          <span>Delivery Fee</span>
          <span>₹{deliveryFee}</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t border-gray-300 pt-2 mt-2 text-gray-500">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      {/* User Info Form */}
      <div className="bg-white p-6 rounded shadow w-full max-w-md mb-6 ">
        <h2 className="text-xl font-semibold mb-4 text-gray-500">Your Information</h2>
        <div className="flex flex-col space-y-3 ">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded text-gray-400 "
            
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded text-gray-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded text-gray-400"
          />
          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded text-gray-400"
          />
          <input
            type="text"
            name="altMobile"
            placeholder="Alternative Mobile (Optional)"
            value={formData.altMobile}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded text-gray-400"
          />
        </div>

        <button
          onClick={handlePaymentClick}
          className="mt-4 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
        >
          Confirm & Proceed to Payment
        </button>
      </div>

      {/* Payment Popup */}
      {showPaymentPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-sm relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold"
              onClick={() => setShowPaymentPopup(false)}
            >
              &times;
            </button>

            <h2 className="text-xl font-semibold mb-4 text-blue-900">Payment Options</h2>

            <p className="mb-2 font-semibold text-gray-400">Amount to Pay: ₹{total}</p>

            {/* UPI Input */}
            <div className="flex flex-col space-y-2 mb-4">
              <label className="font-semibold text-blue-300">Pay via UPI</label>
              <input
                type="text"
                placeholder="Enter UPI ID (example@upi)"
                className="p-2 border border-gray-300 rounded text-gray-400"
                value={selectedPaymentMethod.includes("UPI") ? selectedPaymentMethod : ""}
                onChange={(e) => setSelectedPaymentMethod(`UPI (${e.target.value})`)}
              />
            </div>

            {/* Payment Apps */}
            <div className="flex flex-col space-y-2 mb-4">
              <label className="font-semibold text-orange-400">Or choose a payment app</label>
              {["Paytm", "GPay", "PhonePe"].map((app) => (
                <button
                  key={app}
                  onClick={() => handleAppRedirect(app)}
                  className={`w-full p-2  border border-gray-300 rounded text-center hover:bg-orange-500 transition text-white bg-purple-900 ${
                    selectedPaymentMethod === app ? "bg-orange-200 font-semibold" : ""
                  }`}
                >
                  {app}
                </button>
              ))}
            </div>

            {/* Upload Proof */}
            <div className="flex flex-col mb-4">
              <label className="font-semibold mb-1 text-blue-900">Upload Payment Proof (screenshot or PDF)</label>
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.pdf"
                onChange={(e) => setPaymentProof(e.target.files[0])}
                className="border p-1 rounded text-gray-400"
              />
            </div>

            <button
              onClick={handlePaymentConfirm}
              disabled={!selectedPaymentMethod || !paymentProof}
              className={`w-full py-2 rounded text-white ${
                selectedPaymentMethod && paymentProof
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-orange-400 cursor-not-allowed"
              } transition`}
            >
              Pay Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
