import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker, { registerLocale } from "react-datepicker";
import fr from "date-fns/locale/fr";
registerLocale("fr", fr);
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    const fetchRentStatus = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/rent-status",
          { withCredentials: true }
        );
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
        const response = await axios.get(
          "http://localhost:5000/api/v1/users/me",
          { withCredentials: true }
        );
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
        const response = await axios.get("http://localhost:5000/api/v1/cars");
        setCars(response.data.allCars);
      } catch (error) {
        toast.error("Erreur lors de la récupération des voitures.");
      }
    };

    fetchCars();
  }, []);

  const handleCarChange = (e) => {
    const { name, value, type, files } = e.target;
    setCarData({
      ...carData,
      [name]: type === "file" ? Array.from(files) : value,
    });
  };

  const handleRentalChange = (e) => {
    const { name, value, type } = e.target;
    setRentalData((prevData) => ({
      ...prevData,
      [name]: type === "number" ? Number(value) : value,
    }));
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
        "http://localhost:5000/api/v1/cars",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("Voiture ajoutée avec succès !");
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
        "http://localhost:5000/api/v1/rent",
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
    <div>
      <h1>Ajout d'une nouvelle voiture</h1>
      {isAdmin ? (
        <form onSubmit={handleCarSubmit}>
          <p>
            Veuillez rentrer toutes les informations nécessaires à la mise en
            location du véicule
          </p>
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
          <label>
            Images:
            <input
              type="file"
              name="images"
              onChange={handleCarChange}
              required
              multiple
            />
          </label>
          <button type="submit">Soumettre Voiture</button>
        </form>
      ) : (
        <p>Vous devez être administrateur</p>
      )}

      {isAdmin ? (
        <form onSubmit={handleRentalSubmit}>
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
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="Pp"
              locale={fr}
              placeholderText="Date et heure de début"
              className="placeholder-datepicker"
              required
              minDate={new Date()}
              minTime={new Date()}
              maxTime={new Date().setHours(23, 59)}
            />
          </label>
          <label>
            Date et heure de Fin:
            <DatePicker
              selected={rentalData.endDate}
              onChange={handleDateChange("endDate")}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="Pp"
              locale={fr}
              placeholderText="Date et heure de fin"
              className="placeholder-datepicker"
              required
              minDate={getMinTime()}
              minTime={getMinTime()}
              maxTime={new Date().setHours(23, 59)}
            />
          </label>
          <label>
            ID de la Voiture:
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
          </label>
          <button type="submit">Soumettre Location</button>
        </form>
      ) : null}
    </div>
  );
};

export default SubmitFormAdmin;
