import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) =>{
    const [cart, setCart] = useState(() => {
        const localData = localStorage.getItem('ecommerce_cart');
        return localData ? JSON.parse(localData) : [];
    });

    useEffect(() =>{
        localStorage.setItem('ecommerce_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) =>{
        setCart((prevCart) => {
            const existing = prevCart.find((item) => item.id === product.id);
            if(existing){
                if(existing.quantity >= product.stock) return prevCart;
                return prevCart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prevCart, { ...product, quantity: 1}];
        });
    };

    const updateQuantity = (id, amount, stock) =>{
        setCart((prevCart) =>
            prevCart.map((item) =>{
                if (item.id === id) {
                    const newQty = item.quantity + amount;
                    if (newQty <= 0 || newQty > stock) return item;
                    return { ...item, quantity: newQty };
                }
                return item;
            })
        );
    };

    const removeFromCart = (id) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };

    const clearCart = () => setCart([]);

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
};



export const useCart = () => useContext(CartContext);