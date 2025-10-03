const express = require("express");
const { login } = require("../controllers/authController");
const { loginValidation } = require("../validators/authValidator");
const { validationResult } = require("express-validator");
const ApiResponse = require("../utils/apiResponse");

const router = express.Router();

router.post("/token", loginValidation, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return ApiResponse.getValidationError(res, errors.array());
  next();
}, login);

module.exports = router;
