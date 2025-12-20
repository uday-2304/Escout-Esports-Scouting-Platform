import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyToken = asyncHandler((req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Access denied. No token provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // 🔴 FORCE _id to exist
    if (!decoded._id) {
      throw new ApiError(401, "Invalid token payload");
    }

    req.user = {
      _id: decoded._id.toString(),
    };

    next();
  } catch (error) {
    throw new ApiError(401, "Invalid or expired token");
  }
});
