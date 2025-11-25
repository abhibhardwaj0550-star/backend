import express from "express";
import {
  Addtodo,
  EditTodo,
  GetList,
  DeleteTodo,
} from "../controllers/todo.js";

const router = express.Router();

router.post("/add-todo", Addtodo);
router.get("/get-todo-list", GetList);
router.put("/edit-todo/:id", EditTodo);
router.delete("/delete-todo/:id", DeleteTodo);

export default router;
