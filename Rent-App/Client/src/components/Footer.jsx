import { NavLink } from "react-router-dom";

import facebook from "../assets/images/facebook-brands-solid.svg";
import twitter from "../assets/images/twitter-brands-solid.svg";
import instagram from "../assets/images/instagram-brands-solid.svg";

function Footer() {
  return (
    <>
      <section className="footer">
        <div className="flex-footer">
          <p className="copyright">&copy; 2024 Rent-App</p>
          <p>Conditions d'utilisation</p>
          <p>Politique de confidentialité</p>
          <p>Gestion des cookies</p>
        </div>
        <div className="flex-contact">
          <p>Contact</p>
          <div className="flex-logo">
            <img src={facebook} alt="Logo Facebook" className="logo" />
            <img src={twitter} alt="Logo Twitter" className="logo" />
            <img src={instagram} alt="Logo Instagram" className="logo" />
          </div>
        </div>
      </section>
    </>
  );
}

export default Footer;
