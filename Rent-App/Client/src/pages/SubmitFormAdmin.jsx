import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker, { registerLocale } from "react-datepicker";
import fr from "date-fns/locale/fr";
registerLocale("fr", fr);
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SubmitFormAdmin = () => {
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userID, setUserID] = useState(null);
  const [carData, setCarData] = useState({
    brand: "",
    model: "",
    year: "",
    transmission: "",
    fuelType: "",
    seats: "",
    horsePower: "",
    images: null,
  });

  const [rentalData, setRentalData] = useState({
    pricePerDay: "",
    status: "",
    startDate: null,
    endDate: null,
    idCar: "",
  });

  const [cars, setCars] = useState([]);
  const [rentStatusOptions, setRentStatusOptions] = useState({});
  const [step, setStep] = useState(1); // État pour gérer l'étape du formulaire
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    const fetchRentStatus = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/rent-status`, {
          withCredentials: true,
        });
        setRentStatusOptions(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRentStatus();
  }, []);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/users/me`, {
          withCredentials: true,
        });
        if (response.data.role === "admin") {
          setIsAdmin(true);
          setUserID(response.data.userId);
        }
      } catch (error) {
        toast.error("Erreur lors de la vérification du rôle.");
      }
    };

    checkAdmin();

    const fetchCars = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/cars`);
        setCars(response.data.allCars);
      } catch (error) {
        toast.error("Erreur lors de la récupération des voitures.");
      }
    };

    fetchCars();
  }, []);

  const handleCarChange = (e) => {
    const { name, type, value, files } = e.target;
    if (name === "images" && files.length > 0) {
      const previewUrls = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewImages(previewUrls);
      setCarData({
        ...carData,
        [name]: Array.from(files),
      });
    } else {
      setCarData({
        ...carData,
        [name]: value,
      });
    }
  };

  const handleDateChange = (dateField) => (date) => {
    setRentalData((prevState) => {
      const newState = { ...prevState, [dateField]: date };
      if (dateField === "endDate") {
        if (!prevState.startDate) {
          const errorMsg = "Vous devez d'abord sélectionner une date de début.";
          setErrorMessage(errorMsg);
          toast.error(errorMsg);
          return { ...newState, endDate: null };
        }
        const startDate = new Date(prevState.startDate);
        const endDate = new Date(date);
        if (endDate <= startDate) {
          const errorMsg =
            "L'heure de fin doit être postérieure à l'heure de début.";
          setErrorMessage(errorMsg);
          toast.error(errorMsg);
          return { ...newState, endDate: null };
        }
      }
      setErrorMessage("");
      return newState;
    });
  };

  const handleRentalChange = (e) => {
    const { name, value, type } = e.target;
    setRentalData((prevData) => ({
      ...prevData,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const getMinTime = () => {
    if (rentalData.startDate) {
      const startDate = new Date(rentalData.startDate);
      return new Date(startDate.setHours(startDate.getHours() + 1));
    }
    return new Date();
  };

  const handleCarSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in carData) {
      if (key === "images") {
        carData.images.forEach((file) => {
          formData.append("images", file);
        });
      } else {
        formData.append(key, carData[key]);
      }
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/cars`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setCars((prevCars) => [...prevCars, response.data.car]);

      toast.success("Voiture ajoutée avec succès !");
      setStep(2); // Passe à l'étape 2 après soumission réussie
    } catch (error) {
      toast.error("Erreur lors de l'ajout de la voiture.");
    }
  };

  const handleRentalSubmit = async (e) => {
    e.preventDefault();
    if (!userID) {
      console.error("ID utilisateur manquant !");
      toast.error("Erreur: ID utilisateur non défini.");
      return;
    }

    try {
      const rentData = {
        ...rentalData,
        userID: userID,
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/rent`,
        rentData,
        { withCredentials: true }
      );
      toast.success("Location créée avec succès !");
      setTimeout(() => {
        navigate("/cars");
      }, 1500);
    } catch (error) {
      toast.error("Erreur lors de la création de la location.");
    }
  };

  return (
    <div className="admin-form">
      <h1>
        {step === 1 ? "Ajout d'une nouvelle voiture" : "Créer une Location"}
      </h1>
      {isAdmin ? (
        <>
          {step === 1 && (
            <form onSubmit={handleCarSubmit} className="admin-form">
              <p>
                Veuillez rentrer toutes les informations nécessaires à la mise
                en location du véhicule.
              </p>
              <label>
                Images:
                <input
                  type="file"
                  name="images"
                  onChange={handleCarChange}
                  required
                  multiple
                />
                {previewImages.length > 0 && (
                  <div className="image-previews">
                    {previewImages.map((image, index) => (
                      <div key={index} className="thumbnail">
                        <img src={image} alt={`Aperçu ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                )}
              </label>
              <label>
                Marque:
                <input
                  type="text"
                  name="brand"
                  value={carData.brand}
                  onChange={handleCarChange}
                  required
                />
              </label>
              <label>
                Modèle:
                <input
                  type="text"
                  name="model"
                  value={carData.model}
                  onChange={handleCarChange}
                  required
                />
              </label>
              <label>
                Année:
                <input
                  type="number"
                  name="year"
                  value={carData.year}
                  onChange={handleCarChange}
                  required
                />
              </label>
              <label>
                Transmission:
                <input
                  type="text"
                  name="transmission"
                  value={carData.transmission}
                  onChange={handleCarChange}
                  required
                />
              </label>
              <label>
                Type de Carburant:
                <input
                  type="text"
                  name="fuelType"
                  value={carData.fuelType}
                  onChange={handleCarChange}
                  required
                />
              </label>
              <label>
                Places:
                <input
                  type="number"
                  name="seats"
                  value={carData.seats}
                  onChange={handleCarChange}
                  required
                />
              </label>
              <label>
                Puissance (ch):
                <input
                  type="number"
                  name="horsePower"
                  value={carData.horsePower}
                  onChange={handleCarChange}
                  required
                />
              </label>
              <button type="submit" className="submit-button">
                Soumettre Voiture
              </button>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={handleRentalSubmit} className="admin-form">
              <h2>Créer une Location</h2>
              <label>
                Prix par Jour:
                <input
                  type="number"
                  name="pricePerDay"
                  value={rentalData.pricePerDay}
                  onChange={handleRentalChange}
                  required
                />
              </label>
              <select
                className="admin-disponibility"
                name="status"
                value={rentalData.status}
                onChange={handleRentalChange}
                required
              >
                <option value="">Sélectionnez la disponibilité</option>
                {Object.entries(rentStatusOptions).map(([key, value]) => (
                  <option key={key} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              <label>
                Date et heure de Début:
                <DatePicker
                  selected={rentalData.startDate}
                  onChange={handleDateChange("startDate")}
                  locale="fr"
                  showTimeSelect
                  timeIntervals={15}
                  minDate={new Date()}
                  timeCaption="Heure"
                  dateFormat="dd/MM/yyyy h:mm aa"
                  className="date-picker"
                />
              </label>
              <label>
                Date et heure de Fin:
                <DatePicker
                  selected={rentalData.endDate}
                  onChange={handleDateChange("endDate")}
                  locale="fr"
                  showTimeSelect
                  timeIntervals={15}
                  minDate={getMinTime()}
                  timeCaption="Heure"
                  dateFormat="dd/MM/yyyy h:mm aa"
                  className="date-picker"
                />
              </label>
              <select
                name="idCar"
                value={rentalData.idCar}
                onChange={handleRentalChange}
                required
              >
                <option value="">Sélectionnez une voiture</option>
                {cars.map((car) => (
                  <option key={car._id} value={car._id}>
                    {car.brand} {car.model} ({car.year})
                  </option>
                ))}
              </select>
              <button type="submit" className="submit-button-admin">
                Soumettre Location.
              </button>
            </form>
          )}
        </>
      ) : (
        <p>
          Vous n'avez pas les autorisations nécessaires pour accéder à ce
          formulaire.
        </p>
      )}
    </div>
  );
};

export default SubmitFormAdmin;
