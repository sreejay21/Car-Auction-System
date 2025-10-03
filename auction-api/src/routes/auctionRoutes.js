const express = require("express");
const router = express.Router();
const { createAuction, startAuction, placeBid, getWinnerBid } = require("../controllers/auctionController");
const {
  createAuctionValidation,
  startAuctionValidation,
  placeBidValidation,
  getWinnerValidation,
} = require("../validators/auctionValidator");
const { validationResult } = require("express-validator");
const ApiResponse = require("../utils/apiResponse");
const authMiddleware = require("../middlewares/authMiddleware"); // <- folder name corrected

// Middleware to handle validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return ApiResponse.getValidationError(res, errors.array());
  next();
};

// Create Auction
router.post("/createAuction", authMiddleware, ...createAuctionValidation, validate, createAuction);

// Start Auction
router.patch("/status/:auctionId", authMiddleware, ...startAuctionValidation, validate, startAuction);

// Place Bid
router.post("/placeBids", authMiddleware, ...placeBidValidation, validate, placeBid);

// Get Winner Bid
router.get("/:auctionId/winner-bid", authMiddleware, ...getWinnerValidation, validate, getWinnerBid);

module.exports = router;
