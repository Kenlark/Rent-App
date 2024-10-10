import mongoose, { model, Schema } from "mongoose";

import { CARS_STATUS } from "../utils/constants.js";

const CarsSchema = new Schema(
  {
    brand: {
      type: String,
      required: [true, "Veuillez fournir une marque de voiture"],
      maxLength: 40,
    },
    model: {
      type: String,
      required: [true, "Veuillez fournir un modèle de véhicule"],
      maxLength: 60,
    },
    year: {
      type: Number,
      required: [true, "Veuillez fournir l'année du véhicule"],
      validate: {
        validator: Number.isInteger,
        message: "La donnée entrée n'est pas un nombre",
      },
    },
    transmission: {
      type: String,
      required: [true, "Veuillez fournir le type de transmission du véhicule"],
      maxLength: 20,
    },
    fuelType: {
      type: String,
      required: [true, "Veuillez fournir le type de carburant du véhicule"],
    },
    seats: {
      type: Number,
      required: [
        true,
        "Veuillez fournir le nombres de places que dispose le véhicule",
      ],
      validate: {
        validator: Number.isInteger,
        message: "La donnée entrée n'est pas un nombre",
      },
    },
    pricePerHour: {
      type: Number,
    },
    validate: {
      validator: Number.isInteger,
      message: "La donnée entrée n'est pas un nombre",
    },
    pricePerDay: {
      type: Number,
    },
    validate: {
      validator: Number.isInteger,
      message: "La donnée entrée n'est pas un nombre",
    },
    status: {
      type: String,
      enum: [
        CARS_STATUS.IN_PROGRESS,
        CARS_STATUS.COMPLETED,
        CARS_STATUS.AVAILABLE,
      ],
      default: CARS_STATUS.AVAILABLE,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Veuillez fournir un administrateur"],
    },
  },
  { timestamps: true }
);

export default model("Cars", CarsSchema);
