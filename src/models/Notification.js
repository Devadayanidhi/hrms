const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    category: {
      type: String,
      enum: ["request", "payroll", "announcement", "performance", "training"],
      required: true,
    },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
