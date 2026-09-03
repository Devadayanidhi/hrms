require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./src/config/db");
const { notFound, errorHandler } = require("./src/middleware/errorHandler");

const authRoutes = require("./src/routes/authRoutes");
const employeeRoutes = require("./src/routes/employeeRoutes");
const requestRoutes = require("./src/routes/requestRoutes");
const salaryRoutes = require("./src/routes/salaryRoutes");
const recruitmentRoutes = require("./src/routes/recruitmentRoutes");
const assetRoutes = require("./src/routes/assetRoutes");
const attendanceRoutes = require("./src/routes/attendanceRoutes");
const credentialRoutes = require("./src/routes/credentialRoutes");
const performanceRoutes = require("./src/routes/performanceRoutes");
const lmsRoutes = require("./src/routes/lmsRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/payslips", salaryRoutes);
app.use("/api/recruitment", recruitmentRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/credentials", credentialRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/lms", lmsRoutes);
app.use("/api/notifications", notificationRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`HRMS API listening on http://0.0.0.0:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
