const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, enum: ["Laptop", "Mobile", "ID Card", "Accessory", "Other"], required: true },
    serial: { type: String, required: true, unique: true },
    status: { type: String, enum: ["Assigned", "Available", "Under Repair", "Returned"], default: "Available" },
    assignedTo: { type: String },
    assignedDate: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Asset", assetSchema);
