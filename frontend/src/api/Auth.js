import React, { useEffect, useState } from "react";
import { auth } from "./config";
export const AuthContext = React.createContext();

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

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
