import dotenv from "dotenv";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User from "../models/auth.js"; // adjust path

dotenv.config();

const start = async () => {
  try {
    // 1️⃣ Connect to DB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");

    // 2️⃣ Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    // 3️⃣ Create admin
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const admin = await User.create({
      name: "Super Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created:", admin.email);
    process.exit();
  } catch (error) {
    console.log("Seeder Error:", error.message);
    process.exit(1);
  }
};

start();
