const { createAuction, startAuction, placeBid, getWinnerBid } = require("../src/controllers/auctionController");
const AuctionRepository = require("../src/repositories/auctionRepository");
const DealerRepository = require("../src/repositories/dealerRepository");
const carRepository = require("../src/repositories/carRepository");
const { validationResult } = require("express-validator");
const ApiResponse = require("../src/utils/apiResponse");
const messages = require("../src/constants/messages");

jest.mock("../src/repositories/auctionRepository");
jest.mock("../src/repositories/dealerRepository");
jest.mock("../src/repositories/carRepository");
jest.mock("express-validator");
jest.mock("../src/utils/apiResponse");

describe("Auction Controller", () => {
  let res;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  // -------------------- CREATE AUCTION --------------------
  describe("createAuction", () => {
    it("should return validation error if request is invalid", async () => {
      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: "Invalid" }],
      });

      const req = { body: {} };
      await createAuction(req, res);

      expect(ApiResponse.getValidationError).toHaveBeenCalledWith(res, [{ msg: "Invalid" }]);
    });

    it("should return 404 if car not found", async () => {
      validationResult.mockReturnValue({ isEmpty: () => true });
      AuctionRepository.createAuction.mockResolvedValue({ _id: "123", car: "car1" });
      carRepository.getCarById.mockResolvedValue(null);

      const req = { body: { car: "car1", startingPrice: 1000 } };
      await createAuction(req, res);

      expect(ApiResponse.notFound).toHaveBeenCalledWith(res, messages.ERRORS.CarNotFound);
    });

    it("should create auction successfully", async () => {
      validationResult.mockReturnValue({ isEmpty: () => true });
      const auction = { _id: "123", car: "car1", startingPrice: 1000, startTime: new Date(), endTime: new Date(), status: "pending" };
      AuctionRepository.createAuction.mockResolvedValue(auction);
      carRepository.getCarById.mockResolvedValue({ _id: "car1" });

      const req = { body: { car: "car1", startingPrice: 1000 } };
      await createAuction(req, res);

      expect(ApiResponse.successCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          auction: expect.objectContaining({ auctionId: "123", carId: "car1" }),
          message: messages.SUCCESS.AuctionCreated
        }),
        res
      );
    });

    it("should handle internal server error", async () => {
      validationResult.mockReturnValue({ isEmpty: () => true });
      AuctionRepository.createAuction.mockRejectedValue(new Error("DB Error"));

      const req = { body: { car: "car1", startingPrice: 1000 } };
      await createAuction(req, res);

      expect(ApiResponse.internalServerError).toHaveBeenCalledWith(res, "DB Error");
    });
  });

  // -------------------- START AUCTION --------------------
  describe("startAuction", () => {
    it("should start auction successfully", async () => {
      const auction = { _id: "123", car: "car1", startingPrice: 1000, startTime: new Date(), endTime: new Date(), status: "started" };
      AuctionRepository.startAuction.mockResolvedValue(auction);

      const req = { params: { auctionId: "123" } };
      await startAuction(req, res);

      expect(ApiResponse.Ok).toHaveBeenCalledWith(
        expect.objectContaining({
          auction: expect.objectContaining({ auctionId: "123", carId: "car1" }),
          message: messages.SUCCESS.AuctionStarted
        }),
        res
      );
    });

    it("should return 404 if auction not found", async () => {
      AuctionRepository.startAuction.mockResolvedValue(null);

      const req = { params: { auctionId: "123" } };
      await startAuction(req, res);

      expect(ApiResponse.notFound).toHaveBeenCalledWith(res, messages.ERRORS.AuctionNotFound);
    });

    it("should handle internal server error", async () => {
      AuctionRepository.startAuction.mockRejectedValue(new Error("DB Error"));

      const req = { params: { auctionId: "123" } };
      await startAuction(req, res);

      expect(ApiResponse.internalServerError).toHaveBeenCalledWith(res, "DB Error");
    });
  });

  // -------------------- PLACE BID --------------------
  describe("placeBid", () => {
    it("should return validation error if request is invalid", async () => {
      validationResult.mockReturnValue({ isEmpty: () => false, array: () => [{ msg: "Invalid" }] });

      const req = { body: {} };
      await placeBid(req, res);

      expect(ApiResponse.getValidationError).toHaveBeenCalledWith(res, [{ msg: "Invalid" }]);
    });

    it("should return 404 if auction or dealer not found", async () => {
      validationResult.mockReturnValue({ isEmpty: () => true });
      AuctionRepository.getAuctionById.mockResolvedValue(null);

      const req = { body: { auctionId: "123", dealerId: "dealer1", bidAmount: 1000 } };
      await placeBid(req, res);
      expect(ApiResponse.notFound).toHaveBeenCalledWith(res, messages.ERRORS.AuctionNotFound);

      AuctionRepository.getAuctionById.mockResolvedValue({ _id: "123" });
      DealerRepository.getDealerById.mockResolvedValue(null);

      await placeBid(req, res);
      expect(ApiResponse.notFound).toHaveBeenCalledWith(res, messages.ERRORS.DealerNotFound);
    });

    it("should place bid successfully", async () => {
      validationResult.mockReturnValue({ isEmpty: () => true });
      AuctionRepository.getAuctionById.mockResolvedValue({ _id: "123" });
      DealerRepository.getDealerById.mockResolvedValue({ _id: "dealer1" });
      const bid = { _id: "bid1", auction: "123", dealer: "dealer1", bidAmount: 2000, previousBid: 1000, createdAt: new Date() };
      AuctionRepository.placeBid.mockResolvedValue(bid);

      const req = { body: { auctionId: "123", dealerId: "dealer1", bidAmount: 2000 } };
      await placeBid(req, res);

      expect(ApiResponse.successCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          bid: expect.objectContaining({ bidId: "bid1", auctionId: "123", dealerId: "dealer1" }),
          message: messages.SUCCESS.BidPlaced
        }),
        res
      );
    });

    it("should handle internal server error", async () => {
      validationResult.mockReturnValue({ isEmpty: () => true });
      AuctionRepository.getAuctionById.mockRejectedValue(new Error("DB Error"));

      const req = { body: { auctionId: "123", dealerId: "dealer1", bidAmount: 2000 } };
      await placeBid(req, res);

      expect(ApiResponse.internalServerError).toHaveBeenCalledWith(res, "DB Error");
    });
  });

  // -------------------- GET WINNER BID --------------------
  describe("getWinnerBid", () => {
    it("should return winner bid and end auction successfully", async () => {
      const winner = { _id: "bid1", auction: "123", dealer: { _id: "dealer1", name: "John", email: "john@example.com" }, bidAmount: 2000, previousBid: 1000, createdAt: new Date() };
      AuctionRepository.getWinnerBid.mockResolvedValue(winner);
      AuctionRepository.endAuction.mockResolvedValue({ _id: "123", status: "ended" });

      const req = { params: { auctionId: "123" } };
      await getWinnerBid(req, res);

      expect(ApiResponse.Ok).toHaveBeenCalledWith(
        expect.objectContaining({
          bidId: "bid1",
          auctionId: "123",
          dealerId: "dealer1",
          dealerName: "John",
          dealerEmail: "john@example.com",
          bidAmount: 2000,
          previousBid: 1000,
          auctionStatus: "ended"
        }),
        res
      );
    });

    it("should return 404 if no winner bid found", async () => {
      AuctionRepository.getWinnerBid.mockResolvedValue(null);

      const req = { params: { auctionId: "123" } };
      await getWinnerBid(req, res);

      expect(ApiResponse.notFound).toHaveBeenCalledWith(res, messages.ERRORS.NoBids);
    });

    it("should return 404 if auction cannot be ended", async () => {
      const winner = { _id: "bid1", auction: "123", dealer: { _id: "dealer1", name: "John", email: "john@example.com" }, bidAmount: 2000 };
      AuctionRepository.getWinnerBid.mockResolvedValue(winner);
      AuctionRepository.endAuction.mockResolvedValue(null);

      const req = { params: { auctionId: "123" } };
      await getWinnerBid(req, res);

      expect(ApiResponse.notFound).toHaveBeenCalledWith(res, messages.ERRORS.AuctionNotFound);
    });

    it("should handle internal server error", async () => {
      AuctionRepository.getWinnerBid.mockRejectedValue(new Error("DB Error"));

      const req = { params: { auctionId: "123" } };
      await getWinnerBid(req, res);

      expect(ApiResponse.internalServerError).toHaveBeenCalledWith(res, "DB Error");
    });
  });
});
