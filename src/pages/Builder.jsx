import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import ResumeForm from '../components/ResumeForm';
import ResumePreview from '../components/ResumePreview';
import { Save, Download, ArrowLeft, Wand2 } from 'lucide-react';
import html2pdf from 'html2pdf.js';

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
      // Optionally show a success toast here
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setTimeout(() => setSaving(false), 500);
    }
  };

  const downloadPDF = () => {
    const element = document.getElementById('resume-preview');
    const opt = {
      margin:       0,
      filename:     `${resumeData.personal.name || 'resume'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500 dark:text-gray-400">Loading builder...</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-73px)] overflow-hidden bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Builder Toolbar */}
      <div className="glass border-b border-gray-200 dark:border-gray-800 px-6 py-3 flex flex-col sm:flex-row justify-between items-center z-20 shadow-sm gap-4 sm:gap-0">
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
            onClick={() => navigate('/ats')}
            className="flex items-center whitespace-nowrap gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-bold rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition border border-indigo-200 dark:border-indigo-800"
          >
            <Wand2 className="w-4 h-4" /> ATS Check
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center whitespace-nowrap gap-2 px-4 py-2 glass text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
          </button>
          <button 
            onClick={downloadPDF}
            className="flex items-center whitespace-nowrap gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl transition shadow-[0_0_15px_rgba(13,148,136,0.2)]"
          >
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Left Form Panel */}
        <div className="w-full md:w-1/2 overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 custom-scrollbar relative z-10">
          <ResumeForm resumeData={resumeData} setResumeData={setResumeData} />
        </div>

        {/* Right Preview Panel */}
        <div className="w-full md:w-1/2 overflow-y-auto bg-gray-100 dark:bg-gray-950 p-8 flex justify-center custom-scrollbar relative">
          {/* Subtle glow behind preview */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-brand-400/10 dark:bg-brand-600/10 filter blur-[100px] pointer-events-none"></div>
          
          <div className="relative z-10 shrink-0 w-[816px]">
            <ResumePreview resumeData={resumeData} templateId={templateId} setTemplateId={setTemplateId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;
