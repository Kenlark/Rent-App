import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../authContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import house from "../assets/images/iconmonstr-home-6.svg";
import car from "../assets/images/car-solid.svg";
import profile from "../assets/images/profile-avatar.svg";
import chevronDown from "../assets/images/chevron-down.svg";
import chevronUp from "../assets/images/chevron-up.svg";
import profileLoggedOut from "../assets/images/iconmonstr-user-1.svg";
import burger from "../assets/images/iconmonstr-menu-lined.svg";

function Navbar() {
  const { isLoggedIn, setIsLoggedIn, user, setUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/users/me`, {
          withCredentials: true,
        });
        if (response.data) {
          setIsLoggedIn(true);
          setUser(response.data);
          setIsAdmin(response.data.role === "admin");
        }
      } catch (error) {
        setIsLoggedIn(false);
        setUser(null);
        setIsAdmin(false);
      }
    };
    checkAuthStatus();
  }, [isLoggedIn]);

  const handleLogout = async () => {
    try {
      // Appel API de déconnexion
      await axios.post(`${API_BASE_URL}/api/v1/users/logout`, null, {
        withCredentials: true,
      });

      // Réinitialisation immédiate des états
      setIsLoggedIn(false);
      setUser(null);
      setIsAdmin(false);
      setIsOpen(false); // Ferme le menu déroulant
      setIsMobileMenuOpen(false); // Ferme le menu mobile s'il est ouvert

      toast.success("Déconnexion réussie");

      // Redirection après un court délai
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
      // En cas d'erreur, on réinitialise quand même les états par sécurité
      setIsLoggedIn(false);
      setUser(null);
      setIsAdmin(false);
      setIsOpen(false);
      setIsMobileMenuOpen(false);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!isLoggedIn) {
      setIsOpen(false);
    }
  }, [isLoggedIn]);

  return (
    <>
      <div className="navbar-wrapper">
        <section className="navbar">
          {isAdmin ? (
            <div className="create-form-absolute">
              <div className="circle-create">
                <NavLink to="submit-form-admin" className="create-car">
                  +
                </NavLink>
              </div>
            </div>
          ) : null}
          <div className="flex-navbar">
            <h5 className="logo-navbar">Logo</h5>

            <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
              <img src={burger} alt="Menu" />
            </button>

            <nav
              className={`navlink ${
                isMobileMenuOpen ? "mobile-menu-open" : ""
              }`}
            >
              <ul className="nav-links">
                <li className="home">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      isActive ? "active-btn home-active" : "inactive-btn"
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <img src={house} alt="Logo Accueil" className="logo-home" />
                    Accueil
                  </NavLink>
                </li>
                <li className="car">
                  <NavLink
                    to="cars"
                    className={({ isActive }) =>
                      isActive ? "active-btn cars-active" : "inactive-btn"
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <img
                      src={car}
                      alt="Logo Voiture"
                      className="logo-car"
                      width={20}
                    />
                    Nos Véhicules
                  </NavLink>
                </li>
                {isLoggedIn ? (
                  <li>
                    <button
                      className="inactive-btn logout-btn"
                      onClick={handleLogout}
                    >
                      Se déconnecter
                    </button>
                  </li>
                ) : null}
                {!isLoggedIn ? (
                  <>
                    <li className="mobile-login">
                      <NavLink
                        to="login"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Se connecter
                      </NavLink>
                    </li>
                    <li className="mobile-register">
                      <NavLink
                        to="register"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        S'inscrire
                      </NavLink>
                    </li>
                  </>
                ) : null}
              </ul>
            </nav>
          </div>

          <div>
            <nav>
              <ul className="flex-login">
                {isLoggedIn ? (
                  <>
                    <nav className={isOpen ? "menu-open" : "menu"}>
                      <ul>
                        <li className="flex-burger-li">
                          <span className="user-mail">
                            {user?.firstName + " " + user?.lastName}
                          </span>
                          <span>{user?.email}</span>
                          <span className="underline-edit">
                            <button className="edit-user-profile">
                              <a
                                href="/edit"
                                className="edit-user-profile-link"
                              >
                                Modifier le Profil
                              </a>
                            </button>
                          </span>
                          <a href="/profile" className="link-burger">
                            Profil
                          </a>
                          <a href="/history" className="link-burger">
                            Historique
                          </a>
                          <a href="/settings" className="link-burger">
                            Paramètres
                          </a>
                          <a href="/contact" className="link-burger">
                            Contact
                          </a>
                          <span className="underline-logout">
                            <button
                              onClick={handleLogout}
                              className="logout-btn-avatar"
                            >
                              Se déconnecter
                            </button>
                          </span>
                        </li>
                      </ul>
                    </nav>
                    <div className="burger-menu logged-in">
                      <button onClick={toggleMenu} className="flex-avatar">
                        <span className="avatar">
                          <span className="color-avatar">
                            <img src={profile} alt="Profile" />
                          </span>
                        </span>
                        <span className="btn-chevron">
                          <img
                            src={isOpen ? chevronUp : chevronDown}
                            alt="Chevron"
                          />
                        </span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <li className="wrap login desktop-only">
                      <NavLink to="login" className="login">
                        Se connecter
                      </NavLink>
                    </li>
                    <li className="register desktop-only">
                      <NavLink to="register" className="register">
                        S'inscrire
                      </NavLink>
                    </li>
                    <div className="burger-menu logged-out">
                      <button
                        onClick={handleLoginRedirect}
                        className="flex-avatar"
                      >
                        <span className="avatar-logged-out">
                          <span>
                            <img src={profileLoggedOut} alt="Profile" />
                          </span>
                        </span>
                      </button>
                    </div>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </section>
      </div>
    </>
  );
}

export default Navbar;
