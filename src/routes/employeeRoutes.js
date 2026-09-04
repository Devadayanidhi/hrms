const express = require("express");
const bcrypt = require("bcryptjs");
const Employee = require("../models/Employee");
const User = require("../models/User");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

const AVATAR_COLORS = ["#1F3A5F", "#C98A2C", "#2D6CA6", "#1F7A5C", "#B8860B", "#C0392B"];

function initialsFor(name) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

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

// HR only: add a new employee and their login in one step.
router.post("/", requireRole("hr"), async (req, res, next) => {
  try {
    const {
      employeeId,
      name,
      department,
      designation,
      email,
      phone,
      joiningDate,
      location,
      role,
      temporaryPassword,
    } = req.body;

    const required = { employeeId, name, department, designation, email, phone, joiningDate, location, temporaryPassword };
    const missing = Object.entries(required).filter(([, v]) => !v || !String(v).trim());
    if (missing.length) {
      return res.status(400).json({ message: `Missing required field(s): ${missing.map(([k]) => k).join(", ")}` });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }
    if (String(temporaryPassword).length < 4) {
      return res.status(400).json({ message: "Temporary password must be at least 4 characters." });
    }

    const existingEmployee = await Employee.findOne({ employeeId: employeeId.trim() });
    if (existingEmployee) return res.status(409).json({ message: "That employee ID is already in use." });

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) return res.status(409).json({ message: "That email is already in use." });

    const employee = await Employee.create({
      employeeId: employeeId.trim(),
      name: name.trim(),
      initials: initialsFor(name),
      avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
      department: department.trim(),
      designation: designation.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      joiningDate,
      location: location.trim(),
      status: "active",
    });

    await User.create({
      email: email.toLowerCase().trim(),
      passwordHash: await bcrypt.hash(String(temporaryPassword), 10),
      role: role === "hr" ? "hr" : "employee",
      employee: employee._id,
    });

    res.status(201).json(employee);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
