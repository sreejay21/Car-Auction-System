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

    // Mock environment variables
    process.env.JWT_SECRET = "testsecret";
    process.env.ADMIN_USERNAME = "Admin";
    process.env.ADMIN_PASSWORD = "Admin";
  });

  it("should return token for valid credentials", () => {
    const req = { body: { username: process.env.ADMIN_USERNAME.username, password: process.env.ADMIN_PASSWORD.password } };
    const fakeToken = "fake.jwt.token";

    jwt.sign.mockReturnValue(fakeToken);
    ApiResponse.Ok.mockImplementation((data, res) => res.status(200).json(data));

    login(req, res);

    expect(jwt.sign).toHaveBeenCalledWith(
      { username: process.env.ADMIN_USERNAME.username },
      "testsecret",
      { expiresIn: "1h" }
    );
    expect(ApiResponse.Ok).toHaveBeenCalledWith({ token: fakeToken }, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ token: fakeToken });
  });

  it("should return unauthorized for invalid username", () => {
    const req = { body: { username: "Wrong", password: process.env.ADMIN_PASSWORD.password } };
    ApiResponse.unAuthorized.mockImplementation((res, message) => res.status(401).json({ message }));

    login(req, res);

    expect(ApiResponse.unAuthorized).toHaveBeenCalledWith(res, messages.ERRORS.InvalidCredentials);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: messages.ERRORS.InvalidCredentials });
  });

  it("should return unauthorized for invalid password", () => {
    const req = { body: { username: process.env.ADMIN_USERNAME.username, password: "Wrong" } };
    ApiResponse.unAuthorized.mockImplementation((res, message) => res.status(401).json({ message }));

    login(req, res);

    expect(ApiResponse.unAuthorized).toHaveBeenCalledWith(res, messages.ERRORS.InvalidCredentials);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: messages.ERRORS.InvalidCredentials });
  });
});

