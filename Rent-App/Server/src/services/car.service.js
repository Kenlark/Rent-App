import carsModel from "../models/cars.model.js";

const getAll = async () => {
  return await carsModel.find();
};

const get = (id) => {
  return carsModel.findById(id);
};

const create = async (data) => {
  return await carsModel(data).save();
};

const remove = async (id) => {
  return await carsModel.findByIdAndDelete(id);
};

const update = async (id, data) => {
  try {
    const updatedCar = await carsModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    return updatedCar;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la voiture :", error);
  }
};

export { getAll, create, remove, update, get };
