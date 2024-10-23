import { useLoaderData, useNavigation } from "react-router-dom";

import axios from "axios";
import Cookies from "js-cookie";

const allImages = "http://localhost:5000/api/v1/images";
const allCars = "http://localhost:5000/api/v1/cars";

export const loader = async () => {
  try {
    const [carsResponse, imagesResponse] = await Promise.all([
      axios.get(allCars),
      axios.get(allImages),
    ]);

    return {
      allCars: carsResponse.data,
      allImages: imagesResponse.data,
    };
  } catch (error) {
    console.error("Erreur dans le loader :", error);
    throw new Error(
      "Impossible de charger le contenu. Veuillez réessayer plus tard"
    );
  }
};

function Cars() {
  const { allCars, allImages } = useLoaderData();
  const navigation = useNavigation();

  if (navigation.state === "loading") {
    return (
      <main className="loading-center">
        <div className="loading"></div>
      </main>
    );
  }

  const carsWithImages = allCars.map((car) => {
    const carImages = allImages.filter(
      (image) => image.idCar.toString() === car._id.toString()
    );
    return {
      ...car,
      images: carImages,
    };
  });

  return (
    <>
      <h1>Voitures</h1>
      {carsWithImages.map((car) => (
        <div key={car._id} className="car-card">
          {car.images.length > 0 && (
            <img
              src={car.images[0].url}
              alt={`${car.brand} ${car.model}`}
              className="cars-card"
            />
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

export default Cars;
