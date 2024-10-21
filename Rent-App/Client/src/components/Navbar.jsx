import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../authContext.jsx";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import house from "../assets/images/iconmonstr-home-6.svg";
import car from "../assets/images/car-solid.svg";
import profile from "../assets/images/profile-avatar.svg";
import chevronDown from "../assets/images/chevron-down.svg";
import chevronUp from "../assets/images/chevron-up.svg";

function Navbar() {
  const { isLoggedIn, setIsLoggedIn, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/v1/users/logout",
        {},
        { withCredentials: true }
      );

      toast.success("Déconnexion réussie");

      setIsLoggedIn(false);

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  };

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!isLoggedIn) {
      setIsOpen(false); // Ferme le menu lors de la déconnexion
    }
  }, [isLoggedIn]);

  return (
    <>
      <section className="navbar">
        <div className="flex-navbar">
          <h5 className="logo-navbar">Logo</h5>
          <nav className="navlink">
            <ul>
              <li className="home">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? "active-btn home-active" : "inactive-btn"
                  }
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
                >
                  <img
                    src={car}
                    alt="Logo Voiture"
                    className="logo-car"
                    width={20}
                  />
                  Voitures
                </NavLink>
              </li>
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
                          {user.firstName + " " + user.lastName}
                        </span>
                        <span>{user.email}</span>
                        <li className="underline-edit">
                          <button className="edit-user-profile">
                            <a href="#" className="edit-user-profile-link">
                              Modifier le Profil
                            </a>
                          </button>
                        </li>
                        <a href="#" className="link-burger">
                          Profil
                        </a>
                        <a href="#" className="link-burger">
                          Historique
                        </a>
                        <a href="#" className="link-burger">
                          Paramètres
                        </a>
                        <a href="#" className="link-burger">
                          Contact
                        </a>
                        <li className="underline-logout">
                          <button onClick={handleLogout} className="logout-btn">
                            Se déconnecter
                          </button>
                        </li>
                      </li>
                    </ul>
                  </nav>
                  <div className="burger-menu">
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
                  <li className="wrap login">
                    <NavLink to="login" className="login">
                      Se connecter
                    </NavLink>
                  </li>
                  <li className="register">
                    <NavLink to="register" className="register">
                      S'inscrire
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </section>
    </>
  );
}

export default Navbar;
