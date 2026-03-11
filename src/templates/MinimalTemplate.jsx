const MinimalTemplate = ({ data }) => {
  const { personal, experience, education, skills, projects } = data;

  return (
    <div className="p-10 font-sans text-gray-900 leading-tight">
      {/* Header */}
      <header className="text-center border-b-2 border-gray-800 pb-4 mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">{personal?.name || 'Your Name'}</h1>
        <div className="flex justify-center gap-4 text-sm font-medium">
          {personal?.email && <span>{personal.email}</span>}
          {personal?.phone && <span>• {personal.phone}</span>}
          {personal?.location && <span>• {personal.location}</span>}
          {personal?.website && <span>• {personal.website}</span>}
        </div>
      </header>

      {/* Summary */}
      {personal?.summary && (
        <section className="mb-6">
          <p className="text-sm text-justify">{personal.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 tracking-widest">Experience</h2>
          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between font-bold text-sm">
                  <span>{exp.role}</span>
                  <span>{exp.startDate} - {exp.endDate}</span>
                </div>
                <div className="text-sm italic mb-1">{exp.company}</div>
                <p className="text-sm text-gray-800">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 tracking-widest">Education</h2>
          {education.map((edu, idx) => (
            <div key={idx} className="mb-2">
              <div className="flex justify-between font-bold text-sm">
                <span>{edu.degree}</span>
                <span>{edu.year}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="italic">{edu.institution}</span>
                <span>{edu.grade}</span>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 tracking-widest">Projects</h2>
          {projects.map((proj, idx) => (
            <div key={idx} className="mb-3 text-sm">
              <span className="font-bold">{proj.name}</span> 
              {proj.techStack && <span className="font-medium italic text-gray-600"> | {proj.techStack}</span>}
              {proj.link && <span className="text-blue-600"> | {proj.link}</span>}
              <p className="mt-1">{proj.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && skills[0] !== '' && (
        <section>
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 tracking-widest">Skills</h2>
          <p className="text-sm">{skills.filter(s => s).join(', ')}</p>
        </section>
      )}
    </div>
  );
};

export default MinimalTemplate;
