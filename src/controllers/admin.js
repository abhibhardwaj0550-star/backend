import User from "../models/auth.js";
import Feedback from "../models/Feedback.js";
import admin from "../firebase.js"; 
// GET all users (admin only)
export const getUsersForAdmin = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ message: "Users fetched", users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const { id } = req.params;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = role;
    await user.save();

    res.json({ message: "Role updated", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await User.findByIdAndDelete(id);
    await Feedback.deleteMany({ userId: id });

    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all feedbacks (admin)
export const getAllFeedbacksForAdmin = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("userId", "name email"); // ✅ populate name & email from user

    console.log("Feedbacks fetched:", feedbacks);

    res.status(200).json({ feedbacks });
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ message: "Server Error" });
  }
};




// Delete feedback
export const deleteFeedback = async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: "Feedback deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Stats
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalFeedbacks = await Feedback.countDocuments();

    const avgRatingResult = await Feedback.aggregate([
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]);

    const avgRating = avgRatingResult.length
      ? avgRatingResult[0].avgRating.toFixed(2)
      : null;

    res.json({ totalUsers, totalAdmins, totalFeedbacks, avgRating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
