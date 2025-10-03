const { createDealer, getAllDealers } = require("../src/controllers/dealerController");
const dealerRepo = require("../src/repositories/dealerRepository");
const { validationResult } = require("express-validator");

jest.mock("../src/repositories/dealerRepository");
jest.mock("express-validator");

describe("Dealer Controller", () => {
  let res;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe("createDealer", () => {
    it("should return validation error if request is invalid", async () => {
      validationResult.mockReturnValue({ isEmpty: () => false, array: () => [{ msg: "Invalid" }] });

      const req = { body: {} };
      await createDealer(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
        responsecode: 400,
        error: [{ msg: "Invalid" }],
      }));
    });

    it("should create dealer successfully", async () => {
      validationResult.mockReturnValue({ isEmpty: () => true });

      const dealer = { _id: "d1", name: "John Doe", email: "john@example.com" };
      dealerRepo.createDealer.mockResolvedValue(dealer);

      const req = { body: { name: "John Doe", email: "john@example.com" } };
      await createDealer(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
        responsecode: 201,
        result: expect.objectContaining({
          dealer: expect.objectContaining({ dealerId: "d1", name: "John Doe", email: "john@example.com" }),
          message: "Dealer created successfully",
        }),
        status: true
      }));
    });

    it("should return 500 if repository throws error", async () => {
      validationResult.mockReturnValue({ isEmpty: () => true });
      dealerRepo.createDealer.mockRejectedValue(new Error("DB Error"));

      const req = { body: { name: "John Doe", email: "john@example.com" } };
      await createDealer(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
        responsecode: 500,
        error: "DB Error",
      }));
    });
  });

  describe("getAllDealers", () => {
    it("should return all dealers successfully", async () => {
      const dealers = [
        { _id: "d1", name: "John Doe", email: "john@example.com" },
        { _id: "d2", name: "Jane Smith", email: "jane@example.com" },
      ];
      dealerRepo.getAllDealers.mockResolvedValue(dealers);

      const req = {};
      await getAllDealers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
        responsecode: 200,
        result: expect.objectContaining({
          dealers: [
            { dealerId: "d1", name: "John Doe", email: "john@example.com" },
            { dealerId: "d2", name: "Jane Smith", email: "jane@example.com" },
          ],
        }),
        status: true
      }));
    });

    it("should return 500 if repository throws error", async () => {
      dealerRepo.getAllDealers.mockRejectedValue(new Error("DB Error"));

      const req = {};
      await getAllDealers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
        responsecode: 500,
        error: "DB Error",
      }));
    });
  });
});
