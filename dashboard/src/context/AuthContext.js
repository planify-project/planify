import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../configs/firebase_config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import axios from 'axios';
import { API_BASE } from '../configs/url';
import { uploadToCloudinary } from '../api/cloudinary';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const token = await currentUser.getIdToken();
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const register = async (email, password, name) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password,);
    const user = userCredential.user;

    // Set the display name
    await updateProfile(user, { displayName: name });

    // Get token and store in localStorage
    const token = await user.getIdToken();
    localStorage.setItem('token', token);

    // Optional: Sync with your backend
    await axios.post(`${API_BASE}/authadmin/register`, {
      id: user.uid,
      email,
      name,
      password,

    });
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
      await axios.put(`${API_BASE}/authadmin/updatep-rofile`, {
        id: user.uid,
        name,
        image: imageUrl || user.photoURL // send the correct image URL
      });
    }
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
console.log(user);

    // Get token and store in localStorage
    const token = await user.getIdToken();
    localStorage.setItem('token', token);
    //  Inform your backend
    await axios.post(`${API_BASE}/authadmin/login`, {
      id: user.uid,
      email,
      password

    });
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
