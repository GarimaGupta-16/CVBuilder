import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

const Section = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="mb-6 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden glass-card transition-all duration-300 shadow-sm">
      <button 
        className="w-full flex justify-between items-center px-6 py-5 bg-white/50 dark:bg-gray-900/50 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-bold text-gray-900 dark:text-white text-lg tracking-tight">{title}</span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400 dark:text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500" />}
      </button>
      {isOpen && <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-white/30 dark:bg-gray-950/30">{children}</div>}
    </div>
  );
};

const ResumeForm = ({ resumeData, setResumeData }) => {
  
  const handlePersonalChange = (e) => {
    setResumeData({
      ...resumeData,
      personal: { ...resumeData.personal, [e.target.name]: e.target.value }
    });
  };

  const handleArrayChange = (section, index, e) => {
    const newArray = [...resumeData[section]];
    newArray[index][e.target.name] = e.target.value;
    setResumeData({ ...resumeData, [section]: newArray });
  };

  const addArrayItem = (section, template) => {
    setResumeData({ ...resumeData, [section]: [...resumeData[section], template] });
  };

  const removeArrayItem = (section, index) => {
    const newArray = resumeData[section].filter((_, i) => i !== index);
    setResumeData({ ...resumeData, [section]: newArray });
  };

  const handleSkillChange = (index, value) => {
    const newSkills = [...resumeData.skills];
    newSkills[index] = value;
    setResumeData({ ...resumeData, skills: newSkills });
  };

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <Section title="Personal Information" defaultOpen={true}>
        <div className="grid grid-cols-2 gap-4">
          <input name="name" placeholder="Full Name" value={resumeData.personal?.name || ''} onChange={handlePersonalChange} className="input-field col-span-2" />
          <input name="email" placeholder="Email" value={resumeData.personal?.email || ''} onChange={handlePersonalChange} className="input-field" />
          <input name="phone" placeholder="Phone" value={resumeData.personal?.phone || ''} onChange={handlePersonalChange} className="input-field" />
          <input name="location" placeholder="City, Country" value={resumeData.personal?.location || ''} onChange={handlePersonalChange} className="input-field" />
          <input name="website" placeholder="Portfolio / LinkedIn URL" value={resumeData.personal?.website || ''} onChange={handlePersonalChange} className="input-field" />
          <div className="col-span-2 space-y-2 mt-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Professional Summary</label>
              <button className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-800 px-3 py-1.5 rounded-lg flex items-center hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors shadow-sm">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" /> AI Generate
              </button>
            </div>
            <textarea name="summary" rows="4" placeholder="Brief professional summary..." value={resumeData.personal?.summary || ''} onChange={handlePersonalChange} className="input-field" />
          </div>
        </div>
      </Section>

      <Section title="Work Experience">
        {resumeData.experience?.map((exp, index) => (
          <div key={index} className="mb-6 p-5 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-900/50 relative group transition-colors">
            <button onClick={() => removeArrayItem('experience', index)} className="absolute top-5 right-5 text-red-400 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-gray-800 rounded-lg p-1.5 shadow-sm border border-red-100 dark:border-red-900/30">
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input name="role" placeholder="Job Title" value={exp.role || ''} onChange={(e) => handleArrayChange('experience', index, e)} className="input-field" />
              <input name="company" placeholder="Company Name" value={exp.company || ''} onChange={(e) => handleArrayChange('experience', index, e)} className="input-field" />
              <input name="startDate" placeholder="Start Date (e.g. Jan 2020)" value={exp.startDate || ''} onChange={(e) => handleArrayChange('experience', index, e)} className="input-field" />
              <input name="endDate" placeholder="End Date (e.g. Present)" value={exp.endDate || ''} onChange={(e) => handleArrayChange('experience', index, e)} className="input-field" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                 <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Description</label>
                <button className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-800 px-3 py-1.5 rounded-lg flex items-center hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Enhance Bullets
                </button>
              </div>
              <textarea name="description" rows="4" placeholder="Describe your responsibilities and achievements..." value={exp.description || ''} onChange={(e) => handleArrayChange('experience', index, e)} className="input-field" />
            </div>
          </div>
        ))}
        <button onClick={() => addArrayItem('experience', { role: '', company: '', startDate: '', endDate: '', description: '' })} className="flex items-center text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-bold text-sm transition-colors border border-dashed border-brand-200 dark:border-brand-800 w-full justify-center py-4 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-900/20 bg-white/50 dark:bg-gray-900/30">
          <Plus className="w-4 h-4 mr-2" /> Add New Experience
        </button>
      </Section>

      <Section title="Education">
        {resumeData.education?.map((edu, index) => (
          <div key={index} className="mb-6 p-5 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-900/50 relative group transition-colors">
            <button onClick={() => removeArrayItem('education', index)} className="absolute top-5 right-5 text-red-400 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-gray-800 rounded-lg p-1.5 shadow-sm border border-red-100 dark:border-red-900/30">
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="grid grid-cols-2 gap-4">
              <input name="degree" placeholder="Degree / Certificate" value={edu.degree || ''} onChange={(e) => handleArrayChange('education', index, e)} className="input-field col-span-2" />
              <input name="institution" placeholder="University / School" value={edu.institution || ''} onChange={(e) => handleArrayChange('education', index, e)} className="input-field" />
              <input name="year" placeholder="Graduation Year" value={edu.year || ''} onChange={(e) => handleArrayChange('education', index, e)} className="input-field" />
              <input name="grade" placeholder="GPA / Grade (Optional)" value={edu.grade || ''} onChange={(e) => handleArrayChange('education', index, e)} className="input-field col-span-2" />
            </div>
          </div>
        ))}
        <button onClick={() => addArrayItem('education', { degree: '', institution: '', year: '', grade: '' })} className="flex items-center text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-bold text-sm transition-colors border border-dashed border-brand-200 dark:border-brand-800 w-full justify-center py-4 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-900/20 bg-white/50 dark:bg-gray-900/30">
          <Plus className="w-4 h-4 mr-2" /> Add New Education
        </button>
      </Section>

      <Section title="Skills">
        <div className="flex flex-wrap gap-3 mb-4">
          {resumeData.skills?.map((skill, index) => (
            <div key={index} className="flex flex-col relative w-full sm:w-[calc(50%-0.375rem)]">
              <div className="flex bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-brand-500/50 focus-within:border-brand-500 transition-all shadow-sm">
                <input 
                  value={skill} 
                  onChange={(e) => handleSkillChange(index, e.target.value)} 
                  placeholder="e.g. React.js, Management"
                  className="w-full px-4 py-3 outline-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-medium text-sm"
                />
                <button onClick={() => {
                  const newSkills = resumeData.skills.filter((_, i) => i !== index);
                  setResumeData({ ...resumeData, skills: newSkills });
                }} className="px-4 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border-l border-gray-200 dark:border-gray-700 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => setResumeData({ ...resumeData, skills: [...resumeData.skills, ''] })} className="flex items-center text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-bold text-sm transition-colors border border-dashed border-brand-200 dark:border-brand-800 w-full justify-center py-4 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-900/20 bg-white/50 dark:bg-gray-900/30">
          <Plus className="w-4 h-4 mr-2" /> Add Skill
        </button>
      </Section>

      <Section title="Projects">
        {resumeData.projects?.map((proj, index) => (
          <div key={index} className="mb-6 p-5 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-900/50 relative group transition-colors">
             <button onClick={() => removeArrayItem('projects', index)} className="absolute top-5 right-5 text-red-400 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-gray-800 rounded-lg p-1.5 shadow-sm border border-red-100 dark:border-red-900/30">
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="grid grid-cols-2 gap-4 mb-4 mt-2">
              <input name="name" placeholder="Project Name" value={proj.name || ''} onChange={(e) => handleArrayChange('projects', index, e)} className="input-field" />
              <input name="link" placeholder="Live Link / GitHub" value={proj.link || ''} onChange={(e) => handleArrayChange('projects', index, e)} className="input-field" />
              <input name="techStack" placeholder="Tech Stack (e.g. React, Node.js)" value={proj.techStack || ''} onChange={(e) => handleArrayChange('projects', index, e)} className="input-field col-span-2" />
            </div>
            <textarea name="description" rows="3" placeholder="Describe the project and your role..." value={proj.description || ''} onChange={(e) => handleArrayChange('projects', index, e)} className="input-field" />
          </div>
        ))}
        <button onClick={() => addArrayItem('projects', { name: '', techStack: '', description: '', link: '' })} className="flex items-center text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-bold text-sm transition-colors border border-dashed border-brand-200 dark:border-brand-800 w-full justify-center py-4 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-900/20 bg-white/50 dark:bg-gray-900/30">
          <Plus className="w-4 h-4 mr-2" /> Add New Project
        </button>
      </Section>

      <style>{`
        .input-field {
          width: 100%;
          padding: 0.875rem 1rem;
          border-radius: 0.75rem;
          border: 1px solid var(--color-gray-200);
          background-color: var(--color-white);
          color: var(--color-gray-900);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 0.875rem;
          font-weight: 500;
        }
        
        .dark .input-field {
          border-color: var(--color-gray-700);
          background-color: var(--color-gray-900);
          color: var(--color-white);
        }

        .dark .input-field::placeholder {
           color: var(--color-gray-500);
        }

        .input-field:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.5); /* Brand color shadow */
          border-color: #14b8a6;
        }
      `}</style>
    </div>
  );
};

export default ResumeForm;
