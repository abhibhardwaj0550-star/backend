import Feedback from "../models/Feedback.js";

// Existing AddFeedback function (unchanged)
export const AddFeedback = async (req, res) => {
  try {
    const { suggestion, rating } = req.body;
    console.log(req.body, "feedback body ====");

    if (!suggestion || !rating) {
      return res.status(400).json({ message: "Suggestion and rating are required" });
    }

    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const existingFeedback = await Feedback.findOne({ suggestion, userId });
    if (existingFeedback) {
      return res
        .status(400)
        .json({ message: "You already submitted this suggestion" });
    }

    const feedback = await Feedback.create({
      suggestion,
      rating,
      userId,
    });

    res.status(201).json(feedback);
  } catch (error) {
    console.error("AddFeedback error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ New function to check if user has already submitted feedback
export const GetUserFeedback = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Not authorized" });

    const feedback = await Feedback.findOne({ userId });

    // If feedback exists, return suggestion and rating; else return false
    res.json({
      hasFeedback: !!feedback,
      suggestion: feedback ? feedback.suggestion : null,
      rating: feedback ? feedback.rating : null,
    });
  } catch (error) {
    console.error("GetUserFeedback error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

