import React from 'react';

const TechTemplate = ({ data }) => {
  const { personal, experience, education, skills, projects } = data;

  return (
    <div className="p-10 font-sans text-gray-900 leading-relaxed bg-white h-full">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">{personal?.name || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-x-4 text-sm font-medium text-gray-600">
          {personal?.email && <span>{personal.email}</span>}
          {personal?.phone && <span>{personal.phone}</span>}
          {personal?.location && <span>{personal.location}</span>}
          {personal?.website && <a href={`https://${personal.website.replace(/^https?:\/\//, '')}`} className="text-blue-600 hover:underline">{personal.website}</a>}
        </div>
      </header>

      {/* Summary */}
      {personal?.summary && (
        <section className="mb-6">
          <p className="text-sm text-gray-700">{personal.summary}</p>
        </section>
      )}

      {/* Technical Skills - Prominent for Tech Template */}
      {skills && skills.length > 0 && skills[0] !== '' && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 border-b-2 border-gray-200 pb-1 mb-3">Technical Skills</h2>
          <div className="flex flex-wrap gap-2 text-sm">
            {skills.filter(s => s).map((skill, idx) => (
              <span key={idx} className="bg-gray-100 text-gray-800 px-2 py-1 rounded font-medium">{skill}</span>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 border-b-2 border-gray-200 pb-1 mb-4">Professional Experience</h2>
          <div className="space-y-5">
            {experience.map((exp, idx) => (
              <div key={idx} className="text-sm">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-base font-bold text-gray-900">{exp.role}</h3>
                  <span className="text-gray-500 font-medium whitespace-nowrap ml-4">{exp.startDate} – {exp.endDate}</span>
                </div>
                <div className="font-semibold text-gray-700 mb-2">{exp.company}</div>
                {exp.description && (
                  <ul className="list-disc list-outside ml-5 space-y-1 text-gray-700">
                    {exp.description.split('\n').map((line, i) => {
                      const cleanLine = line.replace(/^[•\-\*]\s*/, '').trim();
                      return cleanLine ? <li key={i}>{cleanLine}</li> : null;
                    })}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 border-b-2 border-gray-200 pb-1 mb-4">Selected Projects</h2>
          <div className="space-y-4">
            {projects.map((proj, idx) => (
              <div key={idx} className="text-sm">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-base font-bold text-gray-900">{proj.name}</span>
                  {proj.techStack && <span className="text-gray-500 font-medium">| {proj.techStack}</span>}
                  {proj.link && <a href={proj.link} className="text-blue-600 hover:underline ml-auto">{proj.link}</a>}
                </div>
                {proj.description && (
                  <ul className="list-disc list-outside ml-5 mt-1 space-y-1 text-gray-700">
                    {proj.description.split('\n').map((line, i) => {
                      const cleanLine = line.replace(/^[•\-\*]\s*/, '').trim();
                      return cleanLine ? <li key={i}>{cleanLine}</li> : null;
                    })}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 border-b-2 border-gray-200 pb-1 mb-3">Education</h2>
          <div className="space-y-3">
            {education.map((edu, idx) => (
              <div key={idx} className="text-sm">
                <div className="flex justify-between font-bold text-gray-900">
                  <span>{edu.institution}</span>
                  <span className="text-gray-500 font-medium">{edu.year}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>{edu.degree}</span>
                  {edu.grade && <span className="font-medium">GPA: {edu.grade}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default TechTemplate;
