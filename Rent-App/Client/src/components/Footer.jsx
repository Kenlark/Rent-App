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
          <a href="#" className="color-link">
            {" "}
            <p>Conditions d'utilisation</p>
          </a>
          <a href="#" className="color-link">
            {" "}
            <p>Politique de confidentialité</p>
          </a>
          <a href="#" className="color-link">
            {" "}
            <p>Gestion des cookies</p>
          </a>
        </div>
        <div className="flex-contact">
          <div>
            <a href="/contact" className="a-contact">
              Contact
            </a>{" "}
          </div>
          <div className="flex-logo">
            <a href="https://facebook.com" target="blank">
              {" "}
              <img src={facebook} alt="Logo Facebook" className="logo" />
            </a>
            <a href="https://twitter.com" target="blank">
              {" "}
              <img src={twitter} alt="Logo Twitter" className="logo" />
            </a>
            <a href="https://instagram.com" target="blank">
              <img src={instagram} alt="Logo Instagram" className="logo" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default Footer;
