const mongoose = require("mongoose");

const payslipSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true },
    month: { type: String, required: true },
    year: { type: Number, required: true },
    basic: { type: Number, required: true },
    hra: { type: Number, required: true },
    allowances: { type: Number, required: true },
    deductions: { type: Number, required: true },
    tax: { type: Number, required: true },
    netPay: { type: Number, required: true },
    status: { type: String, enum: ["Paid", "Processing"], default: "Processing" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payslip", payslipSchema);
