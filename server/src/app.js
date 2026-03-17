const express = require("express");
const cors = require("cors");
const resumeRoutes = require("./routes/resumeRoutes");
const jobRoutes = require("./routes/jobRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Backend is running" });
});

app.use("/api/resumes", resumeRoutes);
app.use("/api/jobs", jobRoutes);

module.exports = app;