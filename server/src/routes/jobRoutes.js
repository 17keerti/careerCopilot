const express = require("express");
const prisma = require("../utils/prisma");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { companyName, roleTitle, description } = req.body;

    const job = await prisma.jobDescription.create({
      data: {
        companyName,
        roleTitle,
        description
      }
    });

    res.status(201).json({
      message: "Job saved",
      job
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to save job description"
    });
  }
});

router.get("/", async (req, res) => {
  try {

    const jobs = await prisma.jobDescription.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json({
      message: "Jobs fetched successfully",
      jobs
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to fetch job descriptions"
    });

  }
});

module.exports = router;