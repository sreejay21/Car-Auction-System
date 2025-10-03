const jwt = require("jsonwebtoken");
const ApiResponse = require("../utils/apiResponse");
const messages = require("../constants/messages");

const ADMIN_USER = { username: "Admin", password: "Admin" };

const login = (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return ApiResponse.Ok({ token }, res);
  }

  return ApiResponse.unAuthorized(res, messages.ERRORS.InvalidCredentials);
};

module.exports = { login };
