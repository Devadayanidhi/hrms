const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "JobOpening", required: true },
    name: { type: String, required: true },
    initials: { type: String, required: true },
    appliedRole: { type: String, required: true },
    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Interview", "Selected", "Rejected"],
      default: "Applied",
    },
    interviewDate: { type: String },
    experience: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Candidate", candidateSchema);
