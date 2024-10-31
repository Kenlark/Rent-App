import mongoose from "mongoose";
import * as rentService from "../services/rent.service.js";
import { StatusCodes } from "http-status-codes";
import checkAdmin from "../middlewares/checkAdmin.middleware.js";

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

      const createRent = await rentService.create(rentData);

      res.status(StatusCodes.CREATED).json({
        user: {
          id: createRent._id,
          startDate: createRent.startDate,
          endDate: createRent.endDate,
          pricePerDay: createRent.pricePerDay,
          status: createRent.status,
          idCar: createRent.idCar,
          UserID: createRent.createdBy,
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
    console.error("Erreur lors de la récupération des voitures :", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Erreur lors de la récupération des voitures" });
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

      const updatedRent = await rentService.update(id, updatedRentData);

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
      throw new BadRequestError(`Format de l'id invalide : ${id}`);
    }

    const car = await rentService.get(id);
    if (!car) {
      throw new NotFoundError(`Pas de voiture avec l'id : ${id}`);
    }

    try {
      await rentService.remove(id);

      res
        .status(StatusCodes.OK)
        .json({ msg: "Location supprimée avec succès" });
    } catch (error) {
      console.error(error.message);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Erreur lors de la suppression de la voiture ou des images",
      });
    }
  });
};

export { getAll, create, update, remove };
