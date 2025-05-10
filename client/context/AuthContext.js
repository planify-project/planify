import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebase'; 
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth';
import { API_BASE } from '../config';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Monitor authentication state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    // Register a new user and send data to backend
    const register = async (email, password, name) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const id = userCredential.user.uid;

            // Prepare user data
            

            // Send user data to backend
            await axios.post(`${API_BASE}/auth/register`, {
                id,
                email,
                name,
                password,
            });
        } catch (error) {
            console.error('Registration Error:', error.message);
            throw error;
        }
    };

    // Log in an existing user and send data to backend
    const login = async (email, password, name) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const id = userCredential.user.uid;


            // Prepare user data
         

            // Send user data to backend
            // await axios.post(`${API_BASE}/auth/login`, {
            //     id,
            //     email,
            //     name,
            //     password,
            // });
        } catch (error) {
            console.error('Login Error:', error.message);

            throw error;
        }
    };

    // Log out the current user
    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Logout Error:', error.message);

            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

