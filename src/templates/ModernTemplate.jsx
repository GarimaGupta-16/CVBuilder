const ModernTemplate = ({ data }) => {
  const { personal, experience, education, skills, projects } = data;

  return (
    <div className="flex h-full min-h-[1056px] text-gray-800 bg-white shadow-xl">
      {/* Sidebar Focus */}
      <div className="w-1/3 bg-[#1e293b] text-white p-8">
        <div className="mb-8 border-b border-gray-600 pb-6">
          <h1 className="text-4xl font-black leading-tight tracking-tight mb-2">
            {personal?.name ? personal.name.split(' ').join('\n') : "YOUR\nNAME"}
          </h1>
          {personal?.role && <h2 className="text-blue-400 font-medium tracking-wide mt-2">{personal.role}</h2>}
        </div>

        <div className="space-y-6">
          <div className="text-sm">
            <h3 className="uppercase tracking-widest text-xs font-bold text-gray-400 mb-3">Contact</h3>
            <ul className="space-y-2 text-gray-300">
              {personal?.email && <li><strong className="block text-white font-medium">Email</strong>{personal.email}</li>}
              {personal?.phone && <li><strong className="block text-white font-medium">Phone</strong>{personal.phone}</li>}
              {personal?.location && <li><strong className="block text-white font-medium">Location</strong>{personal.location}</li>}
              {personal?.website && <li><strong className="block text-white font-medium">Website</strong>{personal.website}</li>}
            </ul>
          </div>

          {skills && skills.length > 0 && skills[0] !== '' && (
            <div className="text-sm pt-4 border-t border-gray-600">
              <h3 className="uppercase tracking-widest text-xs font-bold text-gray-400 mb-3">Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {skills.filter(s => s).map((btn, i) => (
                  <span key={i} className="bg-gray-700/50 px-3 py-1 rounded text-gray-200">{btn}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-2/3 p-10 bg-gray-50">
        {personal?.summary && (
          <div className="mb-10">
            <h3 className="text-xl font-bold uppercase tracking-widest text-[#1e293b] mb-4 border-l-4 border-blue-500 pl-3">Profile</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{personal.summary}</p>
          </div>
        )}

        {experience && experience.length > 0 && (
          <div className="mb-10">
            <h3 className="text-xl font-bold uppercase tracking-widest text-[#1e293b] mb-6 border-l-4 border-blue-500 pl-3">Experience</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent pl-6 md:pl-0">
              {experience.map((exp, idx) => (
                <div key={idx} className="relative mb-6">
                  {/* Timeline dot */}
                  <div className="absolute w-3 h-3 bg-blue-500 rounded-full mt-1.5 -left-[1.65rem] border-2 border-white"></div>
                  <div className="flex flex-col mb-1.5">
                    <span className="text-lg font-bold text-slate-900">{exp.role}</span>
                    <span className="text-sm font-semibold text-blue-600">{exp.company} • <span className="text-gray-500 font-normal">{exp.startDate} - {exp.endDate}</span></span>
                  </div>
                  <p className="text-sm text-slate-600">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {projects && projects.length > 0 && (
          <div className="mb-10">
            <h3 className="text-xl font-bold uppercase tracking-widest text-[#1e293b] mb-4 border-l-4 border-blue-500 pl-3">Projects</h3>
            <div className="grid gap-4">
              {projects.map((proj, idx) => (
                <div key={idx} className="bg-white p-4 rounded shadow-sm border border-gray-100">
                  <div className="font-bold text-slate-800">{proj.name}</div>
                  <div className="text-xs text-blue-600 font-medium mb-2">{proj.techStack}</div>
                  <p className="text-sm text-slate-600">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {education && education.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-bold uppercase tracking-widest text-[#1e293b] mb-4 border-l-4 border-blue-500 pl-3">Education</h3>
            {education.map((edu, idx) => (
              <div key={idx} className="mb-3 text-sm">
                <div className="font-bold text-slate-800">{edu.degree}</div>
                <div className="text-slate-600">{edu.institution} • {edu.year}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernTemplate;
