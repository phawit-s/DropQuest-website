import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../config/firebaseconfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  updateProfile,
  confirmPasswordReset,
} from "firebase/auth";

const AuthContext = createContext({
  currentUser: null,
  registeremail: () => Promise,
  loginemail: () => Promise,
  signInWithGoogle: () => Promise,
  signInWithFacebook: () => Promise,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentuser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setCurrentuser(user);
      setLoading(false);
    });
  }, []);
  if (loading) {
    return <p>loading...</p>;
  }
  function registeremail(email, password, username) {
    createUserWithEmailAndPassword(auth, email, password).then((res) => {
      updateProfile(auth.currentUser, {
        displayName: username,
      });
    });
  }

  function loginemail(email, password) {
    signInWithEmailAndPassword(auth, email, password);
  }

  function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  function signInWithFacebook() {
    const provider = new FacebookAuthProvider();
    return signInWithPopup(auth, provider);
  }

  const value = {
    currentUser,
    registeremail,
    loginemail,
    signInWithGoogle,
    signInWithFacebook
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
