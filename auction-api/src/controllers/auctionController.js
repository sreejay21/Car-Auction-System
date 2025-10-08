const { validationResult } = require("express-validator");
const AuctionRepository = require("../repositories/auctionRepository");
const DealerRepository = require("../repositories/dealerRepository");
const carRepository = require("../repositories/carRepository");
const ApiResponse = require("../utils/apiResponse");
const messages = require("../constants/messages");

const createAuction = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return ApiResponse.getValidationError(res, errors.array());

    const auction = await AuctionRepository.createAuction(req.body);
    const car = await carRepository.getCarById(req.body.car);
    if (!car) return ApiResponse.notFound(res, messages.ERRORS.CarNotFound);

    const responseAuction = {
      auctionId: auction._id,
      carId: auction.car,
      startingPrice: auction.startingPrice,
      startTime: auction.startTime,
      endTime: auction.endTime,
      status: auction.status,
    };

    return ApiResponse.successCreate(
      { auction: responseAuction, message: messages.SUCCESS.AuctionCreated },
      res
    );
  } catch (error) {
    return ApiResponse.internalServerError(res, error.message);
  }
};

const startAuction = async (req, res) => {
  try {
    const auction = await AuctionRepository.startAuction(req.params.auctionId);
    if (!auction) return ApiResponse.notFound(res, messages.ERRORS.AuctionNotFound);

    const responseAuction = {
      auctionId: auction._id,
      carId: auction.car,
      startingPrice: auction.startingPrice,
      startTime: auction.startTime,
      endTime: auction.endTime,
      status: auction.status,
    };

    return ApiResponse.Ok({ auction: responseAuction, message: messages.SUCCESS.AuctionStarted }, res);
  } catch (error) {
    return ApiResponse.internalServerError(res, error.message);
  }
};

const placeBid = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return ApiResponse.getValidationError(res, errors.array());

    const { auctionId, dealerId, bidAmount } = req.body;
    const auction = await AuctionRepository.getAuctionById(auctionId);
    if (!auction) return ApiResponse.notFound(res, messages.ERRORS.AuctionNotFound);
    
    const dealer = await DealerRepository.getDealerById(dealerId);
    if (!dealer) return ApiResponse.notFound(res, messages.ERRORS.DealerNotFound);

    const bid = await AuctionRepository.placeBid(auctionId, { dealerId, bidAmount });

    const responseBid = {
      bidId: bid._id,
      auctionId: bid.auction,
      dealerId: bid.dealer,
      bidAmount: bid.bidAmount,
      previousBid: bid.previousBid,
      createdAt: bid.createdAt,
    };

    return ApiResponse.successCreate(
      { bid: responseBid, message: messages.SUCCESS.BidPlaced },
      res
    );
  } catch (error) {
    return ApiResponse.internalServerError(res, error.message);
  }
};

const getWinnerBid = async (req, res) => {
  try {
    const winner = await AuctionRepository.getWinnerBid(req.params.auctionId);
    if (!winner) return ApiResponse.notFound(res, messages.ERRORS.NoBids);

    const updatedAuction = await AuctionRepository.endAuction(req.params.auctionId);
    if (!updatedAuction)
      return ApiResponse.notFound(res, messages.ERRORS.AuctionNotFound);

    const responseWinner = {
      bidId: winner._id,
      auctionId: winner.auction,
      dealerId: winner.dealer._id,
      dealerName: winner.dealer.name,
      dealerEmail: winner.dealer.email,
      bidAmount: winner.bidAmount,
      previousBid: winner.previousBid,
      createdAt: winner.createdAt,
      auctionStatus: updatedAuction.status,
    };

    return ApiResponse.Ok(responseWinner, res);
  } catch (error) {
    return ApiResponse.internalServerError(res, error.message);
  }
};

module.exports = { createAuction, startAuction, placeBid, getWinnerBid };
