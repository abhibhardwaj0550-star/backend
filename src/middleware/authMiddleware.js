// 📁 middleware/authMiddleware.js

import jwt from "jsonwebtoken";
import User from "../models/auth.js";

export const protect = async (req, res, next) => {
  let token;

  // Expecting: Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to req (without password)
      req.user = await User.findById(decoded.userId).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      console.error("Token error:", error);
      return res
        .status(401)
        .json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "No token, not authorized" });
  }
};
