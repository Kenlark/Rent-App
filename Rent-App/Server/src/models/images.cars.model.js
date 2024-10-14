import mongoose, { model, Schema } from "mongoose";

const ImagesCars = new mongoose.Schema({
  idCar: {
    type: mongoose.Types.ObjectId,
    ref: "Cars",
    // required: [true, "Veuillez fournir l'ID de la voiture"],
  },
  url: {
    type: String,
    required: [true, "Veuillez fournir l'URL de l'image de la voiture"],
  },
});

export default model("Images", ImagesCars);
