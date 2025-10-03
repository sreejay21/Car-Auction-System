const express = require("express");
const router = express.Router();
const { createCar } = require("../controllers/carController");
const { createCarValidation } = require("../validators/carValidator");
const { validationResult } = require("express-validator");
const ApiResponse = require("../utils/apiResponse");
const authMiddleware = require("../middlewares/authMiddleware");

router.post(
    "/create",
    authMiddleware,       
    createCarValidation,     
    (req, res, next) => {     
        const errors = validationResult(req);
        if (!errors.isEmpty()) return ApiResponse.getValidationError(res, errors.array());
        next();
    },
    createCar
);

module.exports = router;
