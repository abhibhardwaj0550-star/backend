// 📁 routes/todo.js

import express from "express";
import {
  Addtodo,
  EditTodo,
  GetList,
  DeleteTodo,
} from "../controllers/todo.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All these need req.user → protect them
router.post("/add-todo", protect, Addtodo);
router.get("/get-todo-list", protect, GetList);
router.put("/edit-todo/:id", protect, EditTodo);
router.delete("/delete-todo/:id", protect, DeleteTodo);

export default router;
