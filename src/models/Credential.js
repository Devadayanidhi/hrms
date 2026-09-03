const mongoose = require("mongoose");

const credentialSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    uploadedDate: { type: String, required: true },
    status: { type: String, enum: ["Verified", "Pending", "Rejected"], default: "Pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Credential", credentialSchema);
