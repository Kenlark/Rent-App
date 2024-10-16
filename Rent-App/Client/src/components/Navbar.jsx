// src/components/Navbar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../authContext.jsx"; // Importer le contexte
import axios from "axios";

import house from "../assets/images/iconmonstr-home-6.svg";
import car from "../assets/images/car-solid.svg";

function Navbar() {
  const { isLoggedIn, setIsLoggedIn } = useAuth(); // Utiliser le contexte
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/v1/users/logout",
        {},
        { withCredentials: true }
      );
      setIsLoggedIn(false); // Met à jour l'état local
      navigate("/"); // Redirige vers la page d'accueil après déconnexion
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  };

  return (
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
                <li>
                  <NavLink to="/profile">Mon Profil</NavLink>
                </li>
                <li>
                  <button onClick={handleLogout}>Se déconnecter</button>
                </li>
              </>
            ) : (
              <>
                <li className="wrap login">
                  <NavLink to="login" className={"login"}>
                    Se connecter
                  </NavLink>
                </li>
                <li className="register">
                  <NavLink to="register" className={"register"}>
                    S'inscrire
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </section>
  );
}

export default Navbar;
