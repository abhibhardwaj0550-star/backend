import Todo from "../models/todo.js";

// Create todo
export const Addtodo = async (req, res) => {
  try {
    const { taskname, iscompleted = false } = req.body;
    console.log(req.body, "res====");

    if (!taskname) {
      return res.status(400).json({ message: "Task Name is required" });
    }

    const existingtask = await Todo.findOne({ taskname });
    if (existingtask) {
      return res.status(400).json({ message: "Task Name already exists" });
    }

    const todo = await Todo.create({
      taskname,
      iscompleted,
    });

    // ✅ Return plain todo object
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

    if (!taskname && typeof iscompleted === "undefined") {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const updateData = {};
    if (taskname) updateData.taskname = taskname;
    if (typeof iscompleted !== "undefined") updateData.iscompleted = iscompleted;

    const updatedTodo = await Todo.findByIdAndUpdate(id, updateData, {
      new: true,
    });

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
    const todos = await Todo.find();

    res.status(200).json({
      message: "Todos fetched successfully",
      users: todos, // keeping 'users' just to match your frontend map
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

    const deleted = await Todo.findByIdAndDelete(id);

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
