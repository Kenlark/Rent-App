import rentCarModel from "../models/images.cars.model.js";

const getAll = async () => {
  return await rentCarModel.find();
};

const create = async (data) => {
  return await rentCarModel(data).save();
};

const remove = async (id) => {
  return await rentCarModel.findByIdAndDelete(id);
};

// Si tu as une fonction update, assure-toi qu'elle est aussi asynchrone
// const update = async (id, data) => {
//   return await rentCarModel.findByIdAndUpdate(id, data, { new: true });
// };

export { getAll, create, remove };
