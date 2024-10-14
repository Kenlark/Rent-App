import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/users/login",
        {
          email,
          password,
        }
      );

      console.log(response.data);
      toast.success("Connexion réussie !");
      setIsLoggedIn(true);
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log(error);
      toast.error("Erreur lors de la connexion");
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  return (
    <>
      <ToastContainer />
      <section>
        <div>
          <form onSubmit={handleSubmit} className="form">
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
            <a href="#">Mot de passe oublié ?</a>
            <button type="submit" className="btn-submit">
              Continuer
            </button>
            {error && <p>{error}</p>}
          </form>
        </div>
      </section>
    </>
  );
};

export default Login;
