import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // Ajout de l'état pour l'utilisateur

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/users/me",
          { withCredentials: true }
        );
        if (response.data) {
          setIsLoggedIn(true);
          setUser(response.data);
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

  const loginUser = (userData) => {
    setUser(userData);
    setIsLoggedIn(true); // Met à jour l'état d'authentification
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, user, setUser, loginUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthContext };
