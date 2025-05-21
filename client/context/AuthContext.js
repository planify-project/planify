import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { auth } from '../firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged, 
    updateProfile,
    updateEmail,
  sendPasswordResetEmail

} from 'firebase/auth';
import { uploadToCloudinary } from '../api/cloudinary';
import { API_BASE } from '../config';

export const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

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
            const userCredential = await createUserWithEmailAndPassword(auth, email, password,);
            const user = userCredential.user;
            // Set the display name
            await updateProfile(user, { displayName: name });
            // Send user data to backend
            await axios.post(`${API_BASE}/auth/register`, {
                id: user.uid,
                email,
                name,
                password,

            });
        } catch (error) {
            console.error('Registration Error:', error.message);
            throw error;
        }
    };

    const updateUserProfile = async (name, imageFile) => {
        let imageUrl = null;
        if (imageFile) {
            // Upload image to Cloudinary using the new helper
            imageUrl = await uploadToCloudinary(imageFile);
        }
        if (user) {
            // Update Firebase displayName and photoURL
            await updateProfile(user, {
                displayName: name,
                photoURL: imageUrl || user.photoURL // fallback to existing photoURL if no new image
            });
            // Update backend
            await axios.put(`${API_BASE}/auth/updatep-rofile`, {
                id: user.uid,
                name,
                image: imageUrl || user.photoURL // send the correct image URL
            });
        }
    };

    // Log in an existing user and send data to backend
    const login = async (email, password, name) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const id = userCredential.user.uid;
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

    const handleResetPassword = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error) {
            console.error('Reset Password Error:', error.message);

            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserProfile, handleResetPassword }}>
            {children}
        </AuthContext.Provider>
    );
};

