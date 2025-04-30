// controllers/taskController.js
const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const User = require("../models/user");

// Create a new task
router.post("/", async (req, res) => {
   try {
      const { title, description, status, user_id, priority, dueDate } = req.body;

      const user = await User.findById(user_id);
      if (!user) return res.status(404).json({ error: "USER_NOT_FOUND" });

      const task = new Task({
         title,
         description,
         status,
         priority,
         dueDate,
         user_id: user._id,
      });

      await task.save();
      res.status(201).json(task);
   } catch (error) {
      res.status(500).json({ error: "FAILED_TO_CREATE_TASK" });
   }
});

// Assign task to user
router.post("/:id/assign", async (req, res) => {
   try {
      const { user_id } = req.body;
      if (!user_id) return res.status(400).json({ error: "USER_ID_REQUIRED" });

      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ error: "TASK_NOT_FOUND" });

      const user = await User.findById(user_id);
      if (!user) return res.status(404).json({ error: "USER_NOT_FOUND" });

      task.assigned_user_id = user._id;
      task.updatedAt = Date.now();

      await task.save();
      res.status(200).json(task);
   } catch (error) {
      res.status(500).json({ error: "FAILED_TO_ASSIGN_TASK" });
   }
});

module.exports = router;