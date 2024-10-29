import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

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
        if (error.response && error.response.status === 401) {
          setIsLoggedIn(false);
          setUser(null);
        }
        console.error(
          "Erreur lors de la vérification du statut de l'utilisateur",
          error
        );
      }
    };

    checkUserStatus();
  }, []);

  const logoutUser = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/v1/users/logout",
        {},
        {
          withCredentials: true,
        }
      );

      setIsLoggedIn(false);
      setUser(null);
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
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
