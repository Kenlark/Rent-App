import { Link, useLoaderData } from "react-router-dom";
import { toast } from "react-toastify";
import Slider from "react-slick";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

  if (!car) {
    toast.error("Erreur lors du chargement du véhicule.");
    return <p>Aucune voiture trouvée.</p>;
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
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
            // Si il y a plus d'une image, on utilise le carrousel
            car.images.length > 1 ? (
              <Slider {...settings} className="carousel">
                {car.images.map((image, index) => (
                  <div key={index} className="img-single-car">
                    <img
                      src={image.url}
                      alt={`${car.brand} ${car.model}`}
                      className="car-image-singlecar"
                    />
                  </div>
                ))}
              </Slider>
            ) : (
              // Si il n'y a qu'une seule image, on l'affiche directement
              <div className="img-single-car">
                <img
                  src={car.images[0].url}
                  alt={`${car.brand} ${car.model}`}
                  className="car-image-singlecar"
                />
              </div>
            )
          ) : (
            <p>Image non disponible</p>
          )}

          <div className="car-details-singlecar">
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
