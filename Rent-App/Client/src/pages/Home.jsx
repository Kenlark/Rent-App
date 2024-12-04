import { useState, useEffect } from "react";
import Glass from "../assets/images/loupe.png";
import axios from "axios";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";

import gear from "../assets/images/gear-solid.svg";
import carSeat from "../assets/images/car-seat-_2_.png";
import fuelType from "../assets/images/gas-pump-solid.svg";
import horsePower from "../assets/images/motor-svgrepo-com.png";
import { Link } from "react-router-dom";

const allCarsUrl = "http://localhost:5000/api/v1/cars";

export const loader = async () => {
  try {
    const carsResponse = await axios.get(allCarsUrl);
    console.log("Réponse de l'API:", carsResponse.data); // Affiche les données pour vérification
    return carsResponse.data.allCars;
  } catch (error) {
    console.error("Erreur dans le loader :", error);
    toast.error(
      "Impossible de charger le contenu. Veuillez réessayer plus tard"
    );
    throw new Error(
      "Impossible de charger le contenu. Veuillez réessayer plus tard"
    );
  }
};

const Home = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCars = async () => {
      try {
        const carData = await loader();
        setCars(carData); // Stocke les voitures dans l'état
      } catch (error) {
        toast.error("Une erreur est survenue lors du chargement des voitures.");
        console.error("Erreur lors du chargement des voitures:", error);
      } finally {
        setLoading(false); // Fin du chargement
      }
    };

    loadCars();
  }, []);

  if (loading) {
    return <div>Chargement des voitures...</div>; // Affichez un message ou un spinner pendant le chargement
  }

  return (
    <>
      <div className="filter-container">
        <div className="filter-wrapper">
          <select className="filter-select" defaultValue="Renault">
            <option>Marque</option>
            <option>Renault</option>
            {/* Autres options */}
          </select>

          <select className="filter-select" defaultValue="Tout">
            <option>Modèle</option>
            <option>Tout</option>
            {/* Autres options */}
          </select>

          <DatePicker
            locale="fr"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            showTimeSelect
            timeIntervals={15}
            minDate={new Date()}
            timeCaption="Heure"
            dateFormat="dd/MM/yyyy h:mm aa"
          />

          {/* Deuxième DatePicker pour la date de fin */}
          <DatePicker
            locale="fr"
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            showTimeSelect
            timeIntervals={15}
            minDate={startDate} // Date de fin ne peut pas être avant la date de début
            timeCaption="Heure"
            dateFormat="dd/MM/yyyy h:mm aa"
          />

          <button className="search-button">
            <span className="search-icon">
              <img src={Glass} alt="glass search" className="glass" />
            </span>
            Rechercher
          </button>
        </div>
      </div>
      <div className="car-list">
        {cars.map((car) => (
          <div key={car._id} className="car-item">
            <h3>
              {car.brand} {car.model}
            </h3>
            <p>
              {car.year} - {car.transmission}
            </p>
            {car.images && car.images.length > 0 ? (
              <img
                src={car.images[0].url}
                alt={`${car.brand} ${car.model}`}
                className="card-img"
              />
            ) : (
              <p>Aucun véhicule disponible</p>
            )}
            <div>
              <div className="car-info">
                <p className="align-info-img">
                  <img src={gear} className="gear" alt="Transmission" />
                  {car.transmission}
                </p>
                <p className="align-info-img">
                  <img src={carSeat} className="car-seat" alt="Places" />
                  {car.seats} places
                </p>
                <p className="align-info-img">
                  <img src={fuelType} className="fuel" alt="Carburant" />
                  {car.fuelType}
                </p>
                <p className="align-info-img">
                  <img
                    src={horsePower}
                    className="horse-power"
                    alt="Puissance"
                  />
                  {car.horsePower} Cv
                </p>
              </div>
              <div className="flex-btn-admin">
                <div className="link-details">
                  <Link to={`/cars/${car._id}`}>
                    <button className="details-button">Voir les détails</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Home;
