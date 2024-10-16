import { useLoaderData } from "react-router-dom";
import axios from "axios";
import Cars from "./SubmitFormAdmin.jsx";

const allCars = "http://localhost:5000/api/v1/cars";

export const loader = async () => {
  try {
    const carsResponse = await axios.get(allCars);

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

  return (
    <>
      <h1>Voitures</h1>
      {allCars.map((car) => (
        <div key={car._id}>
          {car.images && car.images.length > 0 ? (
            <img src={car.images[0].url} alt={`${car.brand} ${car.model}`} />
          ) : (
            <p>Aucune image disponible</p>
          )}
          <h2>
            {car.brand} {car.model}
          </h2>
          <p>Année : {car.year}</p>
          <p>Transmission : {car.transmission}</p>
          <p>Type de carburant : {car.fuelType}</p>
          <p>Nombre de places : {car.seats}</p>
          <p>Prix par heure : {car.pricePerHour}€</p>
          <p>Prix par jour : {car.pricePerDay}€</p>
          <p>Status : {car.status}</p>
        </div>
      ))}
    </>
  );
}

export default AllCars;
