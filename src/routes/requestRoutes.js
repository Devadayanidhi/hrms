const express = require("express");
const Request = require("../models/RequestModel");
const Notification = require("../models/Notification");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// HR: all requests. Employee: only their own (use /mine instead, but keep this HR-only for clarity).
router.get("/", requireRole("hr"), async (req, res, next) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    next(err);
  }
});

router.get("/mine", async (req, res, next) => {
  try {
    const requests = await Request.find({ employeeId: req.user.employeeId }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { type, description } = req.body;
    if (!type || !description || description.trim().length < 10) {
      return res.status(400).json({ message: "A request type and a description of at least 10 characters are required." });
    }
    const created = await Request.create({
      employeeId: req.user.employeeId,
      employeeName: req.user.name,
      type,
      description: description.trim(),
      status: "Pending",
    });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

router.patch("/:id/status", requireRole("hr"), async (req, res, next) => {
  try {
    const { status, remarks } = req.body;
    if (!["Approved", "Rejected", "In Progress", "Pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const updated = await Request.findByIdAndUpdate(
      req.params.id,
      { status, ...(remarks !== undefined ? { remarks } : {}) },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Request not found" });

    if (status === "Approved" || status === "Rejected") {
      await Notification.create({
        employeeId: updated.employeeId,
        title: `Request ${status.toLowerCase()}`,
        body: `Your ${updated.type} request was ${status.toLowerCase()}.`,
        category: "request",
      });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
