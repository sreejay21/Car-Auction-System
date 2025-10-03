const { login } = require("../src/controllers/authController");
const ApiResponse = require("../src/utils/apiResponse");
const jwt = require("jsonwebtoken");
const messages = require("../src/constants/messages");

jest.mock("../src/utils/apiResponse");
jest.mock("jsonwebtoken");

describe("Auth Controller - login", () => {
  let res;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
    process.env.JWT_SECRET = "testsecret"; // Mock JWT secret
  });

  it("should return token for valid credentials", () => {
    const req = { body: { username: "Admin", password: "Admin" } };
    const fakeToken = "fake.jwt.token";

    jwt.sign.mockReturnValue(fakeToken);
    ApiResponse.Ok.mockImplementation((data, res) => res.status(200).json(data));

    login(req, res);

    expect(jwt.sign).toHaveBeenCalledWith({ username: "Admin" }, "testsecret", { expiresIn: "1h" });
    expect(ApiResponse.Ok).toHaveBeenCalledWith({ token: fakeToken }, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ token: fakeToken });
  });

  it("should return unauthorized for invalid username", () => {
    const req = { body: { username: "Wrong", password: "Admin" } };
    ApiResponse.unAuthorized.mockImplementation((res, message) => res.status(401).json({ message }));

    login(req, res);

    expect(ApiResponse.unAuthorized).toHaveBeenCalledWith(res, messages.ERRORS.InvalidCredentials);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: messages.ERRORS.InvalidCredentials });
  });

  it("should return unauthorized for invalid password", () => {
    const req = { body: { username: "Admin", password: "Wrong" } };
    ApiResponse.unAuthorized.mockImplementation((res, message) => res.status(401).json({ message }));

    login(req, res);

    expect(ApiResponse.unAuthorized).toHaveBeenCalledWith(res, messages.ERRORS.InvalidCredentials);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: messages.ERRORS.InvalidCredentials });
  });
});
