"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState({});

  // ✅ Load cart for logged-in user
  // ✅ Load cart whenever login/logout happens
  useEffect(() => {
    const loadCart = () => {
      const currentUser = localStorage.getItem("currentUser");

      if (currentUser) {
        const savedCart = localStorage.getItem(`cart_${currentUser}`);
        setCartItems(savedCart ? JSON.parse(savedCart) : {});
      } else {
        // 🔥 If logged out → empty cart immediately
        setCartItems({});
      }
    };

    loadCart();

    // Listen for login/logout changes
    window.addEventListener("storage", loadCart);

    return () => window.removeEventListener("storage", loadCart);
  }, []);

  // ✅ Save cart per user
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");

    if (currentUser) {
      localStorage.setItem(`cart_${currentUser}`, JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (id) => {
    setCartItems((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (!updated[id]) return prev;

      if (updated[id] === 1) {
        delete updated[id];
      } else {
        updated[id] -= 1;
      }

      return updated;
    });
  };

  // ✅ Add this function to remove item completely
  const removeItemFromCart = (id) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };
  // ✅ Clear entire cart after payment
  const clearCart = () => {
    const currentUser = localStorage.getItem("currentUser");

    if (currentUser) {
      localStorage.removeItem(`cart_${currentUser}`);
    }

    setCartItems({});
  };

  const cartCount = Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        removeItemFromCart,
        clearCart, // ✅ ADD THIS
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
