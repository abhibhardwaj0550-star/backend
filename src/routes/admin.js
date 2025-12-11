import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

import {
  getUsersForAdmin,
  updateUserRole,
  deleteUser,
  getAllFeedbacksForAdmin,
  deleteFeedback,
  getAdminStats,
} from "../controllers/admin.js";

const router = express.Router();

// All admin routes protected + admin check
router.use(protect, admin);

router.get("/users", getUsersForAdmin);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

router.get("/feedbacks", getAllFeedbacksForAdmin);
router.delete("/feedbacks/:id", deleteFeedback);

router.get("/stats", getAdminStats);

export default router;
