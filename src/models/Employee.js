const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    initials: { type: String, required: true },
    avatarColor: { type: String, default: "#1F3A5F" },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    joiningDate: { type: String, required: true },
    status: { type: String, enum: ["active", "on-leave", "inactive"], default: "active" },
    location: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
