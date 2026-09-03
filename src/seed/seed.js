require("dotenv").config();
const bcrypt = require("bcryptjs");
const { connectDB } = require("../config/db");
const mongoose = require("mongoose");

const Employee = require("../models/Employee");
const User = require("../models/User");
const Request = require("../models/RequestModel");
const Payslip = require("../models/Payslip");
const JobOpening = require("../models/JobOpening");
const Candidate = require("../models/Candidate");
const Asset = require("../models/Asset");
const Attendance = require("../models/Attendance");
const Credential = require("../models/Credential");
const { PerformanceReview, Goal } = require("../models/Performance");
const { Course, CourseProgress } = require("../models/Course");
const Announcement = require("../models/Announcement");
const Notification = require("../models/Notification");

async function seed() {
  await connectDB();
  console.log("Clearing existing collections...");
  await Promise.all(
    [Employee, User, Request, Payslip, JobOpening, Candidate, Asset, Attendance, Credential, PerformanceReview, Goal, Course, CourseProgress, Announcement, Notification].map((m) => m.deleteMany({}))
  );

  const employeesData = [
    { employeeId: "HR-1001", name: "Priya Ramesh", initials: "PR", avatarColor: "#1F3A5F", department: "Human Resources", designation: "HR Manager", email: "hr@company.com", phone: "+91 98765 43210", joiningDate: "2021-03-14", status: "active", location: "Coimbatore" },
    { employeeId: "EMP-2045", name: "Arjun Kumar", initials: "AK", avatarColor: "#C98A2C", department: "Production", designation: "Floor Supervisor", email: "employee@company.com", phone: "+91 98450 11223", joiningDate: "2022-07-01", status: "active", location: "Coimbatore" },
    { employeeId: "EMP-2046", name: "Divya Suresh", initials: "DS", avatarColor: "#2D6CA6", department: "Design", designation: "Pattern Designer", email: "divya.suresh@company.com", phone: "+91 90031 44556", joiningDate: "2023-01-20", status: "on-leave", location: "Tirupur" },
    { employeeId: "EMP-2047", name: "Karthik Raja", initials: "KR", avatarColor: "#1F7A5C", department: "Quality Control", designation: "QC Inspector", email: "karthik.raja@company.com", phone: "+91 99400 77889", joiningDate: "2020-11-05", status: "active", location: "Coimbatore" },
    { employeeId: "EMP-2048", name: "Meena Iyer", initials: "MI", avatarColor: "#B8860B", department: "Accounts", designation: "Accounts Executive", email: "meena.iyer@company.com", phone: "+91 63741 22110", joiningDate: "2019-06-18", status: "active", location: "Coimbatore" },
    { employeeId: "EMP-2049", name: "Vignesh Babu", initials: "VB", avatarColor: "#C0392B", department: "Logistics", designation: "Warehouse Lead", email: "vignesh.babu@company.com", phone: "+91 87654 90123", joiningDate: "2022-02-11", status: "inactive", location: "Tirupur" },
    { employeeId: "EMP-2050", name: "Sowmiya Ravi", initials: "SR", avatarColor: "#1F3A5F", department: "Merchandising", designation: "Merchandiser", email: "sowmiya.ravi@company.com", phone: "+91 90420 33445", joiningDate: "2023-09-04", status: "active", location: "Coimbatore" },
  ];
  console.log("Seeding employees...");
  const employees = await Employee.insertMany(employeesData);
  const hrEmployee = employees.find((e) => e.employeeId === "HR-1001");
  const empEmployee = employees.find((e) => e.employeeId === "EMP-2045");

  console.log("Seeding demo user logins...");
  await User.insertMany([
    { email: "hr@company.com", passwordHash: await bcrypt.hash("hr1234", 10), role: "hr", employee: hrEmployee._id },
    { email: "employee@company.com", passwordHash: await bcrypt.hash("emp1234", 10), role: "employee", employee: empEmployee._id },
  ]);

  console.log("Seeding requests...");
  await Request.insertMany([
    { employeeId: "EMP-2045", employeeName: "Arjun Kumar", type: "Leave", description: "Requesting 2 days casual leave for a family function.", status: "Pending" },
    { employeeId: "EMP-2045", employeeName: "Arjun Kumar", type: "Reimbursement", description: "Travel reimbursement for site visit to Tirupur unit.", status: "Approved", remarks: "Approved with receipts on file." },
    { employeeId: "EMP-2046", employeeName: "Divya Suresh", type: "Work From Home", description: "WFH request for pattern review work, 1 day.", status: "In Progress" },
    { employeeId: "EMP-2047", employeeName: "Karthik Raja", type: "Document", description: "Request for updated experience letter.", status: "Rejected", remarks: "Please raise this with HR desk directly, incomplete details." },
    { employeeId: "EMP-2050", employeeName: "Sowmiya Ravi", type: "Leave", description: "Sick leave, 1 day.", status: "Approved", remarks: "Get well soon." },
    { employeeId: "EMP-2045", employeeName: "Arjun Kumar", type: "Other", description: "Request for a new access badge, old one is demagnetised.", status: "Pending" },
  ]);

  console.log("Seeding payslips...");
  const payslipMonths = [
    ["August", 2026, 32000, 12800, 6200, 2400, 3100, 45500, "Paid"],
    ["July", 2026, 32000, 12800, 5800, 2400, 3100, 45100, "Paid"],
    ["June", 2026, 32000, 12800, 5800, 2400, 3100, 45100, "Paid"],
    ["May", 2026, 30000, 12000, 5400, 2200, 2900, 42300, "Paid"],
    ["April", 2026, 30000, 12000, 5400, 2200, 2900, 42300, "Paid"],
    ["September", 2026, 32000, 12800, 6200, 2400, 3100, 45500, "Processing"],
  ];
  await Payslip.insertMany(
    payslipMonths.map(([month, year, basic, hra, allowances, deductions, tax, netPay, status]) => ({
      employeeId: "EMP-2045",
      month,
      year,
      basic,
      hra,
      allowances,
      deductions,
      tax,
      netPay,
      status,
    }))
  );

  console.log("Seeding recruitment...");
  const jobs = await JobOpening.insertMany([
    { title: "Senior Pattern Maker", department: "Design", location: "Coimbatore", openings: 2 },
    { title: "Production Supervisor", department: "Production", location: "Tirupur", openings: 1 },
    { title: "QC Inspector", department: "Quality Control", location: "Coimbatore", openings: 3 },
    { title: "Merchandiser", department: "Merchandising", location: "Coimbatore", openings: 1 },
  ]);
  await Candidate.insertMany([
    { jobId: jobs[0]._id, name: "Ramesh Vel", initials: "RV", appliedRole: "Senior Pattern Maker", status: "Interview", interviewDate: "2026-09-06", experience: "6 yrs" },
    { jobId: jobs[0]._id, name: "Anitha Selvam", initials: "AS", appliedRole: "Senior Pattern Maker", status: "Shortlisted", experience: "4 yrs" },
    { jobId: jobs[1]._id, name: "Suresh Babu", initials: "SB", appliedRole: "Production Supervisor", status: "Applied", experience: "8 yrs" },
    { jobId: jobs[2]._id, name: "Lakshmi Priya", initials: "LP", appliedRole: "QC Inspector", status: "Selected", experience: "3 yrs" },
    { jobId: jobs[2]._id, name: "Gopinath M", initials: "GM", appliedRole: "QC Inspector", status: "Rejected", experience: "1 yr" },
    { jobId: jobs[3]._id, name: "Nisha Kumari", initials: "NK", appliedRole: "Merchandiser", status: "Interview", interviewDate: "2026-09-08", experience: "5 yrs" },
  ]);

  console.log("Seeding assets...");
  await Asset.insertMany([
    { name: "Dell Latitude 5440", category: "Laptop", serial: "DL-5440-2291", status: "Assigned", assignedTo: "Arjun Kumar", assignedDate: "2024-02-10" },
    { name: "iPhone 13", category: "Mobile", serial: "IP13-8871", status: "Assigned", assignedTo: "Arjun Kumar", assignedDate: "2024-02-10" },
    { name: "Access Card", category: "ID Card", serial: "AC-2045", status: "Assigned", assignedTo: "Arjun Kumar", assignedDate: "2022-07-01" },
    { name: "HP ProBook 440", category: "Laptop", serial: "HP-440-1120", status: "Available" },
    { name: "Wireless Mouse", category: "Accessory", serial: "WM-6612", status: "Under Repair" },
    { name: "Samsung Galaxy A54", category: "Mobile", serial: "SGA54-3391", status: "Assigned", assignedTo: "Divya Suresh", assignedDate: "2023-01-22" },
    { name: "Laptop Bag", category: "Accessory", serial: "LB-0093", status: "Returned" },
  ]);

  console.log("Seeding attendance history...");
  const attendanceDocs = [];
  const today = new Date();
  for (let i = 20; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const dow = d.getDay();
    if (dow === 0) {
      attendanceDocs.push({ employeeId: "EMP-2045", date: dateStr, status: "Weekend" });
      continue;
    }
    const roll = (d.getDate() + i) % 9;
    if (roll === 0) attendanceDocs.push({ employeeId: "EMP-2045", date: dateStr, status: "Leave" });
    else if (roll === 1) attendanceDocs.push({ employeeId: "EMP-2045", date: dateStr, status: "Absent" });
    else if (roll === 2) attendanceDocs.push({ employeeId: "EMP-2045", date: dateStr, checkIn: "09:40", checkOut: "17:10", hours: 7.5, status: "Half Day" });
    else attendanceDocs.push({ employeeId: "EMP-2045", date: dateStr, checkIn: "09:12", checkOut: "18:24", hours: 9.2, status: "Present" });
  }
  await Attendance.insertMany(attendanceDocs);

  console.log("Seeding credentials...");
  await Credential.insertMany([
    { employeeId: "EMP-2045", name: "Aadhaar Card", type: "ID Proof", uploadedDate: "2022-07-02", status: "Verified" },
    { employeeId: "EMP-2045", name: "PAN Card", type: "ID Proof", uploadedDate: "2022-07-02", status: "Verified" },
    { employeeId: "EMP-2045", name: "B.Tech Certificate", type: "Qualification", uploadedDate: "2022-07-03", status: "Verified" },
    { employeeId: "EMP-2045", name: "Relieving Letter — Previous Employer", type: "Employment Document", uploadedDate: "2022-07-05", status: "Pending" },
    { employeeId: "EMP-2045", name: "Bank Passbook Copy", type: "Financial", uploadedDate: "2022-08-11", status: "Verified" },
    { employeeId: "EMP-2045", name: "Six Sigma Green Belt", type: "Certificate", uploadedDate: "2024-01-19", status: "Verified" },
  ]);

  console.log("Seeding performance...");
  await PerformanceReview.insertMany([
    { employeeId: "EMP-2045", period: "Q2 2026", score: 4.3, reviewer: "Priya Ramesh", feedback: "Consistently meets production targets; strong floor coordination during peak season." },
    { employeeId: "EMP-2045", period: "Q1 2026", score: 4.0, reviewer: "Priya Ramesh", feedback: "Good improvement in shift handover documentation." },
    { employeeId: "EMP-2045", period: "Q4 2025", score: 3.7, reviewer: "Priya Ramesh", feedback: "Meets expectations, room to improve on reporting turnaround." },
  ]);
  await Goal.insertMany([
    { employeeId: "EMP-2045", title: "Reduce line downtime by 10%", progress: 65, dueDate: "2026-09-30" },
    { employeeId: "EMP-2045", title: "Complete Lean Manufacturing training", progress: 40, dueDate: "2026-10-15" },
    { employeeId: "EMP-2045", title: "Mentor two new floor trainees", progress: 80, dueDate: "2026-09-20" },
  ]);

  console.log("Seeding LMS + engagement...");
  const courses = await Course.insertMany([
    { title: "Workplace Safety Fundamentals", category: "Compliance", durationHours: 2 },
    { title: "Lean Manufacturing Basics", category: "Skills", durationHours: 6 },
    { title: "Effective Shift Handover", category: "Skills", durationHours: 1.5 },
    { title: "POSH Awareness", category: "Compliance", durationHours: 1 },
    { title: "Quality Control Essentials", category: "Skills", durationHours: 4 },
  ]);
  await CourseProgress.insertMany([
    { employeeId: "EMP-2045", course: courses[0]._id, progress: 100, status: "Completed", certificateEarned: true },
    { employeeId: "EMP-2045", course: courses[1]._id, progress: 40, status: "In Progress" },
    { employeeId: "EMP-2045", course: courses[2]._id, progress: 0, status: "Not Started" },
    { employeeId: "EMP-2045", course: courses[3]._id, progress: 100, status: "Completed", certificateEarned: true },
    { employeeId: "EMP-2045", course: courses[4]._id, progress: 70, status: "In Progress" },
  ]);
  await Announcement.insertMany([
    { title: "Ganesh Chaturthi holiday notice", body: "The unit will remain closed on Sep 14 for Ganesh Chaturthi. Regular working hours resume Sep 15.", date: "2026-09-01", category: "Announcement" },
    { title: "Quarterly town hall — Sep 18", body: "Join the quarterly town hall at the Coimbatore unit cafeteria, 4:00 PM.", date: "2026-08-30", category: "Event" },
    { title: "Cafeteria menu feedback", body: "Help us improve the cafeteria menu — a 2-minute poll is open until Sep 10.", date: "2026-08-27", category: "Poll" },
    { title: "New safety gear rollout", body: "Updated safety gloves and eyewear are being issued at the floor stores counter this week.", date: "2026-08-24", category: "Announcement" },
  ]);

  console.log("Seeding notifications...");
  await Notification.insertMany([
    { employeeId: "EMP-2045", title: "Request approved", body: "Your reimbursement request for the Tirupur site visit was approved.", category: "request", read: false },
    { employeeId: "EMP-2045", title: "Payslip ready", body: "Your August payslip has been generated and is ready to view.", category: "payroll", read: false },
    { employeeId: "EMP-2045", title: "Town hall reminder", body: "Quarterly town hall on Sep 18, 4:00 PM at the Coimbatore cafeteria.", category: "announcement", read: true },
    { employeeId: "EMP-2045", title: "Performance review scheduled", body: "Your Q3 performance review is scheduled with Priya Ramesh.", category: "performance", read: true },
    { employeeId: "EMP-2045", title: "Course reminder", body: "You're 40% through Lean Manufacturing Basics — pick up where you left off.", category: "training", read: true },
  ]);

  console.log("Seed complete.");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
