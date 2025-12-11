// 📁 models/Feedback.js
import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
  {
    suggestion: {
      type: String,
      required: true,
    },
    rating: {
      type: Number, 
      required: true,
      min: 1,
      max: 5,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", 
      required: true,
    },
  },
  { timestamps: true }
);

const Feedback = mongoose.model("feedback", FeedbackSchema);

export default Feedback;
