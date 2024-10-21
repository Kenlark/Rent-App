import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "../authContext.jsx"; // Assurez-vous que le chemin est correct

import logoGoogle from "../assets/images/icons8-google.svg";
import logoApple from "../assets/images/icons8-apple.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setIsLoggedIn, setUser, loginUser } = useAuth(); // Utiliser le contexte
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/users/login",
        {
          email,
          password,
        },
        {
          withCredentials: true, // Permet à Axios d'envoyer les cookies avec la requête
        }
      );

      const { token, user: loggedUser } = response.data;

      if (!loggedUser) {
        throw new Error("L'utilisateur n'est pas défini dans la réponse.");
      }

      Cookies.set("token", token, { expires: 7, path: "/" });

      loginUser(loggedUser);
      setIsLoggedIn(true);
      setUser(loggedUser);
      setEmail("");
      setPassword("");

      toast.success("Connexion réussie !");
      setTimeout(() => {
        navigate("/"); // Redirection après une connexion réussie
      }, 1500);
    } catch (error) {
      console.log("Erreur lors de la connexion :", error); // Ajouté pour déboguer
      const errorMessage =
        error.response?.data?.message || "Erreur lors de la connexion";

      if (error.response?.status === 401) {
        toast.error(
          "Identifiants invalides. Veuillez vérifier votre e-mail et votre mot de passe."
        );
      } else {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <>
      <ToastContainer position="top-center" />
      <section className="test">
        <div className="form-card">
          <form onSubmit={handleSubmit} className="form">
            <h1>Se connecter</h1>
            <p className="new-user">
              Vous êtes un nouvel utilisateur ?{" "}
              <a href="/register">Créez un compte</a>
            </p>
            <label htmlFor="email" className="label-mail">
              Adresse e-mail
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password" className="label-password">
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="forgot-password">
              <a href="#">Mot de passe oublié ?</a>
              <button type="submit" className="btn-submit">
                Continuer
              </button>
            </div>
            <div className="flex-underline">
              <div className="underline-login1"></div>
              <p>ou</p>
              <div className="underline-login2"></div>
            </div>
            <div className="flex-btn-oauth">
              <button className="btn-oauth-google">
                <img
                  src={logoGoogle}
                  alt="logo google"
                  className="logo-google"
                />
                Continuer avec Google
              </button>
              <button className="btn-oauth-apple">
                <img src={logoApple} alt="logo apple" className="logo-apple" />
                Continuer avec Apple
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Login;
