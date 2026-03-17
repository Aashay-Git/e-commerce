import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                // Migration: Clear old data if it has 'username' instead of 'name'
                if (!parsedUser.name && parsedUser.username) {
                    console.log("Clearing old user data format - please log in again");
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    setUser(null);
                } else {
                    setUser(parsedUser);
                }
            } catch (e) {
                console.error("Failed to parse user data", e);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });

            const { token, ...userData } = response.data;

            // Store token and user data
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            setUser(userData);
            return { success: true };
        } catch (error) {
            console.error("Login failed", error);
            return {
                success: false,
                message: error.response?.data?.message || "Login failed. Please check your credentials."
            };
        }
    };

    const register = async (name, email, password) => {
        try {
            await api.post('/auth/register', {
                name,
                email,
                password,
                role: ['user'] // Default role
            });
            return { success: true };
        } catch (error) {
            console.error("Registration failed", error);
            return {
                success: false,
                message: error.response?.data?.message || "Registration failed. Please try again."
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
