import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import ResumeForm from '../components/ResumeForm';
import ResumePreview from '../components/ResumePreview';
import { Save, Download, ArrowLeft, Wand2, X, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

const Builder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [resumeData, setResumeData] = useState({
    personal: { name: '', email: '', phone: '', location: '', summary: '', website: '' },
    experience: [],
    education: [],
    skills: [''],
    projects: []
  });
  const [templateId, setTemplateId] = useState('minimal');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showATSModal, setShowATSModal] = useState(false);
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsResults, setAtsResults] = useState(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user'))?.token;
        const { data } = await axios.get('http://localhost:5000/api/resume/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const currentResume = data.find(r => r._id === id);
        if (currentResume) {
          setResumeData(currentResume.resumeData || {
            personal: {}, experience: [], education: [], skills: [''], projects: []
          });
          setTemplateId(currentResume.templateId || 'minimal');
        } else {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Failed to fetch resume:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchResume();
  }, [id, navigate]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      await axios.put(`http://localhost:5000/api/resume/update/${id}`, {
        templateId,
        resumeData
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setTimeout(() => setSaving(false), 500);
    }
  };

  const downloadPDF = () => {
    const element = document.getElementById('resume-content');
    if (!element) {
      alert('Resume preview not ready.');
      return;
    }
    
    const textContent = element.innerText?.trim();
    if (!textContent || textContent.includes('Loading template')) {
      alert('Resume is still loading. Please wait and try again.');
      return;
    }
    
    // Open print dialog directly
    window.print();
  };

  const convertResumeToText = () => {
    let text = '';
    
    // Personal Info
    if (resumeData.personal) {
      text += `${resumeData.personal.name || ''}\n`;
      if (resumeData.personal.email) text += `Email: ${resumeData.personal.email}\n`;
      if (resumeData.personal.phone) text += `Phone: ${resumeData.personal.phone}\n`;
      if (resumeData.personal.location) text += `Location: ${resumeData.personal.location}\n`;
      if (resumeData.personal.website) text += `Website: ${resumeData.personal.website}\n`;
      if (resumeData.personal.summary) text += `\nSummary:\n${resumeData.personal.summary}\n`;
    }
    
    // Experience
    if (resumeData.experience && resumeData.experience.length > 0) {
      text += '\nEXPERIENCE\n';
      resumeData.experience.forEach(exp => {
        text += `${exp.role || ''} at ${exp.company || ''} (${exp.startDate || ''} - ${exp.endDate || ''})\n`;
        text += `${exp.description || ''}\n\n`;
      });
    }
    
    // Education
    if (resumeData.education && resumeData.education.length > 0) {
      text += '\nEDUCATION\n';
      resumeData.education.forEach(edu => {
        text += `${edu.degree || ''} in ${edu.field || ''} from ${edu.school || ''} (${edu.graduationYear || ''})\n`;
        if (edu.details) text += `${edu.details}\n`;
        text += '\n';
      });
    }
    
    // Skills
    if (resumeData.skills && resumeData.skills.filter(s => s).length > 0) {
      text += '\nSKILLS\n';
      text += resumeData.skills.filter(s => s).join(', ') + '\n';
    }
    
    // Projects
    if (resumeData.projects && resumeData.projects.length > 0) {
      text += '\nPROJECTS\n';
      resumeData.projects.forEach(proj => {
        text += `${proj.name || ''}\n`;
        text += `${proj.description || ''}\n`;
        if (proj.link) text += `Link: ${proj.link}\n`;
        text += '\n';
      });
    }
    
    return text;
  };

  const analyzeATS = async () => {
    setAtsLoading(true);
    try {
      const resumeText = convertResumeToText();
      
      console.log('📋 Sending resume to ATS analysis:', resumeText.substring(0, 200));
      
      const { data } = await axios.post('http://localhost:5000/api/ats', {
        resumeText,
        jobDescription: '' // Empty job description for resume-only analysis
      });
      
      console.log('✅ ATS Analysis result:', data);
      setAtsResults(data);
    } catch (error) {
      console.error('❌ ATS Analysis failed:', error.response?.data || error.message);
      alert('Failed to analyze ATS: ' + (error.response?.data?.message || error.message));
    } finally {
      setAtsLoading(false);
    }
  };

  // Auto-analyze when modal opens
  useEffect(() => {
    if (showATSModal && !atsResults) {
      analyzeATS();
    }
  }, [showATSModal]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-500 dark:text-gray-400">
      Loading builder...
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-73px)] overflow-hidden bg-gray-50 dark:bg-gray-950 transition-colors duration-300 print:h-auto print:bg-white print:overflow-visible">
      {/* Builder Toolbar */}
      <div className="glass border-b border-gray-200 dark:border-gray-800 px-6 py-3 flex flex-col sm:flex-row justify-between items-center z-20 shadow-sm gap-4 sm:gap-0 print:hidden">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-600 dark:text-gray-400 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <h2 className="font-bold text-gray-800 dark:text-white line-clamp-1">
              {resumeData.personal.name ? `${resumeData.personal.name}'s Resume` : 'Untitled Resume'}
            </h2>
            <span className="text-xs bg-brand-50 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300 px-3 py-1 rounded-full font-bold border border-brand-200 dark:border-brand-800">
              Template: {templateId}
            </span>
          </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button 
            onClick={() => setShowATSModal(true)}
            className="flex items-center whitespace-nowrap gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-bold rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition border border-indigo-200 dark:border-indigo-800"
          >
            <Wand2 className="w-4 h-4" /> ATS Check
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center whitespace-nowrap gap-2 px-4 py-2 glass text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
          </button>
          <button 
            onClick={async () => {
              // Save first, then print
              setSaving(true);
              try {
                const token = JSON.parse(localStorage.getItem('user'))?.token;
                await axios.put(`http://localhost:5000/api/resume/update/${id}`, {
                  templateId,
                  resumeData
                }, {
                  headers: { Authorization: `Bearer ${token}` }
                });
              } catch (error) {
                console.error('Failed to save:', error);
              } finally {
                setSaving(false);
              }
              
              // Open print dialog
              setTimeout(() => downloadPDF(), 300);
            }}
            disabled={saving}
            className="flex items-center whitespace-nowrap gap-2 px-4 py-2 text-white font-bold rounded-xl transition bg-brand-600 hover:bg-brand-500 shadow-[0_0_15px_rgba(13,148,136,0.2)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            {saving ? 'Saving...' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative print:block print:overflow-visible print:bg-white">
        {/* Left Form Panel */}
        <div className="w-full md:w-1/2 overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 custom-scrollbar relative z-10 print:hidden">
          <ResumeForm resumeData={resumeData} setResumeData={setResumeData} />
        </div>

        {/* Right Preview Panel */}
        <div className="w-full md:w-1/2 overflow-y-auto bg-gray-100 dark:bg-gray-950 p-8 flex justify-center custom-scrollbar relative print:w-full print:p-0 print:bg-white print:overflow-visible print:flex print:justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-brand-400/10 dark:bg-brand-600/10 filter blur-[100px] pointer-events-none print:hidden"></div>
          
          <div className="relative z-10 shrink-0 w-[816px] print:w-full print:max-w-none print:p-0">
            <ResumePreview resumeData={resumeData} templateId={templateId} setTemplateId={setTemplateId} />
          </div>
        </div>
      </div>

      {/* ATS Check Modal */}
      {showATSModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Resume ATS Score</h2>
              <button 
                onClick={() => {
                  setShowATSModal(false);
                  setAtsResults(null);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-6">
              {atsLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="animate-spin mb-4">
                    <Wand2 className="w-12 h-12 text-brand-600" />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 font-bold">Analyzing your resume...</p>
                </div>
              ) : atsResults ? (
                <div className="space-y-6">
                  {/* Score Circle */}
                  <div className="flex justify-center">
                    <div className="relative w-40 h-40 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="16" className="text-gray-200 dark:text-gray-700" />
                        <circle 
                          cx="80" cy="80" r="70" fill="none" 
                          stroke={atsResults.score > 75 ? '#10b981' : atsResults.score > 50 ? '#f59e0b' : '#ef4444'} 
                          strokeWidth="16" 
                          strokeDasharray={`${(atsResults.score / 100) * 440} 440`} 
                          strokeLinecap="round" 
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-5xl font-bold text-gray-900 dark:text-white">{atsResults.score}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400 font-bold">/ 100</span>
                      </div>
                    </div>
                  </div>

                  {/* Keywords Found */}
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                    <h3 className="text-lg font-bold text-green-900 dark:text-green-300 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Strong Points
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {atsResults.keywordMatch.map((kw, i) => (
                        <span key={i} className="px-3 py-1 bg-green-200 dark:bg-green-900/50 text-green-900 dark:text-green-300 rounded-lg text-sm font-bold">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing Elements */}
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800">
                    <h3 className="text-lg font-bold text-red-900 dark:text-red-300 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Areas to Improve
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {atsResults.missingKeywords.map((kw, i) => (
                        <span key={i} className="px-3 py-1 bg-red-200 dark:bg-red-900/50 text-red-900 dark:text-red-300 rounded-lg text-sm font-bold">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                    <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Tips to Improve
                    </h3>
                    <ul className="space-y-2">
                      {atsResults.suggestions.map((sug, i) => (
                        <li key={i} className="text-sm text-blue-800 dark:text-blue-200 flex gap-3">
                          <span className="font-bold shrink-0">{i + 1}.</span>
                          <span>{sug}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      setAtsResults(null);
                      analyzeATS();
                    }}
                    className="w-full py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-xl transition"
                  >
                    Recheck Score
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Builder;