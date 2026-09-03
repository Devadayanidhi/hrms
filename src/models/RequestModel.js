const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true },
    employeeName: { type: String, required: true },
    type: {
      type: String,
      enum: ["Leave", "Reimbursement", "Work From Home", "Document", "Other"],
      required: true,
    },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "In Progress"],
      default: "Pending",
    },
    remarks: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", requestSchema);
