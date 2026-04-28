import natural from 'natural';

const normalize = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .replace(/js/g, "") // normalize react.js → react
    .split(/\s+/)
    .filter(w => w.length > 2);
};

export const analyzeATS = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const resumeWords = [...new Set(normalize(resumeText))];
    const jdWords = [...new Set(normalize(jobDescription))];

    if (jdWords.length === 0) {
      return res.json({
        score: 0,
        keywordMatch: [],
        missingKeywords: [],
        suggestions: ["Job description parsing failed."]
      });
    }

    const matched = resumeWords.filter(w => jdWords.includes(w));
    const missing = jdWords.filter(w => !resumeWords.includes(w));

    const score = Math.round((matched.length / jdWords.length) * 100);

    let suggestions = [];

    if (score < 50) suggestions.push("Resume is poorly aligned with job role.");
    if (missing.length > 5) suggestions.push("Add missing relevant skills.");
    if (resumeText.length < 300) suggestions.push("Expand your resume content.");

    res.json({
      score,
      keywordMatch: matched.slice(0, 10),
      missingKeywords: missing.slice(0, 10),
      suggestions
    });

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};