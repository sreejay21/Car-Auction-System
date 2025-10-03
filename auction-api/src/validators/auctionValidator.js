const { body, param } = require("express-validator");

const createAuctionValidation = [
  body("car").notEmpty().withMessage("Car ID is required"),
  body("startingPrice").isNumeric().withMessage("Starting price must be a number"),
  body("startTime").isISO8601().toDate().withMessage("Start time must be a valid date"),
  body("endTime").isISO8601().toDate().withMessage("End time must be a valid date"),
];

const startAuctionValidation = [
  param("auctionId").notEmpty().withMessage("Auction ID is required"),
];

const placeBidValidation = [
  body("auctionId").notEmpty().withMessage("Auction ID is required"),
  body("dealerId").notEmpty().withMessage("Dealer ID is required"),
  body("bidAmount").isNumeric().withMessage("Bid amount must be a number"),
];

const getWinnerValidation = [
  param("auctionId").notEmpty().withMessage("Auction ID is required"),
];

module.exports = {
  createAuctionValidation,
  startAuctionValidation,
  placeBidValidation,
  getWinnerValidation,
};
