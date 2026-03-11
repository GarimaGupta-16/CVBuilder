const ProfessionalTemplate = ({ data }) => {
  const { personal, experience, education, skills, projects } = data;

  return (
    <div className="p-12 font-serif text-[#333] leading-relaxed bg-[#fefcfb]">
      {/* Header aligned center */}
      <header className="text-center mb-8 pb-4 border-b-2 border-gray-300">
        <h1 className="text-4xl font-semibold text-[#1a1a1a] tracking-tight mb-2 font-sans">{personal?.name || 'Your Name'}</h1>
        <p className="text-sm font-medium text-gray-600 flex justify-center gap-3">
          {personal?.email} {personal?.phone && `| ${personal.phone}`} {personal?.location && `| ${personal.location}`}
        </p>
      </header>

      {personal?.summary && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-[#1a1a1a] uppercase tracking-wider mb-2 font-sans">Professional Summary</h2>
          <p className="text-sm text-justify">{personal.summary}</p>
        </div>
      )}

      {experience && experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-[#1a1a1a] uppercase tracking-wider mb-4 font-sans">Work Experience</h2>
          <div className="space-y-5">
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-md font-bold font-sans">{exp.role}</h3>
                  <span className="text-sm font-medium text-gray-600">{exp.startDate} – {exp.endDate}</span>
                </div>
                <h4 className="text-sm font-semibold italic text-gray-700 mb-2">{exp.company}</h4>
                <p className="text-sm text-gray-800 whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-8">
        <div>
          {education && education.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-[#1a1a1a] uppercase tracking-wider mb-4 font-sans">Education</h2>
              {education.map((edu, idx) => (
                <div key={idx} className="mb-3">
                  <h3 className="text-sm font-bold font-sans">{edu.degree}</h3>
                  <p className="text-sm">{edu.institution}</p>
                  <p className="text-xs text-gray-500 font-medium mt-1">Class of {edu.year} {edu.grade && `| ${edu.grade}`}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          {skills && skills.length > 0 && skills[0] !== '' && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-[#1a1a1a] uppercase tracking-wider mb-4 font-sans">Core Competencies</h2>
              <ul className="list-disc pl-4 text-sm grid grid-cols-2 gap-x-2 gap-y-1">
                {skills.filter(s => s).map((s, idx) => (
                  <li key={idx} className="text-gray-800">{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      {/* Projects omitted for extreme professional simplicity, or optionally added */}
    </div>
  );
};

export default ProfessionalTemplate;
