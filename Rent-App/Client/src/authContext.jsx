import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/users/me`, {
          withCredentials: true,
        });

        if (response.data.userID) {
          // Utilisateur connecté
          setIsLoggedIn(true);
          setUser(response.data);
        } else {
          // Utilisateur déconnecté
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la vérification du statut de l'utilisateur :",
          error
        );
        setIsLoggedIn(false);
        setUser(null); // Assurez-vous de réinitialiser les états en cas d'erreur
      }
    };

    checkUserStatus();
  }, []);

  const logoutUser = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/users/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      setIsLoggedIn(false);
      setUser(null);
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  const loginUser = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext };
