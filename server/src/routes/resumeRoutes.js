const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { PDFParse } = require("pdf-parse");

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

    res.json({
      message: "File uploaded and parsed successfully",
      extractedText: result.text?.substring(0, 500) || "",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to parse PDF" });
  }
});

module.exports = router;