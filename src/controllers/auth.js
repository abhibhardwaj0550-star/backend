import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/auth.js";
import admin from "../firebase.js";   

export const googleLogin = async (req, res) => {
  const { idToken } = req.body;
  console.time("GoogleLoginProcess");

  try {
    console.time("FirebaseVerifyToken");
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.timeEnd("FirebaseVerifyToken");

    const { uid, email, name } = decodedToken;

    console.time("MongoFindUser_Google");
    let user = await User.findOne({ email });
    console.timeEnd("MongoFindUser_Google");

    if (!user) {
      console.time("MongoCreateUser_Google");
      user = await User.create({
        name,
        email,
        password: Math.random().toString(36).slice(-8), 
        role: "user",
        loginMethod: "google",
      });
      console.timeEnd("MongoCreateUser_Google");
    }
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    console.timeEnd("GoogleLoginProcess");
    res.json({
      message: "Google login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.timeEnd("GoogleLoginProcess");
    console.error("Google login error:", error);
    res
      .status(401)
      .json({ message: "Invalid Firebase ID token", error: error.message });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body, "res====")

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.time("LoginProcess");

    if (!email || !password) {
      console.timeEnd("LoginProcess");
      return res.status(400).json({ message: "Email and password are required" });
    }

    console.time("MongoFindUser_Login");
    const user = await User.findOne({ email });
    console.timeEnd("MongoFindUser_Login");

    if (!user) {
      console.timeEnd("LoginProcess");
      return res.status(401).json({ message: "Email not Found" });
    }

    console.time("BcryptCompare");
    const isMatch = await bcrypt.compare(password, user.password);
    console.timeEnd("BcryptCompare");

    if (!isMatch) {
      console.timeEnd("LoginProcess");
      return res.status(401).json({ message: "Password not Matched" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    console.timeEnd("LoginProcess");
    res.json({
      message: "Login successful",
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.timeEnd("LoginProcess");
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      message: "Users Data",
      users,
    });

  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
