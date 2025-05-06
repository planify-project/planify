import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const AuthContext = createContext();
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';


export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const auth = getAuth();

    // Load user from AsyncStorage
    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                setCurrentUser(JSON.parse(userData));
            }
        } catch (error) {
            console.error('Failed to load user:', error);
        }
    };

    const login = async (email, password) => {
        try {
            if (!email || !password) {
                setError('Email and password are required');
                return;
            }
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await userCredential.user.getIdToken();
            const user = userCredential.user;
            const id = user.uid;
            await axios.post('http://192.168.1.100:3000/api/auth/login', {
                id,
                email,
                password,
            });
            axios.post()
            console.log('User logged in successfully');
            await AsyncStorage.setItem('idToken', idToken);
            await AsyncStorage.setItem('user', JSON.stringify(user));
            const savedToken = await AsyncStorage.getItem('idToken');
            const savedUser = await AsyncStorage.getItem('user');
            navigation.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
            });
            console.log('Saved user :', savedUser);
            console.log('Saved idToken:', savedToken);
        } catch (err) {
            console.error('Login error:', err);
            const errorMessage = (() => {
                switch (err.code) {
                    case 'auth/invalid-credential':
                    case 'auth/user-not-found':
                    case 'auth/wrong-password':
                        setPassword('');
                        return 'Invalid email or password';
                    case 'auth/invalid-email':
                        return 'Invalid email address';
                    case 'auth/too-many-requests':
                        return 'Too many failed attempts. Please try again later';
                    case 'auth/network-request-failed':
                        return 'Network error. Please check your connection and try again';
                    default:
                        return `Login failed: ${err.message}`;
                }
            })();
            setError(errorMessage);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('user');
            setCurrentUser(null);
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    const register = async (email, password, name) => {
        if (!name || !email || !password) {
            Alert.alert('All fields are required');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Password must be at least 6 characters');
            return;
        }

        try {
            // Create user with Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const id = userCredential.user.uid;
            const idToken = await userCredential.user.getIdToken();

            // Send to your backend to store in your DB
            const res = await axios.post('http://localhost:3000/api/auth/register', {
                id,
                name,
                email,
                password,
            });

            // Save idToken and user in AsyncStorage
            await AsyncStorage.setItem('idToken', idToken);

            // Debug: Check if idToken is saved
            const savedToken = await AsyncStorage.getItem('idToken');
            console.log('Saved idToken after register:', savedToken);

            await AsyncStorage.setItem('user', JSON.stringify(res.data.user));

            Alert.alert('Registration successful');
            // navigation.navigate('Home'); // Remove this if navigation is handled by auth state
        } catch (err) {
            console.log('Register error:', err.message);
            Alert.alert('Registration failed', err.message);
        }
    };
    return (
        <AuthContext.Provider value={{ login, logout, register, currentUser }}>
            {children}
        </AuthContext.Provider>
    );
};

