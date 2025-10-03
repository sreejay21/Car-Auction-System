const Car = require("../models/CarModel");

const createCar = async (carData) => {
  return await Car.create(carData);
};

const getCarById = async (carId) => {
  return await Car.findById(carId);
};

module.exports = { createCar, getCarById };
