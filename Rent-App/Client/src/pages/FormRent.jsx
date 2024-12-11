import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useAuth } from "../authContext.jsx";

const carDataURL = "http://localhost:5000/api/v1/cars";

export const loader = async () => {
  try {
    const carsResponse = await axios.get(carDataURL);
    return carsResponse.data;
  } catch (error) {
    console.error("Erreur dans le loader :", error);
    throw new Error(
      "Impossible de charger le contenu. Veuillez réessayer plus tard"
    );
  }
};

const FormRent = () => {
  const [captchaQuestion, setCaptchaQuestion] = useState(""); // Question mathématique
  const [captchaCorrectAnswer, setCaptchaCorrectAnswer] = useState(null); // Réponse correcte du CAPTCHA
  const [carData, setCarData] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Générer une question mathématique simple
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    const question = `${num1} + ${num2}`;
    const correctAnswer = num1 + num2;

    setCaptchaQuestion(question);
    setCaptchaCorrectAnswer(correctAnswer);
  };

  // Appel de la génération du CAPTCHA quand le composant est monté
  useEffect(() => {
    generateCaptcha();
  }, []);

  // Récupération des voitures pour le formulaire
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get(carDataURL);
        setCarData(response.data.allCars);
      } catch (error) {
        toast.error("Erreur lors de la récupération des voitures.");
      }
    };
    fetchCars();
  }, []);

  const [formData, setFormData] = useState({
    user_firstname: "",
    user_name: "",
    user_email: "",
    user_phone: "",
    car_model: "",
    license_duration: "",
    message: "",
    captcha_answer: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phone = formData.user_phone;
    const phoneNumber = parsePhoneNumberFromString(phone, "FR");

    if (!phoneNumber || !phoneNumber.isValid()) {
      toast.error("Le numéro de téléphone n'est pas valide.");
      setIsSending(false);
      return;
    }

    const formattedPhone = phoneNumber.formatInternational();
    setFormData((prevData) => ({
      ...prevData,
      user_phone: formattedPhone,
    }));

    // Vérifier si la réponse CAPTCHA est correcte
    if (parseInt(formData.captcha_answer) !== captchaCorrectAnswer) {
      toast.error("Votre réponse au Captcha est incorrect");
      return;
    }

    try {
      setIsSending(true);
      const response = await axios.post("http://localhost:5000/api/v1/emails", {
        from: formData.user_email,
        to: "kenzokerachi@hotmail.fr",
        subject: `Réservation pour ${formData.car_model}`,
        html: `
          <p>Nom: ${formData.user_firstname} ${formData.user_name}</p>
          <p>Email: ${formData.user_email}</p>
          <p>Téléphone: ${formData.user_phone}</p>
          <p>Modèle de voiture souhaité: ${formData.car_model}</p>
          <p>Ancienneté du permis: ${formData.license_duration}</p>
          <p>Message: ${formData.message}</p>
        `,
      });

      if (response.status === 200) {
        toast.success("Email envoyé avec succès!");
        setTimeout(() => {
          navigate("/");
        }, 2000);
        setFormData({
          user_firstname: "",
          user_name: "",
          user_email: "",
          user_phone: "",
          car_model: "",
          license_duration: "",
          message: "",
          captcha_answer: "",
        });
      }
    } catch (error) {
      toast.error("Erreur lors de l'envoi de l'email");
    } finally {
      setIsSending(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="refused-access">
        <h2>Accès refusé</h2>
        <p>Vous devez être connecté pour accéder à cette page.</p>
      </div>
    );
  }

  return (
    <section className="contact-container">
      <div className="form-wrapper">
        <h2>
          Indiquez-nous quel véhicule vous souhaitez réserver et nous vous
          répondrons dans les plus brefs délais
        </h2>
        <form onSubmit={handleSubmit} className="contact-form">
          <input
            type="text"
            name="honeypot"
            style={{ display: "none" }}
            tabIndex="-1"
            autoComplete="off"
          />
          <div className="form-group">
            <div className="input-pair">
              <div>
                <label>Prénom</label>
                <input
                  type="text"
                  name="user_firstname"
                  value={formData.user_firstname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Nom</label>
                <input
                  type="text"
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="input-pair">
              <div>
                <label>Email</label>
                <input
                  type="email"
                  name="user_email"
                  value={formData.user_email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Téléphone</label>
                <input
                  type="tel"
                  name="user_phone"
                  value={formData.user_phone}
                  onChange={handleChange}
                  required
                  inputMode="numeric"
                />
              </div>
            </div>
            <div className="input-pair flex-responsive">
              <div>
                <label>Voiture</label>
                <select
                  name="car_model"
                  value={formData.car_model}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionnez une voiture</option>
                  {carData.map((car, id) => (
                    <option key={id} value={car.model}>
                      {car.brand} {""}
                      {car.model} {""}
                      {car.year} {""}({car.horsePower}cv)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-form-rent">
                  Ancienneté du permis de conduire
                </label>
                <select
                  name="license_duration"
                  value={formData.license_duration}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionnez une ancienneté</option>
                  <option>Inférieur à 3 ans</option>
                  <option>Supérieur à 3 ans</option>
                </select>
              </div>
            </div>
          </div>
          <label>Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>

          {/* CAPTCHA maison */}
          <div>
            <label>{`Quel est le résultat de : ${captchaQuestion}`}</label>
            <input
              type="number"
              name="captcha_answer"
              value={formData.captcha_answer}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-submit" disabled={isSending}>
            {isSending ? "Envoi en cours..." : "Envoyer"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default FormRent;
