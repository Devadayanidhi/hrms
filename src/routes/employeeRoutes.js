const express = require("express");
const Employee = require("../models/Employee");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const { q } = req.query;
    let filter = {};
    if (q) {
      const re = new RegExp(q, "i");
      filter = { $or: [{ name: re }, { employeeId: re }, { department: re }, { designation: re }] };
    }
    const employees = await Employee.find(filter).sort({ name: 1 });
    res.json(employees);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const employee =
      (await Employee.findById(req.params.id).catch(() => null)) ||
      (await Employee.findOne({ employeeId: req.params.id }));
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
