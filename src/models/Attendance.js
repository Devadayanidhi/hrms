const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true },
    date: { type: String, required: true },
    checkIn: { type: String },
    checkOut: { type: String },
    hours: { type: Number },
    status: {
      type: String,
      enum: ["Present", "Absent", "Half Day", "Leave", "Weekend"],
      required: true,
    },
  },
  { timestamps: true }
);

attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
