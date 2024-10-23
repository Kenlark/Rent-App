import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";

import gear from "../assets/images/gear-solid.svg";
import carSeat from "../assets/images/car-seat-_2_.png";
import fuelType from "../assets/images/gas-pump-solid.svg";
import horsePorwer from "../assets/images/engine.png";

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
  const [currentCar, setCurrentCar] = useState(null);
  const [updatedCarData, setUpdatedCarData] = useState({
    brand: "",
    model: "",
    transmission: "",
    seats: "",
    fuelType: "",
    horsePower: "",
    pricePerDay: "",
  });

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

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/api/v1/cars/${currentCar._id}`,
        updatedCarData
      );
      console.log("Voiture mise à jour:", response.data);

      // Met à jour l'état local avec la voiture mise à jour
      const updatedCars = allCars.map((car) =>
        car._id === currentCar._id ? response.data.car : car
      );

      // Rafraîchir l'état avec les voitures mises à jour
      setCurrentCar(null);
      setIsModalOpen(false);
      // Réfléchir les changements sur la liste
      allCars = updatedCars; // Il faut s'assurer que allCars est un useState
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la voiture:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCarData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <section className="container-car-page">
      <h1 className="h1-car">Découvrez nos véhicules</h1>
      <div className="cars-container">
        {allCars.map((car) => (
          <section key={car._id} className="cars-card">
            <div className="individual-card">
              {car.images && car.images.length > 0 ? (
                <img
                  src={car.images[0].url}
                  alt={`${car.brand} ${car.model}`}
                  className="card-img"
                />
              ) : (
                <p>Aucun véhicules disponible</p>
              )}
              <div>
                <h2 className="car-name">
                  {car.brand} {car.model}
                </h2>
                <div className="car-info">
                  <p className="align-info-img">
                    <img src={gear} className="gear" />
                    {car.transmission}
                  </p>
                  <p className="align-info-img">
                    <img src={carSeat} className="car-seat" />
                    {car.seats} places
                  </p>
                  <p className="align-info-img">
                    <img src={fuelType} className="fuel" />
                    {car.fuelType}
                  </p>
                  <p className="align-info-img">
                    <img src={horsePorwer} className="horse-power" />
                    {car.horsePower} Cv
                  </p>
                  <p className="align-info-img">{car.pricePerDay} €/jour</p>
                </div>
                <button onClick={() => handleEditClick(car)}>Modifier</button>
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
        <h2>Modifier le véhicule</h2>
        <form onSubmit={handleSave}>
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
          <button type="submit">Sauvegarder</button>
          <button type="button" onClick={handleModalClose}>
            Annuler
          </button>
        </form>
      </Modal>
    </section>
  );
}

export default AllCars;
