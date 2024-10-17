import * as carsService from "../services/car.service.js";
import { StatusCodes } from "http-status-codes";
import checkAdmin from "../middlewares/checkAdmin.middleware.js";

const create = async (req, res) => {
  const createCar = await carsService.create(req.body);
  res.status(StatusCodes.CREATED).json({ car: createCar });
};

const getAll = async (req, res) => {
  try {
    const allCars = await carsService.getAll();
    res.status(StatusCodes.OK).json({ allCars });
  } catch (error) {
    console.error("Erreur lors de la récupération des images :", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Erreur lors de la récupération des images" });
  }
};

const remove = async (req, res) => {
  const job = await carsService.get(req.params.id);
  checkAdmin(req.user, job.createdBy);
  const removedJob = await carsService.remove(req.params.id);
  res.status(StatusCodes.OK).json({ job: removedJob });
};

export { create, getAll, remove };
