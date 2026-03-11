import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { PlayCircle, MessageCircle, Send, Award, ArrowRight } from 'lucide-react';

const InterviewPrep = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [session, setSession] = useState(null);
  
  const [loading, setLoading] = useState(false);
  
  // Chat state
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, loading]);

  useEffect(() => {
    // Fetch resumes to select from
    const fetchResumes = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user'))?.token;
        const { data } = await axios.get('http://localhost:5000/api/resume/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setResumes(data);
        if (data.length > 0) setSelectedResume(data[0]._id);
      } catch (error) {
        console.error('Failed to fetch resumes');
      }
    };
    fetchResumes();
  }, []);

  const generateInterview = async () => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      const { data } = await axios.post('http://localhost:5000/api/interview/analyze', {
        resumeId: selectedResume,
        jobDescription: jobDesc
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSession(data);
      setChatHistory([
        { role: 'ai', text: `Welcome to your mock interview! Let's get started.\n\nQuestion 1: ${data.questions[0].questionText}` }
      ]);
      setCurrentQIndex(0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim()) return;

    const currentAnswer = userAnswer;
    setUserAnswer('');
    setChatHistory(prev => [...prev, { role: 'user', text: currentAnswer }]);
    
    // Disable input while analyzing
    setLoading(true);

    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      const { data } = await axios.post('http://localhost:5000/api/interview/mock', {
        sessionId: session.sessionId,
        questionIndex: currentQIndex,
        answerText: currentAnswer
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const feedbackText = `Feedback (Score: ${data.score}/10): ${data.clarity}. ${data.improvements}`;
      
      // Update chat with feedback
      setChatHistory(prev => [...prev, { role: 'system', text: feedbackText }]);

      // Move to next question or complete
      if (currentQIndex + 1 < session.questions.length) {
        setTimeout(() => {
          setChatHistory(prev => [...prev, { 
            role: 'ai', 
            text: `Question ${currentQIndex + 2}: ${session.questions[currentQIndex + 1].questionText}` 
          }]);
          setCurrentQIndex(currentQIndex + 1);
          setLoading(false);
        }, 1000);
      } else {
        setTimeout(() => {
          setChatHistory(prev => [...prev, { role: 'ai', text: 'Interview Complete! Great job practicing.' }]);
          setInterviewComplete(true);
          setLoading(false);
        }, 1000);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-[calc(100vh-73px)] bg-brand-bg flex items-center justify-center">
        <div className="container mx-auto p-6 max-w-4xl relative">
          <div className="absolute top-0 right-10 w-64 h-64 bg-accent-purple/10 rounded-full filter blur-[120px] z-0 pointer-events-none"></div>
          <div className="glass-card rounded-[2.5rem] p-10 relative z-10">
            <div className="flex items-center gap-6 mb-10 border-b border-white/5 pb-8">
              <div className="bg-accent-purple/10 p-5 rounded-3xl border border-accent-purple/30 shadow-inner">
                <MessageCircle className="w-10 h-10 text-accent-purple" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-white tracking-tight">AI Mock <span className="text-gradient">Interview Prep</span></h1>
                <p className="text-text-muted mt-2 font-medium text-lg">Practice realistic interview questions tailored to your exact resume</p>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-3 ml-1">Select Your Base Resume</label>
                {resumes.length === 0 ? (
                  <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-2xl">
                    <p className="text-orange-400 font-medium">You don't have any saved resumes yet!</p>
                    <a href="/builder" className="text-brand-400 font-bold hover:underline mt-2 inline-block">Create a Resume first &rarr;</a>
                  </div>
                ) : (
                  <select 
                    className="w-full p-4.5 bg-black/20 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-accent-purple/50 focus:border-accent-purple transition-all font-medium text-white"
                    value={selectedResume}
                    onChange={(e) => setSelectedResume(e.target.value)}
                  >
                    <option value="" className="text-gray-900">-- Let's begin by selecting a Resume --</option>
                    {resumes.map(r => (
                      <option key={r._id} value={r._id} className="text-gray-900">{r.resumeData?.personal?.name || 'Untitled'}'s Resume (Template: {r.templateId})</option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-text-secondary mb-3 ml-1">Target Job Description (Highly Recommended)</label>
                <textarea 
                  className="w-full h-40 p-4.5 bg-black/20 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-accent-purple/50 focus:border-accent-purple resize-none transition-all font-medium text-sm text-white placeholder-white/20"
                  placeholder="Paste the job description here so we can generate targeted role-specific questions..."
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                />
              </div>

              <button 
                onClick={generateInterview}
                disabled={loading || !selectedResume}
                className="w-full py-5 mt-4 bg-gradient-to-r from-brand-600 to-accent-purple hover:from-brand-500 hover:to-accent-purple/80 text-white font-black text-lg rounded-2xl transition-all flex items-center justify-center gap-3 disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] active:scale-[0.98] disabled:shadow-none"
              >
                {loading ? 'Initializing Simulation...' : <><PlayCircle className="w-7 h-7"/> Start Mock Interview Session</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-bg min-h-[calc(100vh-73px)] flex flex-col items-center pt-8 overflow-hidden relative">
      <div className="absolute top-0 right-10 w-64 h-64 bg-accent-purple/10 rounded-full filter blur-[120px] z-0 pointer-events-none"></div>

      <div className="container mx-auto p-4 max-w-4xl h-[calc(100vh-100px)] flex flex-col relative z-10 w-full">
        <div className="glass-card rounded-t-3xl shadow-lg border-b-0 p-5 flex justify-between items-center z-10">
          <h2 className="font-bold tracking-tight text-white flex items-center gap-3 text-xl">
            <div className="p-2 bg-accent-purple/10 rounded-lg border border-accent-purple/20">
               <MessageCircle className="text-accent-purple w-5 h-5"/>
            </div>
            Active Interview Session
          </h2>
          <div className="text-sm font-bold text-brand-400 bg-brand-500/10 border border-brand-500/20 px-4 py-1.5 rounded-full shadow-sm">
            Progress: {currentQIndex + 1} / {session.questions.length}
          </div>
        </div>

        <div className="flex-1 bg-brand-surface/50 backdrop-blur-sm overflow-y-auto p-6 space-y-6 shadow-inner custom-scrollbar border-x border-white/5">
          {chatHistory.map((chat, idx) => (
            <div key={idx} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
              <div className={`max-w-[80%] p-5 rounded-2xl ${
                chat.role === 'user' ? 'bg-gradient-to-br from-brand-600 to-brand-500 text-white rounded-tr-sm shadow-md' : 
                chat.role === 'system' ? 'bg-accent-gold/10 border border-accent-gold/20 text-accent-gold rounded-tl-sm text-sm font-bold shadow-sm' :
                'bg-white/5 border border-white/10 text-text-secondary rounded-tl-sm shadow-sm font-medium'
              }`}>
                {chat.role === 'system' && <Award className="w-5 h-5 inline mr-2 text-accent-gold" />}
                <span className="whitespace-pre-wrap leading-relaxed">{chat.text}</span>
              </div>
            </div>
          ))}
          {loading && <div className="text-text-muted font-medium italic animate-pulse flex items-center gap-2"><div className="w-2 h-2 bg-accent-purple rounded-full animate-bounce"></div> Analyzing response...</div>}
          <div ref={chatEndRef} />
        </div>

        <div className="glass-card p-5 rounded-b-3xl shadow-lg border-t-0 p-5 z-10">
          {interviewComplete ? (
            <div className="text-center py-6 animate-fade-in-up">
              <h3 className="text-2xl font-black text-white mb-4">Practice makes perfect!</h3>
              <button 
                onClick={() => window.location.reload()} 
                className="btn-primary flex items-center justify-center gap-2 mx-auto px-8 py-4"
              >
                Start New Session <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex gap-4 items-end">
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={loading}
                placeholder="Type your response to the interviewer..."
                className="flex-1 bg-black/20 border border-white/10 p-4.5 rounded-2xl resize-none h-24 outline-none focus:ring-2 focus:ring-accent-purple/50 focus:border-accent-purple transition-all font-medium text-white placeholder-white/20"
              />
              <button 
                onClick={submitAnswer}
                disabled={loading || !userAnswer.trim()}
                className="h-16 w-16 mb-4 bg-gradient-to-r from-brand-600 to-accent-purple text-white rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl hover:opacity-90 transition-all disabled:opacity-50 active:scale-95 disabled:active:scale-100 shrink-0"
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewPrep;
