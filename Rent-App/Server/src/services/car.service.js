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
    throw error; // ou gérer l'erreur comme tu le souhaites
  }
};

const carId = "670f8a8cc5cf111aa9d2bb68";
const dataToUpdate = {
  brand: "Toyota",
  model: "Corolla",
  year: 2021,
  transmission: "Automatique",
  fuelType: "Essence",
  seats: 5,
  pricePerHour: 10,
  pricePerDay: 70,
  horsePower: 130, // Assurez-vous que cette valeur est 130
  createdBy: "6719f30bc6bdb31882595514",
};

// Appel de la fonction de mise à jour
update(carId, dataToUpdate);

export { getAll, create, remove, update, get };
