const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    durationHours: { type: Number, required: true },
  },
  { timestamps: true }
);

// Per-employee progress against a course.
const courseProgressSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    status: { type: String, enum: ["Not Started", "In Progress", "Completed"], default: "Not Started" },
    certificateEarned: { type: Boolean, default: false },
  },
  { timestamps: true }
);
courseProgressSchema.index({ employeeId: 1, course: 1 }, { unique: true });

module.exports = {
  Course: mongoose.model("Course", courseSchema),
  CourseProgress: mongoose.model("CourseProgress", courseProgressSchema),
};
