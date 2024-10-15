import mongoose from "mongoose";

import { formatImage } from "../middlewares/multer.middleware.js";
import { v2 as cloudinary } from "cloudinary";
import * as rentService from "../services/images.service.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import imagesCarsModel from "../models/images.cars.model.js";

const create = async (req, res) => {
  const rentImages = req.files;

  if (!rentImages || rentImages.length === 0) {
    return res.status(400).json({ message: "Aucun fichier fourni" });
  }

  const maxSize = 1024 * 1024; // Taille max : 1 Mo
  const imageUrls = [];

  try {
    for (const file of rentImages) {
      if (file.size > maxSize) {
        return res
          .status(400)
          .json({ message: "Image trop volumineuse (max 1 Mo)" });
      }

      // Formater l'image pour l'upload vers Cloudinary
      const formattedFile = formatImage(file); // Convertir en DataURI
      const response = await cloudinary.uploader.upload(formattedFile, {
        folder: "Rent-Images",
      });

      // Stocker l'URL de l'image uploadée dans MongoDB avec l'ID de la voiture
      const imageData = {
        url: response.secure_url,
      };

      // Sauvegarder dans MongoDB
      await imagesCarsModel.create(imageData);

      // Ajouter l'URL à la réponse
      imageUrls.push(response.secure_url);
    }

    return res.status(201).json({ imageUrls });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ message: "Erreur lors de l'upload des images" });
  }
};

const getAll = async (req, res) => {
  try {
    const allImages = await rentService.getAll();
    res.status(StatusCodes.OK).json({ allImages });
  } catch (error) {
    console.error("Erreur lors de la récupération des images :", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Erreur lors de la récupération des images" });
  }
};

const remove = async (req, res) => {
  const { id } = req.params;

  const isMongoId = mongoose.isValidObjectId(id);

  if (!isMongoId) {
    throw new BadRequestError(`Format de l'id invalide : ${id}`);
  }

  const image = await rentService.remove(id);

  if (!image) {
    throw new NotFoundError(`Pas de tâche avec l'id : ${id}`);
  }

  res.status(StatusCodes.OK).json({ msg: "Image supprimée avec succès" });
};

export { create, getAll, remove };
