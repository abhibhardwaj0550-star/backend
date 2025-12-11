// 📁 controllers/todo.js

import Todo from "../models/todo.js";

// Create todo
export const Addtodo = async (req, res) => {
  try {
    const { taskname, iscompleted = false } = req.body;
    console.log(req.body, "res====");

    if (!taskname) {
      return res.status(400).json({ message: "Task Name is required" });
    }

    // ✅ Get user from protect middleware
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Optional: prevent duplicate task names per user
    const existingtask = await Todo.findOne({ taskname, userId });
    if (existingtask) {
      return res.status(400).json({ message: "Task Name already exists" });
    }

    const todo = await Todo.create({
      taskname,
      iscompleted,
      userId, // ✅ required by schema
    });

    res.status(201).json(todo);
  } catch (error) {
    console.error("Addtodo error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update todo (edit text and/or completed status)
export const EditTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { taskname, iscompleted } = req.body;

    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (!taskname && typeof iscompleted === "undefined") {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const updateData = {};
    if (taskname) updateData.taskname = taskname;
    if (typeof iscompleted !== "undefined") updateData.iscompleted = iscompleted;

    // ✅ Ensure user can only edit their own todo
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json(updatedTodo);
  } catch (error) {
    console.error("EditTodo error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get list
export const GetList = async (req, res) => {
  try {
    // req.user is coming from protect middleware (decoded from token)
    const userId = req.user._id;

    // ✅ use userId field from schema
    const todos = await Todo.find({ userId }).sort({ createdAt: -1 });
    console.log(todos, "===sdsd");

    res.status(200).json({
      message: "Todos fetched successfully",
      users: todos, // keeping 'users' because your frontend expects res.data.users
    });
  } catch (error) {
    console.error("Get all todos error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete todo
export const DeleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // ✅ Only delete if it belongs to this user
    const deleted = await Todo.findOneAndDelete({ _id: id, userId });

    if (!deleted) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({
      message: "Todo deleted successfully",
    });
  } catch (error) {
    console.error("DeleteTodo error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
