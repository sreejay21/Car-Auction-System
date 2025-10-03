const express = require("express");
const router = express.Router();
const { createDealer, getAllDealers } = require("../controllers/dealerController");
const { createDealerValidation } = require("../validators/dealerValidator");
const { validationResult } = require("express-validator");
const ApiResponse = require("../utils/apiResponse");
const authMiddleware = require("../middlewares/authMiddleware");

// Middleware to handle validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return ApiResponse.getValidationError(res, errors.array());
  next();
};

// Create Dealer
router.post("/createDealer", authMiddleware, createDealerValidation, validate, createDealer);

// Get All Dealers
router.get("/", authMiddleware, getAllDealers);

module.exports = router;
