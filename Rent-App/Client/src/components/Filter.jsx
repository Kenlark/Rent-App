import { useState } from "react";

const Filters = ({ onFilterChange }) => {
  const [priceRange, setPriceRange] = useState([15, 500]);
  const [yearRange, setYearRange] = useState([2008, 2024]);
  const [transmission, setTransmission] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [seats, setSeats] = useState("");
  const [availability, setAvailability] = useState("");

  const handlePriceChange = (e) => {
    const newPriceRange = [e.target.value, priceRange[1]];
    setPriceRange(newPriceRange);
    onFilterChange({ priceRange: newPriceRange });
  };

  const handleYearChange = (e) => {
    const newYearRange = [e.target.value, yearRange[1]];
    setYearRange(newYearRange);
    onFilterChange({ yearRange: newYearRange });
  };

  const handleTransmissionChange = (value) => {
    setTransmission(value);
    onFilterChange({ transmission: value });
  };

  const handleFuelTypeChange = (value) => {
    setFuelType(value);
    onFilterChange({ fuelType: value });
  };

  const handleSeatsChange = (value) => {
    setSeats(value);
    onFilterChange({ seats: value });
  };

  const handleAvailabilityChange = (value) => {
    setAvailability(value);
    onFilterChange({ availability: value });
  };

  return (
    <div className="card-filter">
      <div className="header-filter">
        <h3>Filtres</h3>
        <button
          className="button-filter"
          onClick={() => {
            setPriceRange([15, 500]);
            setYearRange([2008, 2024]);
            setTransmission("");
            setFuelType("");
            setSeats("");
            setAvailability("");
            onFilterChange({
              priceRange: [15, 500],
              yearRange: [2008, 2024],
              transmission: "",
              fuelType: "",
              seats: "",
              availability: "",
            });
          }}
        >
          Réinitialiser
        </button>
      </div>

      <div>
        <label className="slider-label-filter">Type de location</label>
        <div className="flex-filter gap-2">
          <button
            className="button-outline"
            onClick={() => handleAvailabilityChange("")}
          >
            Tout
          </button>
          <button
            className="button-outline"
            onClick={() => handleAvailabilityChange("day")}
          >
            Par jour
          </button>
          <button
            className="button-outline"
            onClick={() => handleAvailabilityChange("hour")}
          >
            Par heure
          </button>
        </div>
      </div>

      <div>
        <label className="slider-label-filter">Gamme de prix</label>
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
        <label className="slider-label-filter">Année</label>
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
        <label className="slider-label-filter">Transmission</label>
        <div className="flex-filter gap-2">
          <button
            className="button-outline"
            onClick={() => handleTransmissionChange("")}
          >
            Tout
          </button>
          <button
            className="button-outline"
            onClick={() => handleTransmissionChange("manual")}
          >
            Manuelle
          </button>
          <button
            className="button-outline"
            onClick={() => handleTransmissionChange("automatic")}
          >
            Automatique
          </button>
        </div>
      </div>

      <div>
        <label className="slider-label-filter">Carburant</label>
        <div className="flex-filter flex-wrap-filter gap-2">
          <button
            className="button-outline"
            onClick={() => handleFuelTypeChange("")}
          >
            Tout
          </button>
          <button
            className="button-outline"
            onClick={() => handleFuelTypeChange("gasoline")}
          >
            Essence
          </button>
          <button
            className="button-outline"
            onClick={() => handleFuelTypeChange("diesel")}
          >
            Diesel
          </button>
          <button
            className="button-outline"
            onClick={() => handleFuelTypeChange("hybrid")}
          >
            Hybride
          </button>
          <button
            className="button-outline"
            onClick={() => handleFuelTypeChange("electric")}
          >
            Électrique
          </button>
        </div>
      </div>

      <div>
        <label className="slider-label-filter">Places</label>
        <div className="flex-filter flex-wrap-filter gap-2">
          <button
            className="button-outline"
            onClick={() => handleSeatsChange("")}
          >
            Tout
          </button>
          <button
            className="button-outline"
            onClick={() => handleSeatsChange("2")}
          >
            2 Places
          </button>
          <button
            className="button-outline"
            onClick={() => handleSeatsChange("4")}
          >
            4 Places
          </button>
          <button
            className="button-outline"
            onClick={() => handleSeatsChange("5")}
          >
            5 Places
          </button>
          <button
            className="button-outline"
            onClick={() => handleSeatsChange("other")}
          >
            Autre
          </button>
        </div>
      </div>

      <div>
        <label className="slider-label-filter">Disponibilité</label>
        <div className="flex-filter gap-2">
          <button
            className="button-outline"
            onClick={() => handleAvailabilityChange("")}
          >
            Tout
          </button>
          <button
            className="button-outline"
            onClick={() => handleAvailabilityChange("available")}
          >
            Disponible
          </button>
          <button
            className="button-outline"
            onClick={() => handleAvailabilityChange("unavailable")}
          >
            Indisponible
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;