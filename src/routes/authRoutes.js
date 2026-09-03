const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
      employeeId: user.employee.employeeId,
      name: user.employee.name,
      email: user.email,
      designation: user.employee.designation,
      department: user.employee.department,
      avatarColor: user.employee.avatarColor,
      initials: user.employee.initials,
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
}

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email: email.toLowerCase().trim() }).populate("employee");
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid email or password" });

    const token = signToken(user);
    res.json({ token, user: jwt.decode(token) });
  } catch (err) {
    next(err);
  }
});

router.post("/forgot-password", async (req, res) => {
  // Demo stub — wire up a real mailer here later.
  res.json({ sent: true });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
