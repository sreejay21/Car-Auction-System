const { body } = require("express-validator");

const createCarValidation = [
  body("make").notEmpty().withMessage("Car make is required"),
  body("model").notEmpty().withMessage("Car model is required"),
  body("year").isInt({ min: 1900 }).withMessage("Year must be a valid number"),
];

module.exports = { createCarValidation };
