import { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../authContext.jsx";

import logoGoogle from "../assets/images/icons8-google.svg";
import logoApple from "../assets/images/icons8-apple.svg";
import information from "../assets/images/circle-info-solid.svg";

const Register = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [address, setAddress] = useState("");
  const [address2, setAddress2] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showMessageBirthday, setShowMessageBirthday] = useState(false);
  const [showMessageAddress, setShowMessageAddress] = useState(false);

  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/users/register",
        {
          email,
          password,
          firstName,
          lastName,
          birthDate,
          address,
          postalCode,
          city,
          phoneNumber,
        },
        {
          withCredentials: true,
        }
      );

      toast.success("Inscription réussie !");

      const userResponse = await axios.get(
        "http://localhost:5000/api/v1/users/me",
        { withCredentials: true }
      );

      loginUser(userResponse.data); // Met à jour l'utilisateur dans le contexte

      setTimeout(() => {
        navigate("/"); // Redirige après une courte pause
      }, 2000);
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Erreur lors de l'inscription";
      toast.error(errorMessage);
    }
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setStep(step + 1);
  };

  useEffect(() => {
    if (showMessageAddress || showMessageBirthday) {
      const timer = setTimeout(() => {
        if (showMessageAddress) setShowMessageAddress();
        if (showMessageBirthday) setShowMessageBirthday();
      }, 10000);

      return () => clearTimeout(timer); // Nettoyage du timer pour éviter les fuites de mémoire
    }
  }, [showMessageAddress, showMessageBirthday]);

  return (
    <>
      <ToastContainer position="top-center" />
      <section>
        <div className="form-register-center">
          <form
            onSubmit={step === 2 ? handleSubmit : handleNextStep}
            className={`form-register ${
              step === 1 ? "form-register" : "form-register-step2"
            }`}
          >
            {step === 1 ? (
              <>
                <div className="title-register">
                  <div className="step-register">
                    <p>Étape 1 sur 2</p>
                  </div>
                  <div className="h1-register">
                    <h1>Créez un compte</h1>
                  </div>
                </div>
                <div className="btn-oauth-register">
                  <button className="btn-oauth-google-register">
                    <img
                      src={logoGoogle}
                      alt="logo google"
                      className="logo-google-register"
                    />
                  </button>
                  <button className="btn-oauth-apple-register">
                    <img
                      src={logoApple}
                      alt="logo apple"
                      className="logo-apple-register"
                    />
                  </button>
                </div>

                <div className="flex-underline-register">
                  <div className="underline-register1"></div>
                  <p>ou</p>
                  <div className="underline-register2"></div>
                </div>
                <div className="flex-login-register">
                  <p className="p-register">
                    S'inscrire avec une adresse e-mail
                  </p>
                  <p className="p-register-2">
                    Vous avez déjà un compte ?{" "}
                    <a href="/login">Connectez vous</a>
                  </p>
                </div>
                <div className="form-register-label">
                  <label htmlFor="email">Adresse e-mail</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label htmlFor="password">Mot de passe</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn-submit-register"
                    onClick={handleNextStep}
                  >
                    Continuer
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="step-register-step2">
                  <p>Étape 2 sur 2</p>
                </div>
                <div className="flex-identity">
                  <div className="flex-name">
                    <label htmlFor="firstName">Prénom</label>
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      required
                      value={firstName}
                      placeholder="ex : John"
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="flex-name">
                    <label htmlFor="lastName">Nom</label>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      required
                      value={lastName}
                      placeholder="ex : Doe"
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex-birthday">
                  <label htmlFor="birthDate">
                    Date de naissance{" "}
                    <img
                      src={information}
                      alt="logo informations"
                      className="logo-info"
                      onClick={() =>
                        setShowMessageBirthday(!showMessageBirthday)
                      }
                    />
                  </label>
                  {showMessageBirthday ? (
                    <p className="pop-up-info-1">
                      Nous collectons votre date de naissance afin de vérifier
                      votre identité et d'assurer que vous remplissez les
                      conditions d'âge requises pour la location de véhicules.
                      Cela nous permet également de garantir que nous vous
                      proposons des offres et des services adaptés à votre
                      profil. Nous nous engageons à protéger vos données
                      personnelles et à les traiter en toute transparence. Pour
                      plus d'informations sur la manière dont nous utilisons et
                      protégeons vos données, veuillez consulter notre{" "}
                      <a href="#">Politique de confidentialité</a>.
                    </p>
                  ) : null}
                  <DatePicker
                    selected={birthDate}
                    onChange={(date) => setBirthDate(date)}
                    dateFormat={"dd/MM/yyyy"}
                    placeholderText="Sélectionnez une date"
                    showYearDropdown
                    yearDropdownItemNumber={100}
                    scrollableYearDropdown
                  />
                </div>
                <div className="flex-address">
                  <label htmlFor="address">
                    Adresse{" "}
                    <img
                      src={information}
                      alt="logo informations"
                      className="logo-info"
                      onClick={() => setShowMessageAddress(!showMessageAddress)}
                    />
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    required
                    placeholder="ex : 12 rue"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  {showMessageAddress ? (
                    <p className="pop-up-info-2">
                      Nous collectons votre date de naissance afin de vérifier
                      votre identité et d'assurer que vous remplissez les
                      conditions d'âge requises pour la location de véhicules.
                      Cela nous permet également de garantir que nous vous
                      proposons des offres et des services adaptés à votre
                      profil. Nous nous engageons à protéger vos données
                      personnelles et à les traiter en toute transparence. Pour
                      plus d'informations sur la manière dont nous utilisons et
                      protégeons vos données, veuillez consulter notre{" "}
                      <a href="#">Politique de confidentialité</a>.
                    </p>
                  ) : null}
                  <label htmlFor="address2" className="sr-only">
                    Adresse
                  </label>
                  <input
                    type="text"
                    name="address2"
                    id="address2"
                    required
                    placeholder="ex : Bâtiment, Appartement, Étage"
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                  />
                </div>
                <div className="flex-postalcode">
                  <label htmlFor="postalCode">Code postal</label>
                  <input
                    type="text"
                    name="postalCode"
                    id="postalCode"
                    required
                    placeholder="ex : 75009"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>
                <div className="flex-city">
                  <label htmlFor="city">Ville</label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    required
                    placeholder="ex : Paris"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />{" "}
                </div>
                <div className="flex-phone">
                  <label htmlFor="phoneNumber">Numéro de téléphone</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    id="phoneNumber"
                    required
                    placeholder="ex : 0651..."
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <p className="politics">
                  En cliquant sur Créer un compte, je déclare avoir lu et
                  accepter les <a href="#">Conditions d&apos;utilisations</a> et
                  la <a href="#">Politique de confidentialité</a>
                </p>
                <button type="submit" className="btn-submit-register">
                  Créer un compte
                </button>
              </>
            )}
          </form>
        </div>
      </section>
    </>
  );
};

export default Register;
