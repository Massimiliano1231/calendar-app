const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    heading: String,
    author: { type: String, required: true },
    content: { type: String, required: true },
    completed: { type: Boolean, default: false },
    access: {
      type: String,
      enum: ["public", "restricted", "private"],
      default: "private"
    },
    allowedUsers: [{ type: String }] 
}, { timestamps: true });

module.exports = mongoose.model("Note", noteSchema);
