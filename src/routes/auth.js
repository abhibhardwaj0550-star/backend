import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  googleLogin
} from "../controllers/auth.js";

const router = express.Router();
router.post("/google-login", googleLogin);

router.post("/signup", registerUser);

router.post("/login", loginUser);

router.get("/users", getAllUsers);

export default router;
