'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);

    // LocalStorage theke cart load kora initial render-e
    useEffect(() => {
        const savedCart = localStorage.getItem('pawbazar_cart');
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart:', e);
            }
        }
    }, []);

    // Cart change hole LocalStorage update kora
    useEffect(() => {
        localStorage.setItem('pawbazar_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Add to Cart Handler
    const addToCart = (product, quantity = 1) => {
        setCartItems((prevItems) => {
            const existingIndex = prevItems.findIndex((item) => item.id === product.id);
            if (existingIndex > -1) {
                const updated = [...prevItems];
                updated[existingIndex].quantity += quantity;
                return updated;
            } else {
                return [...prevItems, { ...product, quantity }];
            }
        });
    };

    // Remove Item
    const removeFromCart = (productId) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    };

    // Update Quantity
    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    // Clear Cart
    const clearCart = () => setCartItems([]);

    // Calculations
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + (Number(item.price) || 0) * item.quantity, 0);

    // src/context/CartContext.js

    return (
        <CartContext.Provider
            value={{
                cart: cartItems,      // <--- Ei line-ta add/update koro
                cartItems,            // duita-i rakha bhalo
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);