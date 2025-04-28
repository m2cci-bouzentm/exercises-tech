// models/task.js
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
   title: String,
   description: String,
   status: {
      type: String,
      enum: ["todo", "in_progress", "review", "done"],
      default: "todo",
   },

   user_id: String,

   assigned_user_id: String,

   priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
   },
   dueDate: Date,
   createdAt: { type: Date, default: Date.now },
   updatedAt: { type: Date, default: Date.now },
});
const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
