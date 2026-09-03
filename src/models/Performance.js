const mongoose = require("mongoose");

const performanceReviewSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true },
    period: { type: String, required: true },
    score: { type: Number, required: true, min: 0, max: 5 },
    reviewer: { type: String, required: true },
    feedback: { type: String, required: true },
  },
  { timestamps: true }
);

const goalSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true },
    title: { type: String, required: true },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    dueDate: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = {
  PerformanceReview: mongoose.model("PerformanceReview", performanceReviewSchema),
  Goal: mongoose.model("Goal", goalSchema),
};
