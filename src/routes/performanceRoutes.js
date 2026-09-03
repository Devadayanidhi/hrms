const express = require("express");
const { PerformanceReview, Goal } = require("../models/Performance");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

router.get("/mine", async (req, res, next) => {
  try {
    const [reviews, goals] = await Promise.all([
      PerformanceReview.find({ employeeId: req.user.employeeId }).sort({ createdAt: -1 }),
      Goal.find({ employeeId: req.user.employeeId }).sort({ createdAt: -1 }),
    ]);
    const score = reviews.length ? reviews[0].score : 0;
    res.json({ score, reviews, goals });
  } catch (err) {
    next(err);
  }
});

router.get("/", requireRole("hr"), async (req, res, next) => {
  try {
    const filter = req.query.employeeId ? { employeeId: req.query.employeeId } : {};
    const reviews = await PerformanceReview.find(filter).sort({ createdAt: -1 });
    const avgScore = reviews.length ? reviews.reduce((s, r) => s + r.score, 0) / reviews.length : 0;
    res.json({ score: avgScore, reviews });
  } catch (err) {
    next(err);
  }
});

router.post("/reviews", requireRole("hr"), async (req, res, next) => {
  try {
    const { employeeId, period, score, feedback } = req.body;
    if (!employeeId || !period || score == null || !feedback) {
      return res.status(400).json({ message: "employeeId, period, score and feedback are required." });
    }
    const review = await PerformanceReview.create({
      employeeId,
      period,
      score,
      feedback,
      reviewer: req.user.name,
    });
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
});

router.post("/goals", requireRole("hr"), async (req, res, next) => {
  try {
    const { employeeId, title, dueDate } = req.body;
    if (!employeeId || !title || !dueDate) {
      return res.status(400).json({ message: "employeeId, title and dueDate are required." });
    }
    const goal = await Goal.create({ employeeId, title, dueDate, progress: 0 });
    res.status(201).json(goal);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
