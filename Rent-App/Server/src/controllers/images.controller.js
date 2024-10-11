import mongoose from "mongoose";

import { formatImage } from "../middlewares/multer.middleware.js";
import { v2 as cloudinary } from "cloudinary";
import * as rentService from "../services/rent.service.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";

const create = async (req, res) => {
  const rentImages = req.files;

  if (!rentImages || rentImages.length === 0) {
    throw new Error("Aucun fichier fourni");
  }

  const maxSize = 1024 * 1024;

  const imageUrls = []; // Pour stocker les URL des images

  try {
    rentImages.forEach(async (file) => {
      if (file.size > maxSize) {
        throw new Error(
          "Veuillez fournir une image de taille inférieure à 1 Mo"
        );
      }

      // Upload dans le folder cloudfinary defini
      const response = await cloudinary.uploader.upload(file, {
        folder: "Rent-Images",
      });

      // Stocker l'URL de l'image uploadée
      imageUrls.push(response.secure_url);
    });
  } catch (error) {
    console.error(error.message);
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

  res.status(StatusCodes.OK).json({ image });
};

export { create, getAll, remove };
