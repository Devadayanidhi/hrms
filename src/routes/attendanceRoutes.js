const express = require("express");
const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

router.get("/mine", async (req, res, next) => {
  try {
    const records = await Attendance.find({ employeeId: req.user.employeeId }).sort({ date: -1 }).limit(30);
    res.json(records);
  } catch (err) {
    next(err);
  }
});

router.post("/check-in", async (req, res, next) => {
  try {
    const time = new Date().toTimeString().slice(0, 5);
    const record = await Attendance.findOneAndUpdate(
      { employeeId: req.user.employeeId, date: todayStr() },
      { $setOnInsert: { checkIn: time, status: "Present" } },
      { new: true, upsert: true }
    );
    res.json({ time, record });
  } catch (err) {
    next(err);
  }
});

router.post("/check-out", async (req, res, next) => {
  try {
    const time = new Date().toTimeString().slice(0, 5);
    const record = await Attendance.findOne({ employeeId: req.user.employeeId, date: todayStr() });
    if (!record) return res.status(400).json({ message: "You haven't checked in today yet." });

    record.checkOut = time;
    if (record.checkIn) {
      const [inH, inM] = record.checkIn.split(":").map(Number);
      const [outH, outM] = time.split(":").map(Number);
      record.hours = Math.max(0, Math.round(((outH * 60 + outM - (inH * 60 + inM)) / 60) * 10) / 10);
    }
    await record.save();
    res.json({ time, record });
  } catch (err) {
    next(err);
  }
});

// HR: today's snapshot across the whole team.
router.get("/summary", requireRole("hr"), async (req, res, next) => {
  try {
    const today = todayStr();
    const totalEmployees = await Employee.countDocuments();
    const todayRecords = await Attendance.find({ date: today });
    const presentToday = todayRecords.filter((r) => r.status === "Present" || r.status === "Half Day").length;
    const onLeaveToday = todayRecords.filter((r) => r.status === "Leave").length;
    const absentToday = Math.max(0, totalEmployees - presentToday - onLeaveToday);
    res.json({ presentToday, absentToday, onLeaveToday, totalEmployees });
  } catch (err) {
    next(err);
  }
});

router.get("/team", requireRole("hr"), async (req, res, next) => {
  try {
    const today = todayStr();
    const records = await Attendance.find({ date: today });
    res.json(records);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
