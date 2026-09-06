const express = require("express");
const { Course, CourseProgress } = require("../models/Course");
const Announcement = require("../models/Announcement");
const { requireAuth, requireRole } = require("../middleware/auth");

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

// HR only: add a new training course to the catalog. It's immediately
// visible to every employee via /courses/mine, starting at "Not Started".
router.post("/courses", requireRole("hr"), async (req, res, next) => {
  try {
    const { title, category, durationHours } = req.body;
    if (!title || !category || !durationHours) {
      return res.status(400).json({ message: "Title, category and duration (hours) are required." });
    }
    const course = await Course.create({ title, category, durationHours: Number(durationHours) });
    res.status(201).json(course);
  } catch (err) {
    next(err);
  }
});

// HR only: the plain course catalog, with how many employees have started/completed each one.
router.get("/courses", requireRole("hr"), async (req, res, next) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    const withStats = await Promise.all(
      courses.map(async (c) => ({
        ...c.toObject(),
        enrolled: await CourseProgress.countDocuments({ course: c._id }),
        completed: await CourseProgress.countDocuments({ course: c._id, status: "Completed" }),
      }))
    );
    res.json(withStats);
  } catch (err) {
    next(err);
  }
});

// Employee: advance their own progress on a course. Since there's no lesson
// content system, each call moves progress forward in steps until complete.
router.patch("/courses/:id/progress", async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    let record = await CourseProgress.findOne({ employeeId: req.user.employeeId, course: course._id });
    const currentProgress = record?.progress ?? 0;
    const nextProgress = Math.min(100, currentProgress + 25);
    const nextStatus = nextProgress >= 100 ? "Completed" : "In Progress";
    const certificateEarned = nextStatus === "Completed";

    if (record) {
      record.progress = nextProgress;
      record.status = nextStatus;
      record.certificateEarned = certificateEarned;
      await record.save();
    } else {
      record = await CourseProgress.create({
        employeeId: req.user.employeeId,
        course: course._id,
        progress: nextProgress,
        status: nextStatus,
        certificateEarned,
      });
    }

    res.json({
      id: course._id,
      title: course.title,
      category: course.category,
      durationHours: course.durationHours,
      progress: record.progress,
      status: record.status,
      certificateEarned: record.certificateEarned,
    });
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
