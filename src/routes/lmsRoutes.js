const express = require("express");
const { Course, CourseProgress } = require("../models/Course");
const Announcement = require("../models/Announcement");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

router.get("/courses/mine", async (req, res, next) => {
  try {
    const courses = await Course.find();
    const progress = await CourseProgress.find({ employeeId: req.user.employeeId });
    const byCourse = Object.fromEntries(progress.map((p) => [p.course.toString(), p]));

    const merged = courses.map((c) => {
      const p = byCourse[c._id.toString()];
      return {
        id: c._id,
        title: c.title,
        category: c.category,
        durationHours: c.durationHours,
        progress: p?.progress ?? 0,
        status: p?.status ?? "Not Started",
        certificateEarned: p?.certificateEarned ?? false,
      };
    });
    res.json(merged);
  } catch (err) {
    next(err);
  }
});

router.get("/announcements", async (req, res, next) => {
  try {
    const items = await Announcement.find().sort({ date: -1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
