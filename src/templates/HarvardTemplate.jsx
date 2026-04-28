import React from 'react';

const HarvardTemplate = ({ data }) => {
  const { personal, experience, education, skills, projects } = data;

  return (
    <div className="p-10 font-serif text-black leading-snug bg-white h-full">
      {/* Header */}
      <header className="text-center mb-4">
        <h1 className="text-3xl font-bold uppercase mb-1">{personal?.name || 'Your Name'}</h1>
        <div className="flex flex-wrap justify-center items-center gap-x-2 text-sm">
          {personal?.location && <span>{personal.location}</span>}
          {(personal?.location && (personal?.phone || personal?.email)) && <span>|</span>}
          {personal?.phone && <span>{personal.phone}</span>}
          {(personal?.phone && personal?.email) && <span>|</span>}
          {personal?.email && <span>{personal.email}</span>}
          {(personal?.website && personal?.email) && <span>|</span>}
          {personal?.website && <a href={`https://${personal.website.replace(/^https?:\/\//, '')}`} className="text-blue-800 underline">{personal.website}</a>}
        </div>
      </header>

      {/* Education - Often first in Harvard/Academic style */}
      {education && education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[15px] font-bold uppercase border-b border-black mb-2 tracking-wide">Education</h2>
          <div className="space-y-2">
            {education.map((edu, idx) => (
              <div key={idx} className="text-sm">
                <div className="flex justify-between font-bold">
                  <span>{edu.institution}</span>
                  <span className="font-normal">{edu.year}</span>
                </div>
                <div className="flex justify-between italic">
                  <span>{edu.degree}</span>
                  {edu.grade && <span className="font-normal">GPA: {edu.grade}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[15px] font-bold uppercase border-b border-black mb-2 tracking-wide">Experience</h2>
          <div className="space-y-3">
            {experience.map((exp, idx) => (
              <div key={idx} className="text-sm">
                <div className="flex justify-between font-bold">
                  <span>{exp.company}</span>
                  <span className="font-normal">{exp.startDate} – {exp.endDate}</span>
                </div>
                <div className="italic mb-1">{exp.role}</div>
                {exp.description && (
                  <ul className="list-disc list-outside ml-4 space-y-1">
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
        <section className="mb-4">
          <h2 className="text-[15px] font-bold uppercase border-b border-black mb-2 tracking-wide">Leadership & Projects</h2>
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={idx} className="text-sm">
                <div className="flex justify-between">
                  <span>
                    <span className="font-bold">{proj.name}</span>
                    {proj.techStack && <span className="italic"> ({proj.techStack})</span>}
                  </span>
                  {proj.link && <span className="text-blue-800 underline">{proj.link}</span>}
                </div>
                {proj.description && (
                  <ul className="list-disc list-outside ml-4 mt-1 space-y-1">
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

      {/* Skills & Summary */}
      <section className="mb-4">
        <h2 className="text-[15px] font-bold uppercase border-b border-black mb-2 tracking-wide">Skills & Interests</h2>
        <div className="text-sm space-y-1">
          {skills && skills.length > 0 && skills[0] !== '' && (
            <div>
              <span className="font-bold">Technical Skills: </span>
              {skills.filter(s => s).join(', ')}
            </div>
          )}
          {personal?.summary && (
            <div>
              <span className="font-bold">Profile: </span>
              {personal.summary}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HarvardTemplate;
