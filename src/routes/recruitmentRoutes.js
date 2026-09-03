const express = require("express");
const JobOpening = require("../models/JobOpening");
const Candidate = require("../models/Candidate");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth, requireRole("hr"));

router.get("/jobs", async (req, res, next) => {
  try {
    const jobs = await JobOpening.find().sort({ createdAt: -1 });
    const withCounts = await Promise.all(
      jobs.map(async (job) => ({
        ...job.toObject(),
        candidates: await Candidate.countDocuments({ jobId: job._id }),
      }))
    );
    res.json(withCounts);
  } catch (err) {
    next(err);
  }
});

router.post("/jobs", async (req, res, next) => {
  try {
    const { title, department, location, openings } = req.body;
    if (!title || !department || !location) {
      return res.status(400).json({ message: "Title, department and location are required." });
    }
    const job = await JobOpening.create({ title, department, location, openings: openings || 1 });
    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
});

router.get("/candidates", async (req, res, next) => {
  try {
    const filter = req.query.jobId ? { jobId: req.query.jobId } : {};
    const candidates = await Candidate.find(filter).sort({ createdAt: -1 });
    res.json(candidates);
  } catch (err) {
    next(err);
  }
});

router.patch("/candidates/:id/status", async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ["Applied", "Shortlisted", "Interview", "Selected", "Rejected"];
    if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });

    const updated = await Candidate.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: "Candidate not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
