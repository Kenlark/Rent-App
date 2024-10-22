import * as carsService from "../services/car.service.js";
import { StatusCodes } from "http-status-codes";
import checkAdmin from "../middlewares/checkAdmin.middleware.js";
import cloudinary from "cloudinary";
import { formatImage } from "../middlewares/multer.middleware.js";

const create = async (req, res) => {
  // Vérification si l'utilisateur est un admin
  checkAdmin(req, res, async () => {
    const carImages = req.files;

    if (!carImages || carImages.length === 0) {
      return res.status(400).json({ message: "Aucun fichier fourni" });
    }

    const maxSize = 1024 * 1024; // Taille max : 1 Mo
    const imageUrls = [];

    try {
      for (const file of carImages) {
        if (file.size > maxSize) {
          return res
            .status(400)
            .json({ message: "Image trop volumineuse (max 1 Mo)" });
        }

        const formattedFile = formatImage(file);

        const response = await cloudinary.uploader.upload(formattedFile, {
          folder: "Car-Images",
        });

        imageUrls.push({ url: response.secure_url });
      }

      const carData = {
        ...req.body,
        images: imageUrls,
        createdBy: req.user.userID,
      };

      const createCar = await carsService.create(carData);

      res.status(StatusCodes.CREATED).json({ car: createCar });
    } catch (error) {
      console.error("Erreur lors de l'upload des images:", error.message); // Log de l'erreur
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Erreur lors de l'upload des images" });
    }
  });
};

const getAll = async (req, res) => {
  try {
    const allCars = await carsService.getAll();
    res.status(StatusCodes.OK).json({ allCars });
  } catch (error) {
    console.error("Erreur lors de la récupération des voitures :", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Erreur lors de la récupération des voitures" });
  }
};

const remove = async (req, res) => {
  checkAdmin(req, res, async () => {
    const { id } = req.params;

    // Vérification que l'ID est valide
    const isMongoId = mongoose.isValidObjectId(id);
    if (!isMongoId) {
      throw new BadRequestError(`Format de l'id invalide : ${id}`);
    }

    // Trouver la voiture à supprimer
    const car = await carsService.get(id);
    if (!car) {
      throw new NotFoundError(`Pas de voiture avec l'id : ${id}`);
    }

    try {
      const images = car.images; // Récupère les images de la voiture
      for (const image of images) {
        const publicId = image.url.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`Rent-Images/${publicId}`);
      }

      // Supprimer la voiture de MongoDB
      await carsService.remove(id);

      res
        .status(StatusCodes.OK)
        .json({ msg: "Voiture et images supprimées avec succès" });
    } catch (error) {
      console.error(error.message);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Erreur lors de la suppression de la voiture ou des images",
      });
    }
  });
};

export { create, getAll, remove };
