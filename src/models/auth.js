import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    loginMethod: {
      type: String,
      enum: ["google", "email"],
      default: "email",
    },
    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["user", "admin"], // allowed roles
      default: "user",         // default role
    },
    resetToken: String,
    resetTokenExpiry: Date
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

export default User;
