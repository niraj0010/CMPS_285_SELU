import { createContext, useContext, useEffect, useState } from "react";
import { GetProduct } from "../constants/types";

interface CartItem {
  product: GetProduct;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: GetProduct) => void;
  removeFromCart: (productId: number) => void;
  updateCartItemQuantity: (productId, newQuantity: number) => void;
}
const CartContext = createContext<CartContextType | undefined>(undefined);
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = sessionStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const addToCart = (product: GetProduct) => {
    const existingItem = cart.find((item) => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity++;
      setCart([...cart]);
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number) => {
    const updatedCart = cart.filter((item) => item.product.id !== productId);
    setCart(updatedCart);
  };
  const updateCartItemQuantity = (productId: number, newQuantity: number) => {
    const updatedCart = cart.map((item) => {
      if (item.product.id === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCart(updatedCart);
  };

  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateCartItemQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};
export const useCart = () => {
  const context = useContext(CartContext);
  return context;
};
