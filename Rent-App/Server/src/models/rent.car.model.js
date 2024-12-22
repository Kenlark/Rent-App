import mongoose, { Schema, model } from "mongoose";

import { RENT_STATUS } from "../utils/constants.js";

const RentSchema = new mongoose.Schema(
  {
    startDate: {
      type: Date,
      required: [true, "Veuillez entrer une date de début de location"],
    },
    endDate: {
      type: Date,
      required: [true, "Veuillez entrer une date de fin de location"],
    },
    pricePerDay: {
      type: Number,
      required: [true, "Le prix par jour est obligatoire"],
      validate: {
        validator: function (value) {
          return Number.isInteger(value);
        },
        message: "La donnée entrée n'est pas un nombre entier",
      },
    },
    status: {
      type: String,
      enum: [RENT_STATUS.AVAILABLE, RENT_STATUS.UNAVAILABLE],
      required: [
        true,
        "Veuillez indiquez si le véhicule est disponible ou non",
      ],
    },
    idCar: {
      type: mongoose.Types.ObjectId,
      ref: "Cars",
      required: [true, "Veuillez fournir l'ID de la voiture"],
    },
    userID: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Veuillez fournir un administrateur"],
    },
  },
  { timestamps: true }
);

export default model("Rent", RentSchema);
