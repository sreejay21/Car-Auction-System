const { validationResult } = require("express-validator");
const carRepo = require("../repositories/carRepository");
const ApiResponse = require("../utils/apiResponse");

const createCar = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return ApiResponse.getValidationError(res, errors.array());

    const car = await carRepo.createCar(req.body);

    // Map _id to carId before sending response
    const responseCar = {
      carId: car._id,
      make: car.make,
      model: car.model,
      year: car.year,
      createdAt: car.createdAt,
      updatedAt: car.updatedAt,
    };

    return ApiResponse.successCreate({ car: responseCar }, res);
  } catch (error) {
    return ApiResponse.internalServerError(res, error.message);
  }
};

module.exports = { createCar };
