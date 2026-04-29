import 'dotenv/config';
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// 🔹 Stopwords
const STOPWORDS = [
  "the","and","with","for","are","you","this","that","have",
  "will","your","from","they","their","our","was","were",
  "using","use","used","build","develop","work","team"
];

// 🔹 Skills list
const SKILLS = [
  "javascript","react","node","express","mongodb","mysql",
  "api","rest","git","aws","docker","ci","cd",
  "data","structures","algorithms"
];

// 🔹 Normalize
const normalize = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOPWORDS.includes(w));
};

export const analyzeATS = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // 🔹 Extract words
    const resumeWords = [...new Set(normalize(resumeText))];
    const jdWords = [...new Set(normalize(jobDescription))];

    // 🔹 Skills
    const resumeSkills = resumeWords.filter(w => SKILLS.includes(w));
    const jdSkills = jdWords.filter(w => SKILLS.includes(w));

    // 🔹 Matching
    const matched = resumeSkills.filter(skill => jdSkills.includes(skill));
    const missing = jdSkills.filter(skill => !resumeSkills.includes(skill));

    // 🔹 Score
    const score = jdSkills.length === 0
      ? 0
      : Math.round((matched.length / jdSkills.length) * 100);

    // 🔹 Basic suggestions
    let suggestions = [];
    if (score < 50) suggestions.push("Resume is not well aligned with job requirements.");
    if (missing.length > 0) suggestions.push(`Add missing skills: ${missing.slice(0,5).join(", ")}`);
    if (resumeText.length < 300) suggestions.push("Expand your resume with more content.");

    // 🔥 AI + FALLBACK (clean)
    let aiData = {
      strengths: [],
      weaknesses: [],
      suggestions: []
    };

    try {
      const prompt = `
Return ONLY valid JSON.

Matched skills: ${matched.join(", ")}
Missing skills: ${missing.join(", ")}

{
  "strengths": ["...","..."],
  "weaknesses": ["...","..."],
  "suggestions": ["...","...","..."]
}
`;

      const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0
      });

      const raw = response.choices?.[0]?.message?.content || "";
      console.log("GROQ RAW:", raw);

      const start = raw.indexOf("{");
      const end = raw.lastIndexOf("}");

      if (start !== -1 && end !== -1) {
        aiData = JSON.parse(raw.substring(start, end + 1));
      } else {
        throw new Error("No JSON found");
      }

    } catch (err) {
      console.log("Groq failed → using fallback");

      // ✅ fallback ALWAYS works
      aiData = {
        strengths: matched.slice(0, 3).map(s => `Strong in ${s}`),
        weaknesses: missing.slice(0, 3).map(s => `Missing ${s}`),
        suggestions: [
          "Improve alignment with job description",
          "Add more technical depth",
          "Include quantified achievements"
        ]
      };
    }

    // 🔹 Final response
    res.json({
      score,
      keywordMatch: matched,
      missingKeywords: missing,
      suggestions,
      strengths: aiData.strengths,
      weaknesses: aiData.weaknesses,
      aiSuggestions: aiData.suggestions
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};