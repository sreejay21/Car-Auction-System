const { createAuction, startAuction, placeBid, getWinnerBid } = require("../src/controllers/auctionController");
const repo = require("../src/repositories/auctionRepository");
const { validationResult } = require("express-validator");

jest.mock("../src/repositories/auctionRepository");
jest.mock("express-validator");

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

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          responsecode: 400,
          error: [{ msg: "Invalid" }],
          status: false,
        })
      );
    });

    it("should create auction successfully", async () => {
      validationResult.mockReturnValue({ isEmpty: () => true });

      const auction = {
        _id: "123",
        car: "car1",
        startingPrice: 1000,
        startTime: new Date(),
        endTime: new Date(),
        status: "pending",
      };
      repo.createAuction.mockResolvedValue(auction);

      const req = { body: { car: "car1", startingPrice: 1000 } };
      await createAuction(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          responsecode: 201,
          result: expect.objectContaining({
            auction: expect.objectContaining({
              auctionId: "123",
              carId: "car1",
            }),
            message: "Auction created successfully",
          }),
          status: true,
        })
      );
    });

    it("should return 500 if repository throws error", async () => {
      validationResult.mockReturnValue({ isEmpty: () => true });
      repo.createAuction.mockRejectedValue(new Error("DB Error"));

      const req = { body: { car: "car1", startingPrice: 1000 } };
      await createAuction(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          responsecode: 500,
          error: "DB Error",
          status: false,
        })
      );
    });
  });

  // -------------------- START AUCTION --------------------
  describe("startAuction", () => {
    it("should start auction successfully", async () => {
      const auction = {
        _id: "123",
        car: "car1",
        startingPrice: 1000,
        startTime: new Date(),
        endTime: new Date(),
        status: "started",
      };
      repo.startAuction.mockResolvedValue(auction);

      const req = { params: { auctionId: "123" } };
      await startAuction(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          responsecode: 200,
          result: expect.objectContaining({
            auction: expect.objectContaining({
              auctionId: "123",
              carId: "car1",
            }),
            message: "Auction started successfully",
          }),
          status: true,
        })
      );
    });

    it("should return 404 if auction not found", async () => {
      repo.startAuction.mockResolvedValue(null);

      const req = { params: { auctionId: "123" } };
      await startAuction(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          responsecode: 404,
          error: expect.any(String),
          status: false,
        })
      );
    });
  });

  // -------------------- PLACE BID --------------------
  describe("placeBid", () => {
    it("should return validation error if request is invalid", async () => {
      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: "Invalid" }],
      });

      const req = { body: {} };
      await placeBid(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          responsecode: 400,
          error: [{ msg: "Invalid" }],
          status: false,
        })
      );
    });

    it("should place bid successfully", async () => {
      validationResult.mockReturnValue({ isEmpty: () => true });

      const bid = {
        _id: "bid1",
        auction: "123",
        dealer: "dealer1",
        bidAmount: 2000,
        previousBid: 1000,
        createdAt: new Date(),
      };
      repo.placeBid.mockResolvedValue(bid);

      const req = {
        body: { auctionId: "123", dealerId: "dealer1", bidAmount: 2000 },
      };
      await placeBid(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          responsecode: 201,
          result: expect.objectContaining({
            bid: expect.objectContaining({
              bidId: "bid1",
              auctionId: "123",
              dealerId: "dealer1",
            }),
            message: "Bid placed successfully",
          }),
          status: true,
        })
      );
    });
  });

  // -------------------- GET WINNER BID --------------------
  describe("getWinnerBid", () => {
    it("should return winner bid successfully and mark auction ended", async () => {
      const winner = {
        _id: "bid1",
        auction: "123",
        dealer: { _id: "dealer1", name: "John", email: "john@example.com" },
        bidAmount: 2000,
        previousBid: 1000,
        createdAt: new Date(),
      };

      // mock repo calls
      repo.getWinnerBid.mockResolvedValue(winner);
      repo.endAuction = jest.fn().mockResolvedValue({
        _id: "123",
        status: "ended",
      });

      const req = { params: { auctionId: "123" } };
      await getWinnerBid(req, res);

      expect(repo.getWinnerBid).toHaveBeenCalledWith("123");
      expect(repo.endAuction).toHaveBeenCalledWith("123");

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          responsecode: 200,
          result: expect.objectContaining({
            auctionId: "123",
            bidId: "bid1",
            dealerId: "dealer1",
            dealerName: "John",
            dealerEmail: "john@example.com",
            bidAmount: 2000,
            previousBid: 1000,
            auctionStatus: "ended",
          }),
          status: true,
        })
      );
    });

    it("should return 404 if no bids found", async () => {
      repo.getWinnerBid.mockResolvedValue(null);

      const req = { params: { auctionId: "123" } };
      await getWinnerBid(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          responsecode: 404,
          error: expect.any(String),
          status: false,
        })
      );
    });
  });
});
