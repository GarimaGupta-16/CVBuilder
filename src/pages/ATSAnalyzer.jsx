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
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      const { data } = await axios.post('http://localhost:5000/api/ats/analyze', {
        resumeText,
        jobDescription
      }, {
        //headers: { Authorization: `Bearer ${token}` }
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
      <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-brand-500/10 rounded-full filter blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] right-[10%] w-72 h-72 bg-accent-purple/10 rounded-full filter blur-[120px] pointer-events-none z-0"></div>
      
      <div className="container mx-auto p-6 max-w-5xl relative z-10 w-full mb-12">
        <div className="text-center mb-10 relative z-10">
          <div className="inline-flex items-center justify-center p-4 bg-brand-500/10 rounded-3xl mb-4 border border-brand-500/30 shadow-sm">
            <Target className="text-brand-400 w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight flex justify-center items-center gap-3">
            ATS <span className="text-gradient">Resume Scanner</span>
          </h1>
          <p className="text-text-muted mt-4 max-w-2xl mx-auto font-medium text-lg">
            Paste your resume plain text and the job description below to see how well you match the role and get AI-powered suggestions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-10 relative z-10">
          <div className="glass-card p-6 rounded-3xl transition-all duration-300 focus-within:ring-2 focus-within:ring-brand-500/50 hover:shadow-2xl">
            <label className="block text-sm font-bold text-text-secondary mb-3 ml-1">Your Resume Text</label>
            <textarea
              className="w-full h-72 p-4 bg-black/20 border border-white/10 rounded-2xl resize-none outline-none text-sm text-white placeholder-white/20 transition-colors focus:border-brand-500 scrollbar-hide"
              placeholder="Paste your exported resume plain text here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            ></textarea>
          </div>

          <div className="glass-card p-6 rounded-3xl transition-all duration-300 focus-within:ring-2 focus-within:ring-brand-500/50 hover:shadow-2xl">
            <label className="block text-sm font-bold text-text-secondary mb-3 ml-1">Job Description</label>
            <textarea
              className="w-full h-72 p-4 bg-black/20 border border-white/10 rounded-2xl resize-none outline-none text-sm text-white placeholder-white/20 transition-colors focus:border-brand-500 scrollbar-hide"
              placeholder="Paste the target job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            ></textarea>
          </div>
        </div>

        {error && <div className="text-red-400 bg-red-500/10 border border-red-500/20 py-3 px-4 rounded-xl text-center mb-8 font-bold max-w-md mx-auto animate-fade-in-up">{error}</div>}

        <div className="flex justify-center mb-12 relative z-10">
          <button
            onClick={analyze}
            disabled={loading}
            className="btn-primary flex items-center gap-3 text-lg px-10 py-4 disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {loading ? (
              <> <Search className="w-6 h-6 animate-spin" /> Analyzing Match... </>
            ) : (
              <> <Search className="w-6 h-6" /> Scan For ATS Match </>
            )}
          </button>
        </div>

        {results && (
          <div className="glass-card rounded-[2.5rem] p-10 mt-8 border-2 border-brand-500/30 animate-fade-in-up relative overflow-hidden">
            {/* Result background effect */}
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-transparent via-brand-500/10 to-accent-purple/10 pointer-events-none z-0"></div>
            
            <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/5 pb-10 mb-10 gap-8 relative z-10">
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-black text-white tracking-tight">Match Results</h2>
                <p className="text-text-muted mt-2 font-medium text-lg">Based on our advanced semantic ATS algorithm</p>
              </div>
              
              <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="16" className="text-white/10" />
                  <circle 
                    cx="80" cy="80" r="70" fill="none" 
                    stroke={results.score > 75 ? '#10b981' : results.score > 50 ? '#f59e0b' : '#ef4444'} 
                    strokeWidth="16" 
                    strokeDasharray={`${(results.score / 100) * 440} 440`} 
                    strokeLinecap="round" 
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-5xl font-black text-white leading-none tracking-tighter">{results.score}</span>
                  <span className="text-sm text-text-muted font-bold uppercase tracking-widest mt-1">/ 100</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10 relative z-10">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-xl border border-green-500/30">
                    <CheckCircle2 className="text-green-400 w-6 h-6" />
                  </div>
                  Keywords Found
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {results.keywordMatch.map((kw, i) => (
                    <span key={i} className="px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl text-sm font-bold shadow-sm">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                  <div className="p-2 bg-red-500/20 rounded-xl border border-red-500/30">
                    <AlertCircle className="text-red-400 w-6 h-6" />
                  </div>
                  Missing Keywords
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {results.missingKeywords.map((kw, i) => (
                    <span key={i} className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-sm font-bold shadow-sm">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10 bg-brand-surface/80 rounded-3xl p-8 border border-brand-500/20 relative z-10 shadow-lg">
              <h3 className="text-2xl font-black text-brand-100 mb-6 flex items-center gap-3">
                <Sparkles className="text-brand-400 w-7 h-7" />
                 AI Improvement Suggestions
              </h3>
              <ul className="space-y-4">
                {results.suggestions.map((sug, i) => (
                  <li key={i} className="flex gap-4 text-brand-200 font-medium">
                    <span className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-300 flex items-center justify-center font-black text-sm shrink-0 shadow-sm border border-brand-500/30">{i+1}</span>
                    <p className="leading-relaxed pt-1">{sug}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ATSAnalyzer;
