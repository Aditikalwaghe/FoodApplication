"use client";

import { useState } from "react";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully ✅");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact-us" className="py-8 bg-gray-100 w-full">
    
            <div className="max-w-6xl mx-auto p-4 md:p-8 bg-white rounded-2xl shadow-2xl border-4 border-gray-200 bg-gradient-to-b from-white to-orange-400">

      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-bold text-center text-orange-600 mb-6">
        Contact Us
      </h2>

      {/* Description */}
      <p className="max-w-3xl mx-auto text-center text-gray-700 text-lg mb-10">
        Have questions, feedback, or need help?  
        We’d love to hear from you. Send us a message and our team will respond soon.
      </p>

      {/* Form Card */}
      <div className="max-w-3xl mx-auto bg-gray-50 rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200"  >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-gray-700 mb-1">Name</label>
            <input type="text" name="name"value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-500" />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className=" w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-500 "/>
          </div>

          {/* Message */}
          <div>
            <label className="block text-gray-700 mb-1">Message</label>
            <textarea name="message" value={formData.message} onChange={handleChange} rows="4" required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-500 "/>
          </div>

          {/* Button */}
          <div className="flex justify-center pt-4">
            <button type="submit" className=" bg-orange-500 text-white px-8 py-2 rounded-full hover:bg-orange-600 transition ">
              Send Message
            </button>
          </div>
        </form>
      </div>
      </div>
    </section>
  );
}
