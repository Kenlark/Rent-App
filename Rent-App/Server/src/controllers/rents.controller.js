import mongoose from "mongoose";
import * as rentService from "../services/rent.service.js";
import { StatusCodes } from "http-status-codes";
import checkAdmin from "../middlewares/checkAdmin.middleware.js";
import carsModel from "../models/cars.model.js";

const create = async (req, res) => {
  checkAdmin(req, res, async () => {
    try {
      const { pricePerDay, startDate, endDate, idCar } = req.body;

      if (!pricePerDay || isNaN(pricePerDay) || pricePerDay <= 0) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Le prix par jour doit être un nombre valide." });
      }

      const rentData = {
        ...req.body,
        idCar,
        createdBy: req.user.userID,
      };

      // Crée la location
      const createRent = await rentService.create(rentData);

      //--ajout de priceperday dans le model cars
      // Vérifie l'existence de la voiture
      const car = await carsModel.findById(idCar);
      if (!car) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Voiture non trouvée" });
      }

      // Met à jour le pricePerDay de la voiture avec la valeur de la location
      car.pricePerDay = pricePerDay;
      await car.save(); // Sauvegarde la voiture mise à jour
      //-- jusqu'ici

      res.status(StatusCodes.CREATED).json({
        rent: {
          id: createRent._id,
          startDate: createRent.startDate,
          endDate: createRent.endDate,
          pricePerDay: createRent.pricePerDay,
          status: createRent.status,
          idCar: createRent.idCar,
          createdBy: createRent.createdBy,
        },
        car: {
          id: car._id,
          model: car.model,
          pricePerDay: car.pricePerDay,
        },
      });
    } catch (error) {
      console.error(
        "Erreur lors de la création de la location:",
        error.message
      );
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Erreur lors de la création de la location" });
    }
  });
};

const getAll = async (req, res) => {
  try {
    const allRents = await rentService.getAll();
    res.status(StatusCodes.OK).json({ allRents });
  } catch (error) {
    console.error("Erreur lors de la récupération des locations :", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Erreur lors de la récupération des locations" });
  }
};

const update = async (req, res) => {
  checkAdmin(req, res, async () => {
    const { id } = req.params;

    const isMongoId = mongoose.isValidObjectId(id);
    if (!isMongoId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "ID invalide" });
    }

    try {
      const existingRent = await rentService.get(id);
      if (!existingRent) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Location non trouvée" });
      }

      const { pricePerDay } = req.body;
      if (pricePerDay && (isNaN(pricePerDay) || pricePerDay <= 0)) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Le prix par jour doit être un nombre valide." });
      }

      const updatedRentData = {
        ...req.body,
        createdBy: req.user.userID,
      };

      // Mise à jour de la location
      const updatedRent = await rentService.update(id, updatedRentData);

      // Synchronisation du prix dans le modèle des voitures, si le `pricePerDay` a changé
      if (pricePerDay && pricePerDay !== existingRent.pricePerDay) {
        const car = await carsModel.findById(existingRent.idCar);
        if (car) {
          car.pricePerDay = pricePerDay;
          await car.save();
        }
      }

      res.status(StatusCodes.OK).json({ rent: updatedRent });
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour de la location :",
        error.message
      );
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Erreur lors de la mise à jour de la location" });
    }
  });
};

const remove = async (req, res) => {
  checkAdmin(req, res, async () => {
    const { id } = req.params;

    const isMongoId = mongoose.isValidObjectId(id);
    if (!isMongoId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: `ID invalide : ${id}` });
    }

    const rent = await rentService.get(id);
    if (!rent) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: `Location avec l'id ${id} non trouvée` });
    }

    try {
      await rentService.remove(id);
      res
        .status(StatusCodes.OK)
        .json({ msg: "Location supprimée avec succès" });
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de la location :",
        error.message
      );
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Erreur lors de la suppression de la location",
      });
    }
  });
};

export { getAll, create, update, remove };
