import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/users/me",
          { withCredentials: true }
        );
        if (response.data) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la vérification du statut de l'utilisateur",
          error
        );
        setIsLoggedIn(false);
      }
    };

    checkUserStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
