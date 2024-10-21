import { useLoaderData } from "react-router-dom";
import axios from "axios";

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
              <h2 className="car-name">
                {car.brand} {car.model}
              </h2>
              <div className="car-info">
                <p>{car.transmission}</p>
                <p>{car.seats} places</p>
                <p>{car.fuelType}</p>
                <p>{car.horsePower}Cv</p>
                <p>{car.pricePerDay}€/jour</p>
              </div>
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

export default AllCars;
