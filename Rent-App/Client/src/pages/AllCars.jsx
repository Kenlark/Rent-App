import { useEffect, useState } from "react";
import { useLoaderData, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { useAuth } from "../authContext.jsx";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import gear from "../assets/images/gear-solid.svg";
import carSeat from "../assets/images/car-seat-_2_.png";
import fuelType from "../assets/images/gas-pump-solid.svg";
import horsePower from "../assets/images/motor-svgrepo-com.png";

const allCarsUrl = `${API_BASE_URL}/api/v1/cars`;
const allRentsUrl = `${API_BASE_URL}/api/v1/rent`;

Modal.setAppElement("#root");

export const loader = async () => {
  try {
    const carsResponse = await axios.get(allCarsUrl);
    return carsResponse.data;
  } catch (error) {
    console.error("Erreur dans le loader :", error);
    throw new Error(
      "Impossible de charger le contenu. Veuillez réessayer plus tard"
    );
  }
};

function AllCars() {
  const { allCars: initialCars } = useLoaderData();
  const [cars, setCars] = useState(initialCars || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCar, setCurrentCar] = useState(null);
  const [carToDelete, setCarToDelete] = useState(null);
  const [updatedCarData, setUpdatedCarData] = useState({
    brand: "",
    model: "",
    transmission: "",
    seats: "",
    fuelType: "",
    horsePower: "",
    pricePerDay: "",
    rentStatus: "Disponible",
  });
  const [filters, setFilters] = useState({
    priceRange: [15, 500],
    yearRange: [1990, 2025],
    transmission: "",
    fuelType: "",
    seats: "",
    availability: "",
    horsePower: [15, 200],
  });

  const initialFilters = {
    priceRange: [15, 500],
    yearRange: [1990, 2025],
    transmission: "",
    fuelType: "",
    seats: "",
    availability: "",
    horsePower: [15, 200],
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  useEffect(() => {
    fetchAllCars();
    fetchRentInfo();
  }, []);

  const [rent, setRent] = useState([]);
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllCars = async () => {
      try {
        const response = await axios.get(allCarsUrl);
        setCars(response.data.allCars);
      } catch (error) {
        console.error("Erreur lors de la récupération des voitures :", error);
        toast.error("Erreur lors de la récupération des voitures");
      } finally {
        setLoading(false);
      }
    };
    fetchAllCars();
  }, []);

  useEffect(() => {
    const fetchRentInfo = async () => {
      try {
        const response = await axios.get(allRentsUrl);
        setRent(response.data.allRents);
      } catch (error) {
        console.error("Erreur lors de la récupération des locations :", error);
      }
    };

    fetchRentInfo();
  }, []);

  // Défaut à "Disponible" si aucune info de location n'est récupérée
  useEffect(() => {
    if (currentCar) {
      const carRent = rent.find((rent) => rent.idCar === currentCar._id);
      setUpdatedCarData((prevData) => ({
        ...prevData,
        brand: currentCar.brand,
        model: currentCar.model,
        transmission: currentCar.transmission,
        seats: currentCar.seats,
        fuelType: currentCar.fuelType,
        horsePower: currentCar.horsePower,
        pricePerDay: carRent ? carRent.pricePerDay : currentCar.pricePerDay,
        rentStatus: carRent ? carRent.status : "Disponible",
      }));
    }
  }, [currentCar, rent]);

  const handleFilterChange = (name, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const filteredCars =
    cars?.filter((car) => {
      const carRent = rent?.find((r) => r.idCar === car._id);
      const rentStatus = carRent ? carRent.status : "Disponible";

      const seatsFilter =
        filters.seats === "" ||
        (filters.seats === "Autre" && ![2, 4, 5].includes(car.seats)) ||
        car.seats === parseInt(filters.seats);

      return (
        (filters.transmission === "" ||
          car.transmission.toLowerCase() ===
            filters.transmission.toLowerCase()) &&
        (filters.fuelType === "" ||
          car.fuelType.toLowerCase() === filters.fuelType.toLowerCase()) &&
        seatsFilter &&
        (filters.availability === "" ||
          (filters.availability === "Disponible" &&
            rentStatus === "Disponible") ||
          (filters.availability === "Indisponible" &&
            rentStatus === "Indisponible")) &&
        car.pricePerDay >= filters.priceRange[0] &&
        car.pricePerDay <= filters.priceRange[1] &&
        car.year >= filters.yearRange[0] &&
        car.year <= filters.yearRange[1] &&
        car.horsePower >= filters.horsePower[0] &&
        car.horsePower <= filters.horsePower[1]
      );
    }) || [];

  const handleEditClick = (car) => {
    const carRent = rent.find((rent) => rent.idCar === car._id);
    setCurrentCar(car);
    setUpdatedCarData({
      brand: car.brand,
      model: car.model,
      transmission: car.transmission,
      seats: car.seats,
      fuelType: car.fuelType,
      horsePower: car.horsePower,
      pricePerDay: carRent ? carRent.pricePerDay : car.pricePerDay,
      rentStatus: carRent ? carRent.status : "Disponible",
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentCar(null);
  };

  const fetchAllCars = async () => {
    try {
      const response = await axios.get(allCarsUrl);
      setCars(response.data.allCars);
    } catch (error) {
      console.error("Erreur lors de la récupération des voitures :", error);
      toast.error("Erreur lors de la récupération des voitures");
    }
  };

  const fetchRentInfo = async () => {
    try {
      const response = await axios.get(allRentsUrl, {
        withCredentials: true,
      });
      setRent(response.data.allRents);
    } catch (error) {
      console.error("Erreur lors de la récupération des locations :", error);
    }
  };

  const handleSave = async () => {
    try {
      const rentToUpdate = rent.find((rent) => rent.idCar === currentCar._id);

      if (rentToUpdate) {
        await axios.put(
          `${API_BASE_URL}/api/v1/rent/${rentToUpdate._id}`,
          {
            status: updatedCarData.rentStatus,
            pricePerDay: updatedCarData.pricePerDay,
          },
          { withCredentials: true }
        );
      }

      const response = await axios.put(
        `${API_BASE_URL}/api/v1/cars/${currentCar._id}`,
        updatedCarData,
        { withCredentials: true }
      );

      if (response.status !== 200) {
        throw new Error(
          "Erreur inattendue lors de la mise à jour de la voiture."
        );
      }

      const updatedCars = cars.map((car) =>
        car._id === currentCar._id ? response.data.car : car
      );

      setCars(updatedCars);

      // Récupérer les données actualisées après la mise à jour
      await fetchAllCars();
      await fetchRentInfo();

      toast.success("Véhicule mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la voiture:", error);
      toast.error("Erreur lors de la mise à jour.");
    } finally {
      handleModalClose(); // Assurez-vous que la modale se ferme toujours
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCarData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/v1/cars/${carToDelete}`, {
        withCredentials: true,
      });

      const updatedCars = cars.filter((car) => car._id !== carToDelete);
      setCars(updatedCars);
      setIsDeleteModalOpen(false);
      toast.success("Voiture supprimée avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression de la voiture:", error);
      if (error.response) {
        toast.error(
          "Vous n'avez pas les droits administrateurs ou erreur serveur"
        );
      }
    }
  };

  const confirmDelete = (carId) => {
    setCarToDelete(carId);
    setIsDeleteModalOpen(true);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        Chargement des voitures...
      </div>
    );
  }

  return (
    <section className="container-car-page">
      <h1 className="h1-car">Découvrez nos véhicules</h1>
      <div className="cars-container">
        <div className="card-filter">
          <div className="header-filter">
            <h3>Filtres</h3>
            <button className="button-filter" onClick={resetFilters}>
              Réinitialiser
            </button>
          </div>

          {/* <div className="underline"></div> */}

          <div className="filter-buttons">
            {/* Transmission */}
            <div className="filter-group">
              <label className="filter-label">Transmission</label>
              <div className="filter-options">
                {["", "Manuelle", "Automatique"].map((option) => (
                  <button
                    key={option}
                    className={`filter-button ${
                      filters.transmission === option ? "active" : ""
                    }`}
                    onClick={() => handleFilterChange("transmission", option)}
                  >
                    {option === "" ? "Tout" : option}
                  </button>
                ))}
              </div>
            </div>

            {/* Carburant */}
            <div className="filter-group">
              <label className="filter-label">Carburant</label>
              <div className="filter-options">
                {["", "Essence", "Diesel", "Hybride", "Électrique"].map(
                  (option) => (
                    <button
                      key={option}
                      className={`filter-button ${
                        filters.fuelType === option ? "active" : ""
                      }`}
                      onClick={() => handleFilterChange("fuelType", option)}
                    >
                      {option === "" ? "Tout" : option}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Places */}
            <div className="filter-group">
              <label className="filter-label">Places</label>
              <div className="filter-options">
                {["", "2", "4", "5", "Autre"].map((option) => (
                  <button
                    key={option}
                    className={`filter-button ${
                      filters.seats === option ? "active" : ""
                    }`}
                    onClick={() =>
                      handleFilterChange(
                        "seats",
                        option === "Autre" ? "Autre" : option
                      )
                    }
                  >
                    {option === "" ? "Tout" : `${option} Places`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="slider-container-filter">
            <label htmlFor="yearRange" className="slider-label-filter">
              Année
            </label>
            <input
              type="range"
              id="yearRange"
              min="1990"
              max="2025"
              value={filters.yearRange[0]}
              onChange={(e) =>
                handleFilterChange("yearRange", [
                  parseInt(e.target.value),
                  filters.yearRange[1],
                ])
              }
              className="filter-input"
            />
            <div className="slider-value-filter">
              <span>{filters.yearRange[0]}</span>
              <span>{filters.yearRange[1]}</span>
            </div>
          </div>

          <div className="slider-container-filter">
            <label htmlFor="priceRange" className="slider-label-filter">
              Gamme de prix
            </label>
            <input
              type="range"
              id="priceRange"
              min="15"
              max="500"
              value={filters.priceRange[0]}
              onChange={(e) =>
                handleFilterChange("priceRange", [
                  parseInt(e.target.value),
                  filters.priceRange[1],
                ])
              }
              className="filter-input"
            />
            <div className="slider-value-filter">
              <span>{filters.priceRange[0]}€</span>
              <span>{filters.priceRange[1]}€</span>
            </div>
          </div>

          <div className="slider-container-filter">
            <label htmlFor="horsePower" className="slider-label-filter">
              Puissance (cv)
            </label>
            <input
              type="range"
              min="15"
              max="200"
              value={filters.horsePower[0]}
              onChange={(e) =>
                handleFilterChange("horsePower", [
                  parseInt(e.target.value),
                  filters.horsePower[1],
                ])
              }
              className="filter-input"
            />
            <div className="slider-value-filter">
              <span>{filters.horsePower[0]}cv</span>{" "}
              <span>{filters.horsePower[1]}cv</span>
            </div>
          </div>
        </div>

        {filteredCars.map((car) => {
          const carRent = rent.find((rent) => rent.idCar === car._id);
          const rentStatus = carRent ? carRent.status : null;

          const cardClass =
            rentStatus === "Disponible" ? "card-available" : "card-unavailable";

          return (
            <section key={car._id} className={`cars-card ${cardClass}`}>
              <div className="individual-card">
                <h2 className="car-name">
                  <div>
                    <p className="brand-model">
                      {car.brand} {car.model}
                    </p>
                  </div>
                  {carRent && (
                    <span key={carRent._id} className="rent-status">
                      <span className="fs-status">{rentStatus}</span>
                    </span>
                  )}
                </h2>
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
                    {car && (
                      <p key={car._id} className="align-info-img">
                        {car.pricePerDay} €/jour
                      </p>
                    )}
                  </div>
                  <div className="flex-btn-admin">
                    <div className="link-details">
                      <Link to={`/cars/${car._id}`}>
                        <button className="details-button">
                          Voir les détails
                        </button>
                      </Link>
                    </div>
                    <button
                      className="edit-button"
                      onClick={() => navigate("/rent")}
                    >
                      Réserver
                    </button>
                    {user && user.role === "admin" && (
                      <>
                        <button
                          className="edit-button"
                          onClick={() => handleEditClick(car)}
                        >
                          Modifier
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => confirmDelete(car._id)}
                        >
                          Supprimer
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        contentLabel="Modifier le véhicule"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Modifier le véhicule</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <label htmlFor="brand">Marque :</label>
          <input
            type="text"
            name="brand"
            value={updatedCarData.brand}
            onChange={handleInputChange}
            required
          />
          <label htmlFor="model">Modèle :</label>
          <input
            type="text"
            name="model"
            value={updatedCarData.model}
            onChange={handleInputChange}
            required
          />
          <label htmlFor="transmission">Transmission :</label>
          <input
            type="text"
            name="transmission"
            value={updatedCarData.transmission}
            onChange={handleInputChange}
            required
          />
          <label htmlFor="seats">Places :</label>
          <input
            type="number"
            name="seats"
            value={updatedCarData.seats}
            onChange={handleInputChange}
            required
          />
          <label htmlFor="fuelType">Carburant :</label>
          <input
            type="text"
            name="fuelType"
            value={updatedCarData.fuelType}
            onChange={handleInputChange}
            required
          />
          <label htmlFor="horsePower">Puissance :</label>
          <input
            type="number"
            name="horsePower"
            value={updatedCarData.horsePower}
            onChange={handleInputChange}
            required
          />
          <label htmlFor="pricePerDay">Prix par jour :</label>
          <input
            type="number"
            name="pricePerDay"
            value={updatedCarData.pricePerDay}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="rentStatus">Statut de location :</label>
          <select
            name="rentStatus"
            value={updatedCarData.rentStatus}
            onChange={handleInputChange}
            required
          >
            <option value="Disponible">Disponible</option>
            <option value="Indisponible">Indisponible</option>
          </select>
          <button type="submit">Sauvegarder</button>
          <button type="button" onClick={handleModalClose}>
            Annuler
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        contentLabel="Confirmer la suppression"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Confirmer la suppression</h2>
        <p>Êtes-vous sûr de vouloir supprimer ce véhicule ?</p>
        <button onClick={handleDelete}>Oui, supprimer</button>
        <button onClick={() => setIsDeleteModalOpen(false)}>Annuler</button>
      </Modal>
    </section>
  );
}

export default AllCars;
