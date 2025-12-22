// 📁 index.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authrouter from "./routes/auth.js";
import todoRouter from "./routes/todo.js";
import feedbackRouter from "./routes/Feedback.js";
import adminRouter from "./routes/admin.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use( 
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174","https://todo-app-nu-lovat.vercel.app",
      process.env.FRONTEND_URL],
    credentials: true,
  })
);
console.log(process.env.MONGO_URI,"mongodb=========")
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err.message));

app.use("/auth", authrouter);
app.use("/", todoRouter);
app.use("/feedback", feedbackRouter);
app.use("/admin", adminRouter);

app.get("/", (req, res) => {
  res.send("API is working");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
