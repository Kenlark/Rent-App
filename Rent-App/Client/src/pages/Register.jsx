import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthMonth, setBirthMonth] = useState(1); // Valeur par défaut pour le mois
  const [birthYear, setBirthYear] = useState(new Date().getFullYear()); // Année actuelle par défaut
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/users/register",
        {
          firstName,
          lastName,
          birthMonth,
          birthYear,
          address,
          postalCode,
          city,
          phoneNumber,
        }
      );

      console.log(response.data);
      toast.success("Inscription réussie !");
      navigate("/");
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Erreur lors de l'inscription";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <ToastContainer />
      <section>
        <div>
          <form onSubmit={handleSubmit} className="form">
            <label htmlFor="firstName">Prénom</label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <label htmlFor="lastName">Nom</label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <label htmlFor="birthMonth">Mois de naissance</label>
            <input
              type="number"
              name="birthMonth"
              id="birthMonth"
              min="1"
              max="12"
              value={birthMonth}
              onChange={(e) => setBirthMonth(Number(e.target.value))}
            />
            <label htmlFor="birthYear">Année de naissance</label>
            <input
              type="number"
              name="birthYear"
              id="birthYear"
              min="1900"
              value={birthYear}
              onChange={(e) => setBirthYear(Number(e.target.value))}
            />
            <label htmlFor="address">Adresse</label>
            <input
              type="text"
              name="address"
              id="address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <label htmlFor="postalCode">Code postal</label>
            <input
              type="text"
              name="postalCode"
              id="postalCode"
              required
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
            <label htmlFor="city">Ville</label>
            <input
              type="text"
              name="city"
              id="city"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <label htmlFor="phoneNumber">Numéro de téléphone</label>
            <input
              type="text"
              name="phoneNumber"
              id="phoneNumber"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <button type="submit" className="btn-submit">
              Inscription
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Register;
