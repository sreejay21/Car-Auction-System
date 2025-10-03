const { body } = require("express-validator");

const createDealerValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
];

module.exports = { createDealerValidation };
