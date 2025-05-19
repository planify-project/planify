import React, { createContext, useState, useEffect } from "react";
import { auth } from "../configs/firebase_config";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup
} from "firebase/auth";
import axios from "axios";
import { API_BASE } from "../configs/url";
import { uploadToCloudinary } from "../api/cloudinary";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const token = await currentUser.getIdToken();
                localStorage.setItem("token", token);
            } else {
                localStorage.removeItem("token");
            }
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const register = async (email, password, name) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, { displayName: name });
        const token = await user.getIdToken();
        localStorage.setItem("token", token);
        await axios.post(`${API_BASE}/authadmin/register`, {
            id: user.uid,
            email,
            name,
            password,
        });
    };

    const updateUserProfile = async (name, imageFile, phone) => {
      let imageUrl = null;
      if (imageFile) {
          imageUrl = await uploadToCloudinary(imageFile);
      }
  
      if (user) {
          await updateProfile(user, {
              displayName: name,
              photoURL: imageUrl || user.photoURL,
          });
  
          // ✅ Force user state update for immediate UI change
          const updatedUser = {
              ...user,
              displayName: name,
              photoURL: imageUrl || user.photoURL,
          };
          setUser(updatedUser);
  
          await axios.put(`${API_BASE}/authadmin/update-profile`, {
              id: user.uid,
              name,
              image: imageUrl || user.photoURL,
          });
      }
  };
  
    const login = async (email, password) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const token = await user.getIdToken();
        localStorage.setItem("token", token);
    };
    const googleProvider = new GoogleAuthProvider();
    const facebookProvider = new FacebookAuthProvider();

    const loginWithGoogle = async () => {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        const token = await user.getIdToken();
        localStorage.setItem("token", token);

        await axios.post(`${API_BASE}/authadmin/social-login`, {
            id: user.uid,
            email: user.email,
            name: user.displayName,
            image: user.photoURL,
        });
    };

    const loginWithFacebook = async () => {
        const result = await signInWithPopup(auth, facebookProvider);
        const user = result.user;
        const token = await user.getIdToken();
        localStorage.setItem("token", token);

        // await axios.post(`${API_BASE}/authadmin/social-login`, {
        //     id: user.uid,
        //     email: user.email,
        //     name: user.displayName,
        //     image: user.photoURL,
        // });
    };

    const logout = async () => {
        await signOut(auth);
        localStorage.removeItem("token");
    };

    const resetPassword = async (email) => {
        await sendPasswordResetEmail(auth, email);
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, login, register, logout, updateUserProfile, resetPassword, loginWithGoogle, loginWithFacebook }}
        >
            {children}
        </AuthContext.Provider>
    );
};
