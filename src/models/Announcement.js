const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    date: { type: String, required: true },
    category: { type: String, enum: ["Announcement", "Event", "Poll"], default: "Announcement" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Announcement", announcementSchema);
