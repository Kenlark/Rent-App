import { useLoaderData, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import gearIcon from "../assets/images/gear-solid.svg";
import carSeatIcon from "../assets/images/car-seat-_2_.png";
import fuelTypeIcon from "../assets/images/gas-pump-solid.svg";
import horsePowerIcon from "../assets/images/motor-svgrepo-com.png";

export const loader = async ({ params }) => {
  const { id } = params;
  const carUrl = `http://localhost:5000/api/v1/cars/${id}`;

  try {
    const response = await axios.get(carUrl);
    console.log("Données de la voiture :", response.data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de la voiture :", error);
    throw new Response("Erreur lors du chargement des données");
  }
};

const SingleCar = () => {
  const car = useLoaderData();

  if (!car) {
    toast.error("Erreur lors du chargement du véhicule.");
    return <p>Aucune voiture trouvée.</p>;
  }

  return (
    <section className="single-car-container">
      <div className="single-car-card">
        {car.images && car.images.length > 0 ? (
          <img
            src={car.images[0].url}
            alt={`${car.brand} ${car.model}`}
            className="car-image"
          />
        ) : (
          <p>Image non disponible</p>
        )}
        <h2>
          {car.brand} {car.model} ({car.year})
        </h2>
        <div className="car-details">
          <p>
            <img src={gearIcon} className="gear" />
            Transmission : {car.transmission}
          </p>
          <p>
            <img src={carSeatIcon} className="car-seat" /> Places :{car.seats}
          </p>
          <p>
            <img src={fuelTypeIcon} className="fuel" />
            Carburant : {car.fuelType}
          </p>
          <p>
            <img src={horsePowerIcon} className="horse-power" />
            Puissance : {car.horsePower} CV
          </p>
          <p>Prix par heure : {car.pricePerHour} €/h</p>
          <p>Prix par jour : {car.pricePerDay} €/jour</p>
          <p>Status : {car.status}</p>
        </div>
      </div>
    </section>
  );
};

export default SingleCar;
