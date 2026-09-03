const express = require("express");
const Credential = require("../models/Credential");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

router.get("/mine", async (req, res, next) => {
  try {
    const docs = await Credential.find({ employeeId: req.user.employeeId }).sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    next(err);
  }
});

router.get("/", requireRole("hr"), async (req, res, next) => {
  try {
    const filter = req.query.employeeId ? { employeeId: req.query.employeeId } : {};
    const docs = await Credential.find(filter).sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
