import rentCarModel from "../models/rent.car.model.js";

const getAll = async () => {
  return await rentCarModel.find();
};

const create = async (data) => {
  return await rentCarModel(data).save();
};

const get = (id) => {
  return rentCarModel.findById(id);
};

const remove = async (id) => {
  return await rentCarModel.findByIdAndDelete(id);
};

// Nouveau service pour supprimer toutes les locations d'une voiture donnée
const removeByCarId = async (carId) => {
  return await rentCarModel.deleteMany({ idCar: carId });
};

const update = async (id, data) => {
  return await rentCarModel.findByIdAndUpdate(id, data, { new: true });
};

const updateByCarId = async (carId, data) => {
  return await rentCarModel.updateMany({ idCar: carId }, data);
};

export { getAll, create, remove, update, get, removeByCarId, updateByCarId };
