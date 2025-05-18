import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { auth } from '../firebase'; 
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,updateProfile, updateEmail, updatePassword,
    
} from 'firebase/auth';
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
            // Create user in Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // Update the user's display name
            await updateProfile(firebaseUser, {
                displayName: name
            });

            // Get the Firebase token
            const token = await firebaseUser.getIdToken();

            // Create user in our database
            const response = await axios.post(`${API_BASE}/users/firebase`, {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: name
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.data.success) {
                throw new Error('Failed to create user in database');
            }

            // Store both Firebase user and our database user
            setUser({
                ...firebaseUser,
                dbUser: response.data.data
            });
        } catch (error) {
            console.error('Registration Error:', error);
            throw error;
        }
    };

    // Log in an existing user
    const login = async (email, password) => {
        try {
            // Sign in with Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // Get the Firebase token
            const token = await firebaseUser.getIdToken();

            // Get or create user in our database
            const response = await axios.post(`${API_BASE}/users/firebase`, {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0]
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.data.success) {
                throw new Error('Failed to sync user with database');
            }

            // Store both Firebase user and our database user
            setUser({
                ...firebaseUser,
                dbUser: response.data.data
            });
        } catch (error) {
            console.error('Login Error:', error);
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

