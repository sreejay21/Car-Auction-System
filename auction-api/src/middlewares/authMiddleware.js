const jwt = require("jsonwebtoken");
const ApiResponse = require("../utils/apiResponse");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return ApiResponse.unAuthorized(res);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach decoded payload to request
    next();
  } catch (error) {
    return ApiResponse.unAuthorized(res);
  }
};

module.exports = authMiddleware;
