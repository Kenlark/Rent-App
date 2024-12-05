import { useState, useEffect } from "react";
import Glass from "../assets/images/loupe.png";
import axios from "axios";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { Link } from "react-router-dom";
import { faqData } from "../data.js";

import gear from "../assets/images/gear-solid.svg";
import carSeat from "../assets/images/car-seat-_2_.png";
import fuelType from "../assets/images/gas-pump-solid.svg";
import horsePower from "../assets/images/motor-svgrepo-com.png";
import Aircraft from "../assets/images/iconmonstr-airport-3.svg";
import Smiley from "../assets/images/iconmonstr-smiley-thin.svg";
import EuroLogo from "../assets/images/iconmonstr-currency-6.svg";
import RoadLogo from "../assets/images/road_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg";
import ChevronDown from "../assets/images/iconmonstr-arrow-65-240.png";
import ChevronUp from "../assets/images/iconmonstr-arrow-66-240.png";
import ChevronRight from "../assets/images/iconmonstr-arrow-63-240.png";

const allCarsUrl = "http://localhost:5000/api/v1/cars";
const allRentsUrl = "http://localhost:5000/api/v1/rent";

export const loader = async () => {
  try {
    const carsResponse = await axios.get(allCarsUrl);
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
  const [rent, setRent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);
  const [filterValue, setFilterValue] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  const handleAvailabilityChange = (event) => {
    setAvailabilityFilter(event.target.value);
  };

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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

    const loadRents = async () => {
      try {
        const rentData = await axios.get(allRentsUrl, {
          withCredentials: true,
        });
        setRent(rentData.data.allRents);
      } catch (error) {
        console.error("Erreur lors du chargement des locations", error);
      }
    };

    loadCars();
    loadRents();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        Chargement des voitures...
      </div>
    );
  }

  // Fonction pour vérifier la disponibilité du véhicule
  const getRentStatus = (carId) => {
    const carRent = rent.find((rent) => rent.idCar === carId);
    return carRent ? carRent.status : null;
  };

  // Fonction pour déterminer la classe de la carte en fonction de la disponibilité
  const getCardClass = (carId) => {
    const status = getRentStatus(carId);
    return status === "Disponible" ? "card-available" : "card-unavailable";
  };

  const filterCars = () => {
    return cars.filter((car) => {
      // Vérifie si la voiture correspond au filtre de marque ou de modèle
      const matchesBrand = filterValue ? car.brand === filterValue : true;
      const matchesModel = filterValue ? car.model === filterValue : true;

      // Vérification de la disponibilité du véhicule selon les dates de location
      const isAvailable = rent.every((r) => {
        if (r.idCar === car._id) {
          const rentStartDate = new Date(r.startDate);
          const rentEndDate = new Date(r.endDate);
          return !(startDate < rentEndDate && endDate > rentStartDate); // Pas de chevauchement des dates
        }
        return true; // Si la voiture n'est pas louée, elle est considérée disponible
      });

      // Applique le filtre de disponibilité basé sur la sélection (Disponible ou Indisponible)
      let availabilityMatch = true;
      if (availabilityFilter === "available") {
        availabilityMatch = isAvailable; // Si disponible, doit être disponible selon les dates
      } else if (availabilityFilter === "unavailable") {
        availabilityMatch = !isAvailable; // Si indisponible, doit être déjà loué
      }

      // Retourne le véhicule si tous les filtres sont true
      return matchesBrand && matchesModel && availabilityMatch;
    });
  };

  return (
    <>
      <div className="filter-container">
        <div className="filter-wrapper">
          <div>
            <p>Marque</p>
            <select value={filterValue} onChange={handleFilterChange}>
              <option value="">Sélectionner une marque ou un modèle</option>
              <option value="Renault">Renault</option>
              <option value="Peugeot">Peugeot</option>
              <option value="Clio">Clio</option>
              <option value="208">208</option>
              {/* Ajoutez d'autres options selon les modèles */}
            </select>
          </div>
          <div>
            <p>Disponibilités</p>
            <select
              value={availabilityFilter}
              onChange={handleAvailabilityChange}
              defaultValue=""
            >
              <option value="">Tout</option>
              <option value="available">Disponibles</option>
              <option value="unavailable">Indisponibles</option>
            </select>
          </div>

          <div>
            <p>Date et heure de début</p>
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
          </div>
          <div>
            <p>Date et heure de fin</p>
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
          </div>

          <button className="search-button">
            <span className="search-icon">
              <img src={Glass} alt="glass search" className="glass" />
            </span>
            Rechercher
          </button>
        </div>
      </div>

      <div className="cars-container-home">
        {filterCars().map((car) => (
          <div
            key={car._id}
            className={`car-item-home ${getCardClass(car._id)}`}
          >
            <div className="flex-header-card-home">
              <h3>
                {car.brand} {car.model}
              </h3>
              <p className="status">{getRentStatus(car._id)}</p>
            </div>
            {car.images && car.images.length > 0 ? (
              <img
                src={car.images[0].url}
                alt={`${car.brand} ${car.model}`}
                className="card-img-home"
              />
            ) : (
              <p>Aucune image disponible</p>
            )}
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
                <img src={horsePower} className="horse-power" alt="Puissance" />
                {car.horsePower} Cv
              </p>
              <p className="align-info-img">{car.pricePerDay} €/jour</p>
            </div>
            <div className="flex-btn-admin">
              <div className="link-details">
                <Link to={`/cars/${car._id}`}>
                  <button className="details-button">Voir les détails</button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-btn-home">
        <Link to={"/cars"} className="underline-home">
          <button className="btn-home">
            Découvrir tous les véhicules{" "}
            <img src={ChevronRight} className="chevron-home" />
          </button>
        </Link>
      </div>
      <section className="advantages">
        <div className="advantages-container">
          <div className="advantage-item">
            <img
              src={Aircraft}
              alt="Icône aéroport"
              className="advantage-icon"
            />
            <h4>Accueil/Retour Aéroport</h4>
            <p>Gratuit</p>
          </div>

          <div className="advantage-item">
            <img src={Smiley} alt="Icône qualité" className="advantage-icon" />
            <h4>Qualité Garantie</h4>
            <p>24/24H</p>
          </div>

          <div className="advantage-item">
            <img src={EuroLogo} alt="Icône prix" className="advantage-icon" />
            <h4>Rapport Qualité/Prix</h4>
            <p>Optimal</p>
          </div>

          <div className="advantage-item">
            <img
              src={RoadLogo}
              alt="Icône kilométrage"
              className="advantage-icon"
            />
            <h4>Kilométrage</h4>
            <p>Illimité</p>
          </div>
        </div>
      </section>
      <section className="faq-section">
        <h2>Foire aux Questions</h2>
        {faqData.map((item, index) => (
          <div key={index} className="faq-item">
            <h3 onClick={() => handleToggle(index)}>
              {item.question}
              <span>
                {openIndex === index ? (
                  <img
                    src={ChevronUp}
                    alt="Chevron Up"
                    className="chevron-home"
                  />
                ) : (
                  <img
                    src={ChevronDown}
                    alt="Chevron Down"
                    className="chevron-home"
                  />
                )}
              </span>
            </h3>
            <div
              className={`faq-answer ${
                openIndex === index ? "open" : "closed"
              }`}
            >
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

export default Home;
