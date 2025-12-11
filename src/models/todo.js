// 📁 models/todo.js

import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema(
  {
    taskname: {
      type: String,
      required: true,
    },
    iscompleted: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // name of the User model
      required: true,
    },
  },
  { timestamps: true }
);

// You used "todo" as the collection/model name earlier, keeping it:
const Todo = mongoose.model("todo", TodoSchema);

export default Todo;
