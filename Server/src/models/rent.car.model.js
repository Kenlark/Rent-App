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
    totalPrice: {
      type: Number,
      required: [true, "Veuillez entrer un prix de location"],
    },
    status: {
      type: String,
      enum: [
        RENT_STATUS.AVAILABLE,
        RENT_STATUS.IN_PROGRESS,
        RENT_STATUS.UNAVAILABLE,
      ],
      default: RENT_STATUS.AVAILABLE,
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
