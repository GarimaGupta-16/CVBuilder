import React, { useState, useEffect } from 'react';
import { LayoutTemplate } from 'lucide-react';

// Import templates directly (not lazy-loaded) for better PDF capture
import MinimalTemplate from '../templates/MinimalTemplate';
import ModernTemplate from '../templates/ModernTemplate';
import ProfessionalTemplate from '../templates/ProfessionalTemplate';
import CreativeTemplate from '../templates/CreativeTemplate';
import HarvardTemplate from '../templates/HarvardTemplate';
import TechTemplate from '../templates/TechTemplate';

const ResumePreview = ({ resumeData, templateId, setTemplateId }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Simulate template loading
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, [templateId]);
  
  const renderTemplate = () => {
    if (isLoading) {
      return <div className="flex items-center justify-center p-20 text-gray-400"><LayoutTemplate className="animate-spin w-8 h-8 mr-3"/> Loading template...</div>;
    }
    
    switch (templateId) {
      case 'creative':
        return <CreativeTemplate data={resumeData} />;
      case 'professional':
        return <ProfessionalTemplate data={resumeData} />;
      case 'modern':
        return <ModernTemplate data={resumeData} />;
      case 'harvard':
        return <HarvardTemplate data={resumeData} />;
      case 'tech':
        return <TechTemplate data={resumeData} />;
      case 'minimal':
      default:
        return <MinimalTemplate data={resumeData} />;
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-[800px]">
      <div className="mb-4 flex flex-wrap gap-2 print:hidden">
        {['minimal', 'modern', 'professional', 'creative', 'harvard', 'tech'].map((id) => (
          <button
            key={id}
            onClick={() => setTemplateId(id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              templateId === id 
                ? 'bg-blue-600 text-white shadow' 
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {id.charAt(0).toUpperCase() + id.slice(1)}
          </button>
        ))}
      </div>

      <div 
        id="resume-preview" 
        className="w-full bg-white shadow-2xl origin-top mx-auto overflow-y-auto print:shadow-none print:m-0 print:p-0 min-h-[1056px] text-black shrink-0 relative"
      >
        <div id="resume-content" className="w-full h-full bg-white">
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
