import mongoose, { model, Schema } from "mongoose";
import User from "./users.model.js";

const ImagesCarsSchema = new Schema({
  url: {
    type: String,
    required: [true, "Veuillez fournir les ou l'URL de l'image de la voiture"],
  },
});

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
        validator: function (value) {
          return Number.isInteger(value);
        },
        message: "La donnée entrée n'est pas un nombre entier",
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
        "Veuillez fournir le nombre de places que dispose le véhicule",
      ],
      validate: {
        validator: function (value) {
          return Number.isInteger(value);
        },
        message: "La donnée entrée n'est pas un nombre entier",
      },
    },
    horsePower: {
      type: Number,
      validate: {
        validator: function (value) {
          return Number.isInteger(value);
        },
        message: "La donnée entrée n'est pas un nombre entier",
      },
    },
    pricePerDay: {
      type: Number,
      required: [false],
      validate: {
        validator: function (value) {
          return Number.isInteger(value);
        },
        message: "La donnée entrée n'est pas un nombre entier",
      },
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Veuillez fournir un administrateur"],
    },
    images: [ImagesCarsSchema],
  },
  { timestamps: true }
);

// hook remove pour supprimer toutes les locations qui se réfèrent à la voiture
CarsSchema.pre("remove", async function (next) {
  try {
    await mongoose.model("Rent").deleteMany({ idCar: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

CarsSchema.pre("save", async function (next) {
  const user = await User.findById(this.createdBy);
  if (!user) {
    return next(new Error("L'utilisateur associé n'existe pas"));
  }
  next();
});

export default model("Cars", CarsSchema);
