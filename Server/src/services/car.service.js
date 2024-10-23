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
  return await carsModel.findByIdAndUpdate(id, data, { new: true });
};

export { getAll, create, remove, update, get };
