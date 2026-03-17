const express = require("express");
const OpenAI = require("openai");
const prisma = require("../utils/prisma");

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

router.post("/", async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    const prompt = `
Compare this resume with the job description.

Resume:
${resumeText}

Job Description:
${jobDescription}

Return your answer as valid JSON only in this exact format:
{
  "matchScore": number,
  "missingSkills": ["skill1", "skill2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "summary": "short summary"
}

Do not include markdown.
Do not include code fences.
Do not include any extra text outside JSON.
`;

    const completion = await openai.chat.completions.create({
      model: "openrouter/free",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const aiResultText = completion.choices[0].message.content;

    let parsedResult;

    try {
      parsedResult = JSON.parse(aiResultText);
    } catch (parseError) {
      console.error("Failed to parse AI JSON:", aiResultText);

      return res.status(500).json({
        error: "AI returned invalid JSON",
      });
    }

    const savedAnalysis = await prisma.analysis.create({
      data: {
        resumeText,
        jobDescription,
        result: JSON.stringify(parsedResult),
      },
    });

    res.json({
      message: "Analysis completed and saved",
      analysis: savedAnalysis,
      parsedResult,
    });
  } catch (error) {
    console.error("OpenRouter analysis error:", error);

    res.status(500).json({
      error: error.message || "Analysis failed",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const analyses = await prisma.analysis.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      message: "Analyses fetched successfully",
      analyses,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch analyses",
    });
  }
});

module.exports = router;