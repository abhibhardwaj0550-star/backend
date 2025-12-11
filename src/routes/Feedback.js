import express from "express";
import { AddFeedback, GetUserFeedback } from "../controllers/Feedback.js";
import { protect } from "../middleware/authMiddleware.js"; // Your auth middleware

const router = express.Router();

// Existing route
router.post("/add-feedback", protect, AddFeedback);

// ✅ New route to check feedback status
router.get("/user-feedback", protect, GetUserFeedback);

export default router;
