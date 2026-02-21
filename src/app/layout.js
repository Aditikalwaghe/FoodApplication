import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
         <CartProvider>
        <Navbar />
        {children}
        <Footer />
        <Toaster position="top-right" />
        </CartProvider>
      </body>
    </html>
  );
}
