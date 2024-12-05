import { useState } from "react";
import PropTypes from "prop-types";

const Filters = ({ onFilterChange }) => {
  const [priceRange, setPriceRange] = useState([15, 500]);
  const [yearRange, setYearRange] = useState([2008, 2024]);
  const [transmission, setTransmission] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [seats, setSeats] = useState("");
  const [availability, setAvailability] = useState("");

  const handlePriceChange = (e) => {
    const newPriceRange = [parseInt(e.target.value), priceRange[1]];
    setPriceRange(newPriceRange);
    onFilterChange({ type: "price", value: newPriceRange });
  };

  const handleYearChange = (e) => {
    const newYearRange = [parseInt(e.target.value), yearRange[1]];
    setYearRange(newYearRange);
    onFilterChange({ type: "year", value: newYearRange });
  };

  const handleTransmissionChange = (value) => {
    setTransmission(value);
    onFilterChange({ type: "transmission", value });
  };

  const handleFuelTypeChange = (value) => {
    setFuelType(value);
    onFilterChange({ type: "fuelType", value });
  };

  const handleSeatsChange = (value) => {
    setSeats(value);
    onFilterChange({ type: "seats", value });
  };

  const handleAvailabilityChange = (value) => {
    setAvailability(value);
    onFilterChange({ type: "availability", value });
  };

  const resetFilters = () => {
    setPriceRange([15, 500]);
    setYearRange([2008, 2024]);
    setTransmission("");
    setFuelType("");
    setSeats("");
    setAvailability("");
    onFilterChange({
      type: "reset",
      value: {
        priceRange: [15, 500],
        yearRange: [2008, 2024],
        transmission: "",
        fuelType: "",
        seats: "",
        availability: "",
      },
    });
  };

  Filters.propTypes = {
    onFilterChange: PropTypes.func.isRequired,
  };

  return (
    <div className="card-filter">
      <div className="header-filter">
        <h3>Filtres</h3>
        <button className="button-filter" onClick={resetFilters}>
          Réinitialiser
        </button>
      </div>

      <div>
        <label htmlFor="rent" className="slider-label-filter">
          Type de location
        </label>
        <div className="flex-filter gap-2">
          <button
            className={`button-outline ${availability === "" ? "active" : ""}`}
            onClick={() => handleAvailabilityChange("")}
          >
            Tout
          </button>
          <button
            className={`button-outline ${
              availability === "day" ? "active" : ""
            }`}
            onClick={() => handleAvailabilityChange("day")}
          >
            Par jour
          </button>
          <button
            className={`button-outline ${
              availability === "hour" ? "active" : ""
            }`}
            onClick={() => handleAvailabilityChange("hour")}
          >
            Par heure
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="price" className="slider-label-filter">
          Gamme de prix
        </label>
        <div className="slider-container-filter">
          <input
            type="range"
            min="15"
            max="500"
            step="5"
            value={priceRange[0]}
            onChange={handlePriceChange}
          />
          <div className="slider-value-filter">
            <span>{priceRange[0]}€</span>
            <span>{priceRange[1]}€</span>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="year" className="slider-label-filter">
          Année
        </label>
        <div className="slider-container-filter">
          <input
            type="range"
            min="2008"
            max="2024"
            step="1"
            value={yearRange[0]}
            onChange={handleYearChange}
          />
          <div className="slider-value-filter">
            <span>{yearRange[0]}</span>
            <span>{yearRange[1]}</span>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="gear" className="slider-label-filter">
          Transmission
        </label>
        <div className="flex-filter gap-2">
          <button
            className={`button-outline ${transmission === "" ? "active" : ""}`}
            onClick={() => handleTransmissionChange("")}
          >
            Tout
          </button>
          <button
            className={`button-outline ${
              transmission === "manual" ? "active" : ""
            }`}
            onClick={() => handleTransmissionChange("manual")}
          >
            Manuelle
          </button>
          <button
            className={`button-outline ${
              transmission === "automatic" ? "active" : ""
            }`}
            onClick={() => handleTransmissionChange("automatic")}
          >
            Automatique
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="fuel" className="slider-label-filter">
          Carburant
        </label>
        <div className="flex-filter flex-wrap-filter gap-2">
          <button
            className={`button-outline ${fuelType === "" ? "active" : ""}`}
            onClick={() => handleFuelTypeChange("")}
          >
            Tout
          </button>
          <button
            className={`button-outline ${
              fuelType === "gasoline" ? "active" : ""
            }`}
            onClick={() => handleFuelTypeChange("gasoline")}
          >
            Essence
          </button>
          <button
            className={`button-outline ${
              fuelType === "diesel" ? "active" : ""
            }`}
            onClick={() => handleFuelTypeChange("diesel")}
          >
            Diesel
          </button>
          <button
            className={`button-outline ${
              fuelType === "hybrid" ? "active" : ""
            }`}
            onClick={() => handleFuelTypeChange("hybrid")}
          >
            Hybride
          </button>
          <button
            className={`button-outline ${
              fuelType === "electric" ? "active" : ""
            }`}
            onClick={() => handleFuelTypeChange("electric")}
          >
            Électrique
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="seats" className="slider-label-filter">
          Places
        </label>
        <div className="flex-filter flex-wrap-filter gap-2">
          <button
            className={`button-outline ${seats === "" ? "active" : ""}`}
            onClick={() => handleSeatsChange("")}
          >
            Tout
          </button>
          <button
            className={`button-outline ${seats === "2" ? "active" : ""}`}
            onClick={() => handleSeatsChange("2")}
          >
            2 Places
          </button>
          <button
            className={`button-outline ${seats === "4" ? "active" : ""}`}
            onClick={() => handleSeatsChange("4")}
          >
            4 Places
          </button>
          <button
            className={`button-outline ${seats === "5" ? "active" : ""}`}
            onClick={() => handleSeatsChange("5")}
          >
            5 Places
          </button>
          <button
            className={`button-outline ${seats === "other" ? "active" : ""}`}
            onClick={() => handleSeatsChange("other")}
          >
            Autre
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
