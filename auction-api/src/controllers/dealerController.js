const { validationResult } = require("express-validator");
const dealerRepo = require("../repositories/dealerRepository");
const ApiResponse = require("../utils/apiResponse");
const messages = require("../constants/messages");

const createDealer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ApiResponse.getValidationError(res, errors.array());
    }

    // Check if dealer with email already exists
    const existingDealer = await dealerRepo.findDealerByEmail(req.body.email);
    if (existingDealer) {
      return ApiResponse.badRequest(res, messages.ERRORS.DealerExists);
    }

    // Create dealer
    const dealer = await dealerRepo.createDealer(req.body);

    // Map _id to dealerId in response
    const responseDealer = {
      dealerId: dealer._id,
      name: dealer.name,
      email: dealer.email,
    };

    return ApiResponse.successCreate(
      { dealer: responseDealer, message: messages.SUCCESS.DealerCreated },
      res
    );
  } catch (error) {
    return ApiResponse.internalServerError(res, error.message);
  }
};

const getAllDealers = async (req, res) => {
  try {
    const dealers = await dealerRepo.getAllDealers();

    // Map _id to dealerId for all dealers
    const responseDealers = dealers.map(d => ({
      dealerId: d._id,
      name: d.name,
      email: d.email,
    }));

    return ApiResponse.Ok({ dealers: responseDealers }, res);
  } catch (error) {
    return ApiResponse.internalServerError(res, error.message);
  }
};

module.exports = { createDealer, getAllDealers };
