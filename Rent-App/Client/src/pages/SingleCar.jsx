import { Link, useLoaderData } from "react-router-dom";
import { useState } from "react";
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
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de la voiture :", error);
    throw new Response("Erreur lors du chargement des données");
  }
};

const SingleCar = () => {
  const car = useLoaderData();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!car) {
    toast.error("Erreur lors du chargement du véhicule.");
    return <p>Aucune voiture trouvée.</p>;
  }

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === car.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? car.images.length - 1 : prevIndex - 1
    );
  };

  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <>
      <div className="btn-padding">
        <Link to={"/cars"}>
          <button className="btn-redirect-container">
            Retour à tous nos véhicules
          </button>
        </Link>
      </div>
      <section className="single-car-container">
        <div className="single-car-card">
          {car.images && car.images.length > 0 ? (
            <div className="carousel">
              {car.images.length > 1 ? (
                <>
                  <div className="btn-prev">
                    <button onClick={handlePrev} className="carousel-button">
                      &lt;
                    </button>
                  </div>
                  <div>
                    <div className="img-single-car">
                      <img
                        src={car.images[currentImageIndex].url}
                        alt={`${car.brand} ${car.model}`}
                        className="car-image"
                      />
                    </div>
                    {car.images.length > 1 ? (
                      <div className="dots-container">
                        {car.images.map((image, index) => (
                          <span
                            key={index}
                            role="button"
                            tabIndex="0"
                            className={`dot ${
                              currentImageIndex === index ? "active" : ""
                            }`}
                            onClick={() => handleDotClick(index)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                handleDotClick(index);
                              }
                            }}
                          ></span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <button onClick={handleNext} className="carousel-button">
                      &gt;
                    </button>
                  </div>
                </>
              ) : (
                <div className="img-single-car">
                  <img
                    src={car.images[currentImageIndex].url}
                    alt={`${car.brand} ${car.model}`}
                    className="car-image"
                  />
                </div>
              )}
            </div>
          ) : (
            <p>Image non disponible</p>
          )}

          <div className="car-details">
            <h2>
              {car.brand} {car.model} ({car.year})
            </h2>
            <p>
              <img src={gearIcon} className="gear" alt="Transmission" />
              Transmission : {car.transmission}
            </p>
            <p>
              <img src={carSeatIcon} className="car-seat" alt="Places" />
              Places : {car.seats}
            </p>
            <p>
              <img src={fuelTypeIcon} className="fuel" alt="Carburant" />
              Carburant : {car.fuelType}
            </p>
            <p>
              <img
                src={horsePowerIcon}
                className="horse-power"
                alt="Puissance"
              />
              Puissance : {car.horsePower} CV
            </p>
            <p>Prix par jour : {car.pricePerDay} €/jour</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default SingleCar;
