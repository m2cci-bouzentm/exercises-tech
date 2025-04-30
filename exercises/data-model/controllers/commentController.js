
// controllers/commentController.js
const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const Comment = require("../models/comment");
const User = require("../models/user");


// Add a comment to a task
router.post("/", async (req, res) => {
   try {
      const { text, user_id } = req.body;

      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ error: "TASK_NOT_FOUND" });

      const user = await User.findById(user_id);
      if (!user) return res.status(404).json({ error: "USER_NOT_FOUND" });
      
      const comment = new Comment({
         content: text,
         user_id: user._id,
         createdAt: Date.now(),
         task_id: task._id
      });

      await comment.save();
      task.updatedAt = Date.now();

      await task.save();
      res.status(201).json(comment);
   } catch (error) {
      res.status(500).json({ error: "FAILED_TO_ADD_COMMENT" });
   }
});

module.exports = router;