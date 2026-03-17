const express = require("express");
const OpenAI = require("openai");

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1"
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

Return:
1. Match score out of 100
2. Missing skills
3. Suggestions to improve resume
`;

    const completion = await openai.chat.completions.create({
      model: "openrouter/free",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    res.json({
      result: completion.choices[0].message.content
    });

    } catch (error) {

    console.error("OpenAI analysis error:", error);

    res.status(500).json({
        error: error.message || "Analysis failed"
    });

    }

});

module.exports = router;