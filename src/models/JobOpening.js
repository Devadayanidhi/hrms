const mongoose = require("mongoose");

const jobOpeningSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    department: { type: String, required: true },
    location: { type: String, required: true },
    openings: { type: Number, default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobOpening", jobOpeningSchema);
