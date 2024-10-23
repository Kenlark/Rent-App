import userCarModel from "../models/users.model.js";

const get = async (options) => {
  return await userCarModel.findOne(options);
};

const getAll = async () => {
  return await userCarModel.find();
};

const create = async (data) => {
  return await userCarModel(data).save();
};

const remove = async (id) => {
  const deletedUser = await userCarModel.findByIdAndDelete(id);
  if (!deletedUser) {
    throw new Error(`Aucun utilisateur trouvé avec l'id : ${id}`);
  }
  return deletedUser;
};

const update = async (id, data) => {
  return await userCarModel.findByIdAndUpdate(id, data, { new: true });
};

const getSingleUser = async (id) => {
  return await userCarModel.findById(id);
};

export { getAll, create, remove, update, get, getSingleUser };
