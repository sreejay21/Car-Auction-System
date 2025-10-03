const request = require("supertest");
const app = require("../src/app");
const carRepo = require("../src/repositories/carRepository");
const jwt = require("jsonwebtoken");

jest.mock("../src/repositories/carRepository");

describe("Car Controller - Create Car", () => {
  let token;

  beforeAll(() => {
    token = jwt.sign(
      { username: "Admin" },
      process.env.JWT_SECRET || "testsecret123",
      { expiresIn: "1h" }
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a car successfully", async () => {
    const mockCar = {
      _id: "6510ab7f8e3d0c1b12a4a123",
      make: "Tesla",
      model: "Model S",
      year: 2023,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    carRepo.createCar.mockResolvedValue(mockCar);

    const res = await request(app)
      .post("/api/v1/cars/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        make: "Tesla",
        model: "Model S",
        year: 2023,
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe(true);
    expect(res.body.result.car).toHaveProperty("carId", mockCar._id);
    expect(res.body.result.car.make).toBe("Tesla");
  });

  it("should return validation error if fields are missing", async () => {
    const res = await request(app)
      .post("/api/v1/cars/create")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.error).toBeDefined();
  });

  it("should return validation error for invalid year", async () => {
    const res = await request(app)
      .post("/api/v1/cars/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        make: "Tesla",
        model: "Model X",
        year: "invalid-year",
      });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.error).toBeDefined();
  });

  it("should return 500 if repo throws error", async () => {
    carRepo.createCar.mockRejectedValue(new Error("Database error"));

    const res = await request(app)
      .post("/api/v1/cars/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        make: "BMW",
        model: "X5",
        year: 2022,
      });

    expect(res.status).toBe(500);
    expect(res.body.status).toBe(false);
    expect(res.body.error).toBe("Database error");
  });
});
