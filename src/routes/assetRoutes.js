const express = require("express");
const Asset = require("../models/Asset");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

router.get("/mine", async (req, res, next) => {
  try {
    const assets = await Asset.find({ assignedTo: req.user.name });
    res.json(assets);
  } catch (err) {
    next(err);
  }
});

router.get("/", requireRole("hr"), async (req, res, next) => {
  try {
    const assets = await Asset.find().sort({ createdAt: -1 });
    res.json(assets);
  } catch (err) {
    next(err);
  }
});

router.post("/", requireRole("hr"), async (req, res, next) => {
  try {
    const { name, category, serial } = req.body;
    if (!name || !category || !serial) {
      return res.status(400).json({ message: "Name, category and serial number are required." });
    }
    const asset = await Asset.create({ name, category, serial, status: "Available" });
    res.status(201).json(asset);
  } catch (err) {
    next(err);
  }
});

router.patch("/:id/assign", requireRole("hr"), async (req, res, next) => {
  try {
    const { assignedTo } = req.body;
    if (!assignedTo) return res.status(400).json({ message: "assignedTo is required" });
    const updated = await Asset.findByIdAndUpdate(
      req.params.id,
      { status: "Assigned", assignedTo, assignedDate: new Date().toISOString().slice(0, 10) },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Asset not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.patch("/:id/status", requireRole("hr"), async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ["Assigned", "Available", "Under Repair", "Returned"];
    if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });

    const patch = { status };
    if (status === "Returned" || status === "Available") {
      patch.assignedTo = undefined;
    }
    const updated = await Asset.findByIdAndUpdate(req.params.id, patch, { new: true });
    if (!updated) return res.status(404).json({ message: "Asset not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
