import { useEffect, useState } from "react";
import { useLoaderData, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import { toast } from "react-toastify";
import Filters from "../components/Filter.jsx";
import { useAuth } from "../authContext.jsx";

import gear from "../assets/images/gear-solid.svg";
import carSeat from "../assets/images/car-seat-_2_.png";
import fuelType from "../assets/images/gas-pump-solid.svg";
import horsePower from "../assets/images/motor-svgrepo-com.png";

const allCarsUrl = "http://localhost:5000/api/v1/cars";
const allRentsUrl = "http://localhost:5000/api/v1/rent";

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
  const { allCars } = useLoaderData();
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
    brand: "",
    model: "",
    transmission: "",
    seats: "",
    fuelType: "",
    horsePower: "",
    pricePerDay: "",
  });

  const [cars, setCars] = useState(allCars || []);
  const [rent, setRent] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const filteredCars = cars.filter((car) => {
    return (
      (filters.brand === "" ||
        car.brand.toLowerCase().includes(filters.brand.toLowerCase())) &&
      (filters.model === "" ||
        car.model.toLowerCase().includes(filters.model.toLowerCase())) &&
      (filters.transmission === "" ||
        car.transmission
          .toLowerCase()
          .includes(filters.transmission.toLowerCase())) &&
      (filters.seats === "" || car.seats === parseInt(filters.seats)) &&
      (filters.fuelType === "" ||
        car.fuelType.toLowerCase().includes(filters.fuelType.toLowerCase())) &&
      (filters.horsePower === "" ||
        car.horsePower === parseInt(filters.horsePower)) &&
      (filters.pricePerDay === "" ||
        car.pricePerDay
          .toLowerCase()
          .includes(filters.pricePerDay.toLowerCase()))
    );
  });

  useEffect(() => {
    const rentInfo = async () => {
      try {
        const response = await axios.get(allRentsUrl, {
          withCredentials: true,
        });
        setRent(response.data.allRents);
      } catch (error) {
        console.log(error);
      }
    };

    rentInfo();
  }, []);

  useEffect(() => {
    if (currentCar && rent.length > 0) {
      const carRent = rent.find((rent) => rent.idCar === currentCar._id);
      setUpdatedCarData((prevData) => ({
        ...prevData,
        brand: currentCar.brand,
        model: currentCar.model,
        transmission: currentCar.transmission,
        seats: currentCar.seats,
        fuelType: currentCar.fuelType,
        horsePower: currentCar.horsePower,
        pricePerDay: carRent ? carRent.pricePerDay : prevData.pricePerDay,
        rentStatus: carRent ? carRent.status : "Disponible",
      }));
    }
  }, [currentCar, rent]);

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

  const updatePrice = async (carId, newPrice) => {
    try {
      const response = await axios.put(`/api/v1/cars/${carId}`, {
        pricePerDay: newPrice,
      });
      if (response.status === 200) {
        // Requête réussie, mettre à jour l'état
        const updatedCars = cars.map((car) =>
          car._id === carId ? { ...car, pricePerDay: newPrice } : car
        );
        setCars(updatedCars);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du prix :", error);
    }
  };

  useEffect(() => {
    if (currentCar) {
      setUpdatedCarData((prevData) => ({
        ...prevData,
        pricePerDay: currentCar.pricePerDay,
      }));
    }
  }, [currentCar]);

  const refreshRentData = async () => {
    try {
      const response = await axios.get(allRentsUrl, {
        withCredentials: true,
      });
      setRent(response.data.allRents);
    } catch (error) {
      console.log(
        "Erreur lors du rechargement des données de location :",
        error
      );
    }
  };

  const handleSave = async () => {
    try {
      const rentToUpdate = rent.find((rent) => rent.idCar === currentCar._id);

      if (rentToUpdate) {
        await axios.put(
          `http://localhost:5000/api/v1/rent/${rentToUpdate._id}`,
          {
            status: updatedCarData.rentStatus,
          },
          { withCredentials: true }
        );
      }

      const response = await axios.put(
        `http://localhost:5000/api/v1/cars/${currentCar._id}`,
        updatedCarData,
        { withCredentials: true }
      );

      const updatedCars = cars.map((car) =>
        car._id === currentCar._id ? response.data.car : car
      );

      setCars(updatedCars);
      handleModalClose();
      toast.success("Véhicule mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la voiture:", error);
      toast.error("Erreur lors de la mise à jour.");
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
      await axios.delete(`http://localhost:5000/api/v1/cars/${carToDelete}`, {
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

  useEffect(() => {
    const rentInfo = async () => {
      try {
        const response = await axios.get(allRentsUrl, {
          withCredentials: true,
        });
        setRent(response.data.allRents);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    rentInfo();
  }, []);

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
        <Filters filters={filters} onFilterChange={handleFilterChange} />
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
                    {car.brand} {car.model}
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
                    {carRent && (
                      <p key={carRent._id} className="align-info-img">
                        {carRent.pricePerDay} €/jour
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
                        <button
                          className="edit-button"
                          onClick={() => navigate("/rent")}
                        >
                          Réserver
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
