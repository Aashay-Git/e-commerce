import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    // Fetch cart when user logs in
    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCart(null);
        }
    }, [user]);

    const fetchCart = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const response = await api.get('/cart');
            setCart(response.data);
        } catch (error) {
            console.error('Error fetching cart:', error);
            // If cart doesn't exist, it will be created on first add
            setCart({ items: [] });
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId, quantity = 1) => {
        if (!user) {
            toast.error('Please login to add items to cart');
            return false;
        }

        try {
            const response = await api.post(`/cart/add?productId=${productId}&quantity=${quantity}`);
            setCart(response.data);
            toast.success('Item added to cart!');
            return true;
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Failed to add item to cart');
            return false;
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        if (!user) return;

        try {
            const response = await api.put(`/cart/item/${itemId}?quantity=${quantity}`);
            setCart(response.data);
            toast.success('Cart updated');
        } catch (error) {
            console.error('Error updating quantity:', error);
            toast.error('Failed to update quantity');
        }
    };

    const removeFromCart = async (itemId) => {
        if (!user) return;

        try {
            const response = await api.delete(`/cart/item/${itemId}`);
            setCart(response.data);
            toast.success('Item removed from cart');
        } catch (error) {
            console.error('Error removing item:', error);
            toast.error('Failed to remove item');
        }
    };

    const clearCart = () => {
        setCart({ items: [] });
    };

    const getTotalItems = () => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((total, item) => total + item.quantity, 0);
    };

    const getTotalPrice = () => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((total, item) => {
            const price = item.product?.price || item.price || 0;
            return total + (price * item.quantity);
        }, 0);
    };

    const value = {
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
        getTotalItems,
        getTotalPrice
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
