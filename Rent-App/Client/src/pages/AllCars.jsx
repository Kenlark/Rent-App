import { useEffect, useState } from "react";
import { useLoaderData, Link } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import { toast } from "react-toastify";

import gear from "../assets/images/gear-solid.svg";
import carSeat from "../assets/images/car-seat-_2_.png";
import fuelType from "../assets/images/gas-pump-solid.svg";
import horsePower from "../assets/images/motor-svgrepo-com.png";
import { useAuth } from "../authContext.jsx";

const allCarsUrl = "http://localhost:5000/api/v1/cars";

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
  });

  const [cars, setCars] = useState(allCars || []);
  const { user } = useAuth();

  useEffect(() => {
    if (currentCar) {
      setUpdatedCarData({
        brand: currentCar.brand,
        model: currentCar.model,
        transmission: currentCar.transmission,
        seats: currentCar.seats,
        fuelType: currentCar.fuelType,
        horsePower: currentCar.horsePower,
        pricePerDay: currentCar.pricePerDay,
      });
    }
  }, [currentCar]);

  const handleEditClick = (car) => {
    setCurrentCar(car);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentCar(null);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/v1/cars/${currentCar._id}`,
        updatedCarData,
        {
          withCredentials: true,
        }
      );

      const updatedCars = cars.map((car) =>
        car._id === currentCar._id ? response.data.car : car
      );

      setCars(updatedCars);
      handleModalClose();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la voiture:", error);
      if (error.response) {
        toast.error("Vous n'avez pas les droits administrateurs");
      }
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

  return (
    <section className="container-car-page">
      <h1 className="h1-car">Découvrez nos véhicules</h1>
      <div className="cars-container">
        {cars.map((car) => (
          <section key={car._id} className="cars-card">
            <div className="individual-card">
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
                <h2 className="car-name">
                  {car.brand} {car.model}
                </h2>
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
                  <p className="align-info-img">{car.pricePerDay} €/jour</p>
                </div>
                <div className="flex-btn-admin">
                  <Link to={`/cars/${car._id}`}>
                    <button className="details-button">Voir les détails</button>
                  </Link>
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
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        contentLabel="Modifier le véhicule"
        className="modal"
        overlayClassName="overlay"
      >
        {/* Modal de modification */}
        <h2>Modifier le véhicule</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <label>Marque :</label>
          <input
            type="text"
            name="brand"
            value={updatedCarData.brand}
            onChange={handleInputChange}
            required
          />
          <label>Modèle :</label>
          <input
            type="text"
            name="model"
            value={updatedCarData.model}
            onChange={handleInputChange}
            required
          />
          <label>Transmission :</label>
          <input
            type="text"
            name="transmission"
            value={updatedCarData.transmission}
            onChange={handleInputChange}
            required
          />
          <label>Places :</label>
          <input
            type="number"
            name="seats"
            value={updatedCarData.seats}
            onChange={handleInputChange}
            required
          />
          <label>Type de carburant :</label>
          <input
            type="text"
            name="fuelType"
            value={updatedCarData.fuelType}
            onChange={handleInputChange}
            required
          />
          <label>Puissance :</label>
          <input
            type="number"
            name="horsePower"
            value={updatedCarData.horsePower}
            onChange={handleInputChange}
            required
          />
          <label>Prix par jour :</label>
          <input
            type="number"
            name="pricePerDay"
            value={updatedCarData.pricePerDay}
            onChange={handleInputChange}
            required
          />
          <button className="save-btn" type="submit">
            Sauvegarder
          </button>
          <button
            className="cancel-btn"
            type="button"
            onClick={handleModalClose}
          >
            Annuler
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        contentLabel="Confirmer la suppression"
        className="delete-modal"
        overlayClassName="overlay"
      >
        <h2>Confirmer la suppression</h2>
        <p>Êtes-vous sûr de vouloir supprimer ce véhicule ?</p>
        <div className="flex-btn-modal">
          <button className="confirm-btn" onClick={handleDelete}>
            Confirmer
          </button>
          <button
            className="cancel-btn"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Annuler
          </button>
        </div>
      </Modal>
    </section>
  );
}

export default AllCars;
