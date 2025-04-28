// models/comment.js
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
   content: String,
   user_id: String,
   task_id: String,
   createdAt: { type: Date, default: Date.now },
   updatedAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;