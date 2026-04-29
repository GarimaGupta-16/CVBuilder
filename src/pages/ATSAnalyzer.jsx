import { useState } from 'react';
import axios from 'axios';
import { Target, AlertCircle, CheckCircle2, Search, Sparkles } from 'lucide-react';

const ATSAnalyzer = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const analyze = async () => {
    if (!resumeText || !jobDescription) {
      setError('Please provide both your resume content and a job description.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const { data } = await axios.post('http://localhost:5000/api/ats/analyze', {
        resumeText,
        jobDescription
      });

      setResults(data);
    } catch (err) {
      setError('Failed to analyze. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-bg min-h-[calc(100vh-73px)] relative overflow-hidden flex flex-col pt-8">
      
      <div className="container mx-auto p-6 max-w-5xl relative z-10 w-full mb-12">

        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-brand-500/10 rounded-3xl mb-4 border border-brand-500/30">
            <Target className="text-brand-400 w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-white">
            ATS <span className="text-gradient">Resume Scanner</span>
          </h1>
        </div>

        {/* INPUT */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <textarea
            className="w-full h-72 p-4 bg-black/20 border rounded-2xl text-white"
            placeholder="Paste Resume..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />

          <textarea
            className="w-full h-72 p-4 bg-black/20 border rounded-2xl text-white"
            placeholder="Paste Job Description..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>

        {/* BUTTON */}
        <div className="flex justify-center mb-10">
          <button onClick={analyze} disabled={loading} className="btn-primary px-8 py-3 flex items-center gap-2">
            {loading ? <Search className="animate-spin" /> : <Search />}
            {loading ? "Analyzing..." : "Scan For ATS Match"}
          </button>
        </div>

        {/* ERROR */}
        {error && <p className="text-red-400 text-center">{error}</p>}

        {/* RESULTS */}
        {results && (
          <div className="glass-card p-8 rounded-3xl">

            {/* SCORE */}
            <h2 className="text-2xl font-bold text-white mb-6">
              Score: {results.score} / 100
            </h2>

            {/* MATCHED */}
            <div className="mb-6">
              <h3 className="text-green-400 font-bold mb-2">Keywords Found</h3>
              <div className="flex flex-wrap gap-2">
                {results.keywordMatch?.map((kw, i) => (
                  <span key={i} className="px-3 py-1 bg-green-500/10 text-green-400 rounded-lg">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* MISSING */}
            <div className="mb-6">
              <h3 className="text-red-400 font-bold mb-2">Missing Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {results.missingKeywords?.map((kw, i) => (
                  <span key={i} className="px-3 py-1 bg-red-500/10 text-red-400 rounded-lg">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* RULE SUGGESTIONS */}
            <div className="mb-6">
              <h3 className="text-yellow-400 font-bold mb-2">Suggestions</h3>
              {results.suggestions?.map((s, i) => (
                <p key={i} className="text-yellow-300">• {s}</p>
              ))}
            </div>

            {/* 🔥 AI SECTION */}
            <div className="mt-8 space-y-6">

              {/* Strengths */}
              <div>
                <h3 className="text-green-400 font-bold mb-2">Strengths</h3>
                {results.strengths?.length > 0 ? (
                  results.strengths.map((s, i) => (
                    <p key={i} className="text-green-300">• {s}</p>
                  ))
                ) : (
                  <p className="text-gray-400">No strengths generated</p>
                )}
              </div>

              {/* Weaknesses */}
              <div>
                <h3 className="text-red-400 font-bold mb-2">Weaknesses</h3>
                {results.weaknesses?.length > 0 ? (
                  results.weaknesses.map((w, i) => (
                    <p key={i} className="text-red-300">• {w}</p>
                  ))
                ) : (
                  <p className="text-gray-400">No weaknesses generated</p>
                )}
              </div>

              {/* AI Suggestions */}
              <div>
                <h3 className="text-blue-400 font-bold mb-2">AI Suggestions</h3>
                {results.aiSuggestions?.length > 0 ? (
                  results.aiSuggestions.map((s, i) => (
                    <p key={i} className="text-blue-300">• {s}</p>
                  ))
                ) : (
                  <p className="text-gray-400">No suggestions generated</p>
                )}
              </div>

            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default ATSAnalyzer;