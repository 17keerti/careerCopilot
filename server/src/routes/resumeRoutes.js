const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { PDFParse } = require("pdf-parse");
const prisma = require("../utils/prisma");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.get("/", (req, res) => {
  res.json({ message: "Resume route working" });
});

router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);

    const parser = new PDFParse({ data: dataBuffer });
    const result = await parser.getText();
    await parser.destroy();

    const resume = await prisma.resume.create({
      data: {
        userId: "11111111-1111-1111-1111-111111111111",
        fileName: req.file.originalname,
        fileUrl: req.file.path,
        extractedText: result.text || "",
      },
    });

    res.json({
      message: "File uploaded, parsed, and saved successfully",
      resume,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to upload and save resume" });
  }
});

module.exports = router;