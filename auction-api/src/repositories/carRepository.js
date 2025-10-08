const Car = require("../models/CarModel");

const createCar = async (carData) => {
  try {
    const car = await Car.create(carData);
    return car;
  } catch (error) {
    console.error("Error creating car:", error);
    throw new Error("Failed to create car");
  }
};

const getCarById = async (carId) => {
  try {
    const car = await Car.findById(carId);
    return car;
  } catch (error) {
    console.error("Error fetching car by ID:", error);
    throw new Error("Failed to get car by ID");
  }
};

module.exports = { createCar, getCarById };
