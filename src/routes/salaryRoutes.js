const express = require("express");
const Payslip = require("../models/Payslip");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

router.get("/mine", async (req, res, next) => {
  try {
    const payslips = await Payslip.find({ employeeId: req.user.employeeId }).sort({ year: -1, createdAt: -1 });
    res.json(payslips);
  } catch (err) {
    next(err);
  }
});

router.get("/", requireRole("hr"), async (req, res, next) => {
  try {
    const filter = req.query.employeeId ? { employeeId: req.query.employeeId } : {};
    const payslips = await Payslip.find(filter).sort({ year: -1, createdAt: -1 });
    res.json(payslips);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const payslip = await Payslip.findById(req.params.id);
    if (!payslip) return res.status(404).json({ message: "Payslip not found" });
    if (req.user.role !== "hr" && payslip.employeeId !== req.user.employeeId) {
      return res.status(403).json({ message: "Not permitted" });
    }
    res.json(payslip);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
