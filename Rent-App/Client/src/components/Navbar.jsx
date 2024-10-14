import { NavLink } from "react-router-dom";

import house from "../assets/images/iconmonstr-home-6.svg";
import car from "../assets/images/car-solid.svg";

function Navbar() {
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
                  isActive ? "active-btn home-active" : "inactive-btn1"
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
            <li className="wrap login">
              <NavLink to="login" className={"login"}>
                Se connecter
              </NavLink>
            </li>
            <li className="register">
              <NavLink to="register" className={"register"}>
                S&apos;inscrire
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  );
}

export default Navbar;
