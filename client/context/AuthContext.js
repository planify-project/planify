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
    updatePassword,
    GoogleAuthProvider,
    FacebookAuthProvider

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
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    // Get the Firebase token
                    const token = await currentUser.getIdToken();
                    
                    // Try to get or create the user in our database
                    const response = await axios.post(`${API_BASE}/users/firebase`, {
                        uid: currentUser.uid,
                        email: currentUser.email,
                        displayName: currentUser.displayName || currentUser.email.split('@')[0]
                    }, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.data.success) {
                        // Store both Firebase user and our database user
                        setUser({
                            ...currentUser,
                            dbUser: response.data.data
                        });
                    } else {
                        console.error('Failed to create/fetch user in database:', response.data);
                        setUser(currentUser);
                    }
                } catch (error) {
                    console.error('Error syncing user with database:', error);
                    setUser(currentUser);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    // Register a new user
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
            console.error('Registration Error:', error);
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
            // Sign in with Firebase
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

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

