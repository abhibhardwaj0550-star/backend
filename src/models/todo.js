import mongoose from "mongoose";

const TodoSchema =new mongoose.Schema(
  {
    taskname: {
      type:String,
      required: true
    },
   
  },
  {timestamps: true}
);

const Todo = mongoose.model ("todo", TodoSchema);

export default Todo;
