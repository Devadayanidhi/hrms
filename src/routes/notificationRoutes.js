const express = require("express");
const Notification = require("../models/Notification");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

router.get("/mine", async (req, res, next) => {
  try {
    const items = await Notification.find({ employeeId: req.user.employeeId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.get("/unread-count", async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({ employeeId: req.user.employeeId, read: false });
    res.json({ count });
  } catch (err) {
    next(err);
  }
});

router.patch("/:id/read", async (req, res, next) => {
  try {
    const updated = await Notification.findOneAndUpdate(
      { _id: req.params.id, employeeId: req.user.employeeId },
      { read: true },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Notification not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
