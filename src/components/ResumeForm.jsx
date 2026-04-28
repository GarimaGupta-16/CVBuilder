import { useState } from 'react';
import axios from 'axios';
import { Wand2, Plus, Trash2, Loader2 } from 'lucide-react';

const ResumeForm = ({ resumeData, setResumeData }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [enhancingIndex, setEnhancingIndex] = useState(null);

  const handleChange = (section, field, value, index = null) => {
    setResumeData((prev) => {
      const newData = { ...prev };
      if (index !== null) {
        newData[section][index][field] = value;
      } else {
        newData[section][field] = value;
      }
      return newData;
    });
  };

  const handleArrayChange = (index, value) => {
    setResumeData((prev) => {
      const newSkills = [...prev.skills];
      newSkills[index] = value;
      return { ...prev, skills: newSkills };
    });
  };

  const addArrayItem = (section, emptyItem) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: [...(prev[section] || []), emptyItem]
    }));
  };

  const removeArrayItem = (section, index) => {
    setResumeData((prev) => {
      const newData = [...prev[section]];
      newData.splice(index, 1);
      return { ...prev, [section]: newData };
    });
  };

  const generateSummary = async () => {
    setLoadingSummary(true);
    try {
      const role = resumeData.experience?.[0]?.role || 'Professional';
      const skills = resumeData.skills?.filter(s => s).join(', ') || 'various skills';
      const experience = resumeData.experience?.map(e => e.company).join(', ') || '';
      
      const { data } = await axios.post('http://localhost:5000/api/generate-summary', { 
        role, 
        skills,
        experience
      });
      handleChange('personal', 'summary', data.summary);
    } catch (err) {
      console.error('Failed to generate summary:', err);
    } finally {
      setLoadingSummary(false);
    }
  };

  const enhanceBullets = async (section, index, text, role) => {
    if (!text) return;
    setEnhancingIndex(`${section}-${index}`);
    try {
      const { data } = await axios.post('http://localhost:5000/api/enhance-bullets', { text, role });
      handleChange(section, 'description', data.enhancedText, index);
    } catch (err) {
      console.error('Failed to enhance bullets:', err);
    } finally {
      setEnhancingIndex(null);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' }
  ];

  return (
    <div className="w-full h-full flex flex-col text-gray-800 dark:text-gray-200">
      <div className="flex overflow-x-auto space-x-2 mb-6 pb-2 border-b border-gray-200 dark:border-gray-800 custom-scrollbar shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-semibold rounded-xl whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
        {/* PERSONAL */}
        {activeTab === 'personal' && (
          <div className="space-y-4 animate-fade-in-up">
            <h3 className="text-xl font-bold mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Full Name</label>
                <input
                  type="text"
                  value={resumeData.personal?.name || ''}
                  onChange={(e) => handleChange('personal', 'name', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition"
                  placeholder="e.g. Jane Doe"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
                <input
                  type="email"
                  value={resumeData.personal?.email || ''}
                  onChange={(e) => handleChange('personal', 'email', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition"
                  placeholder="jane@example.com"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Phone</label>
                <input
                  type="text"
                  value={resumeData.personal?.phone || ''}
                  onChange={(e) => handleChange('personal', 'phone', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition"
                  placeholder="+1 234 567 890"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Location</label>
                <input
                  type="text"
                  value={resumeData.personal?.location || ''}
                  onChange={(e) => handleChange('personal', 'location', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition"
                  placeholder="New York, NY"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Website / LinkedIn</label>
                <input
                  type="text"
                  value={resumeData.personal?.website || ''}
                  onChange={(e) => handleChange('personal', 'website', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition"
                  placeholder="linkedin.com/in/janedoe"
                />
              </div>
              <div className="space-y-2 sm:col-span-2 mt-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Professional Summary</label>
                  <button 
                    onClick={generateSummary}
                    disabled={loadingSummary}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-brand-500 to-accent-purple rounded-lg hover:opacity-90 transition shadow-md disabled:opacity-50"
                  >
                    {loadingSummary ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                    {loadingSummary ? 'Generating...' : 'AI Generate'}
                  </button>
                </div>
                <textarea
                  value={resumeData.personal?.summary || ''}
                  onChange={(e) => handleChange('personal', 'summary', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition min-h-[120px]"
                  placeholder="A brief summary of your professional background..."
                />
              </div>
            </div>
          </div>
        )}

        {/* EXPERIENCE */}
        {activeTab === 'experience' && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Work Experience</h3>
              <button 
                onClick={() => addArrayItem('experience', { company: '', role: '', startDate: '', endDate: '', description: '' })}
                className="flex items-center gap-1 text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 transition"
              >
                <Plus className="w-4 h-4" /> Add Experience
              </button>
            </div>
            
            {(!resumeData.experience || resumeData.experience.length === 0) && (
              <p className="text-gray-500 text-sm italic">No experience added yet.</p>
            )}

            {resumeData.experience?.map((exp, index) => (
              <div key={index} className="p-4 border border-gray-200 dark:border-gray-800 rounded-2xl space-y-4 bg-white/50 dark:bg-gray-900/50">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300">Experience #{index + 1}</h4>
                  <button onClick={() => removeArrayItem('experience', index)} className="text-red-500 hover:text-red-600 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">Role/Title</label>
                    <input type="text" value={exp.role || ''} onChange={(e) => handleChange('experience', 'role', e.target.value, index)} className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-1 focus:ring-brand-500 outline-none" placeholder="Software Engineer" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">Company</label>
                    <input type="text" value={exp.company || ''} onChange={(e) => handleChange('experience', 'company', e.target.value, index)} className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-1 focus:ring-brand-500 outline-none" placeholder="Tech Corp Inc." />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">Start Date</label>
                    <input type="text" value={exp.startDate || ''} onChange={(e) => handleChange('experience', 'startDate', e.target.value, index)} className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-1 focus:ring-brand-500 outline-none" placeholder="Jan 2020" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">End Date</label>
                    <input type="text" value={exp.endDate || ''} onChange={(e) => handleChange('experience', 'endDate', e.target.value, index)} className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-1 focus:ring-brand-500 outline-none" placeholder="Present" />
                  </div>
                  <div className="space-y-2 sm:col-span-2 mt-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs text-gray-500">Description & Achievements</label>
                      <button 
                        onClick={() => enhanceBullets('experience', index, exp.description, exp.role)}
                        disabled={enhancingIndex === `experience-${index}` || !exp.description}
                        className="flex items-center gap-1 px-2 py-1 text-xs font-bold text-accent-purple bg-accent-purple/10 border border-accent-purple/20 rounded hover:bg-accent-purple/20 transition disabled:opacity-50"
                      >
                        {enhancingIndex === `experience-${index}` ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                        AI Enhance
                      </button>
                    </div>
                    <textarea value={exp.description || ''} onChange={(e) => handleChange('experience', 'description', e.target.value, index)} className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-1 focus:ring-brand-500 outline-none min-h-[100px]" placeholder="• Developed new features...&#10;• Improved performance by 20%..." />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EDUCATION */}
        {activeTab === 'education' && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Education</h3>
              <button onClick={() => addArrayItem('education', { institution: '', degree: '', year: '', grade: '' })} className="flex items-center gap-1 text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 transition">
                <Plus className="w-4 h-4" /> Add Education
              </button>
            </div>
            
            {(!resumeData.education || resumeData.education.length === 0) && (
              <p className="text-gray-500 text-sm italic">No education added yet.</p>
            )}

            {resumeData.education?.map((edu, index) => (
              <div key={index} className="p-4 border border-gray-200 dark:border-gray-800 rounded-2xl space-y-4 bg-white/50 dark:bg-gray-900/50">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300">Education #{index + 1}</h4>
                  <button onClick={() => removeArrayItem('education', index)} className="text-red-500 hover:text-red-600 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">Institution</label>
                    <input type="text" value={edu.institution || ''} onChange={(e) => handleChange('education', 'institution', e.target.value, index)} className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none" placeholder="University of Technology" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">Degree</label>
                    <input type="text" value={edu.degree || ''} onChange={(e) => handleChange('education', 'degree', e.target.value, index)} className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none" placeholder="B.S. Computer Science" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">Year</label>
                    <input type="text" value={edu.year || ''} onChange={(e) => handleChange('education', 'year', e.target.value, index)} className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none" placeholder="2018 - 2022" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">Grade / GPA</label>
                    <input type="text" value={edu.grade || ''} onChange={(e) => handleChange('education', 'grade', e.target.value, index)} className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none" placeholder="3.8 GPA" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PROJECTS */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Projects</h3>
              <button onClick={() => addArrayItem('projects', { name: '', techStack: '', link: '', description: '' })} className="flex items-center gap-1 text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 transition">
                <Plus className="w-4 h-4" /> Add Project
              </button>
            </div>
            
            {(!resumeData.projects || resumeData.projects.length === 0) && (
              <p className="text-gray-500 text-sm italic">No projects added yet.</p>
            )}

            {resumeData.projects?.map((proj, index) => (
              <div key={index} className="p-4 border border-gray-200 dark:border-gray-800 rounded-2xl space-y-4 bg-white/50 dark:bg-gray-900/50">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300">Project #{index + 1}</h4>
                  <button onClick={() => removeArrayItem('projects', index)} className="text-red-500 hover:text-red-600 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">Project Name</label>
                    <input type="text" value={proj.name || ''} onChange={(e) => handleChange('projects', 'name', e.target.value, index)} className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none" placeholder="E-commerce App" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">Tech Stack</label>
                    <input type="text" value={proj.techStack || ''} onChange={(e) => handleChange('projects', 'techStack', e.target.value, index)} className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none" placeholder="React, Node.js, MongoDB" />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs text-gray-500">Link</label>
                    <input type="text" value={proj.link || ''} onChange={(e) => handleChange('projects', 'link', e.target.value, index)} className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none" placeholder="github.com/yourusername/project" />
                  </div>
                  <div className="space-y-2 sm:col-span-2 mt-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs text-gray-500">Description</label>
                      <button 
                        onClick={() => enhanceBullets('projects', index, proj.description, 'Developer')}
                        disabled={enhancingIndex === `projects-${index}` || !proj.description}
                        className="flex items-center gap-1 px-2 py-1 text-xs font-bold text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 rounded hover:bg-accent-cyan/20 transition disabled:opacity-50"
                      >
                        {enhancingIndex === `projects-${index}` ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                        AI Enhance
                      </button>
                    </div>
                    <textarea value={proj.description || ''} onChange={(e) => handleChange('projects', 'description', e.target.value, index)} className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none min-h-[80px]" placeholder="Briefly describe what you built..." />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SKILLS */}
        {activeTab === 'skills' && (
          <div className="space-y-6 animate-fade-in-up">
            <h3 className="text-xl font-bold mb-4">Skills</h3>
            <div className="space-y-3">
              {resumeData.skills?.map((skill, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={skill || ''}
                    onChange={(e) => handleArrayChange(index, e.target.value)}
                    className="flex-1 p-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                    placeholder="e.g. JavaScript, Python, React"
                  />
                  <button onClick={() => removeArrayItem('skills', index)} className="text-red-500 hover:text-red-600 p-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button onClick={() => addArrayItem('skills', '')} className="flex items-center gap-1 text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 transition mt-2">
                <Plus className="w-4 h-4" /> Add Skill
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeForm;
