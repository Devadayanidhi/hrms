const mongoose = require("mongoose");

// Login credentials, one per app user, linked to an Employee record.
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["hr", "employee"], required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
