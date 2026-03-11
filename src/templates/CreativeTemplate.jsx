const CreativeTemplate = ({ data }) => {
  const { personal, experience, education, skills, projects } = data;

  return (
    <div className="w-full h-full min-h-[1056px] text-gray-800 bg-[#f9fafb] relative overflow-hidden">
      {/* Abstract Design Elements */}
      <div className="absolute top-[-100px] left-[-100px] w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 z-0"></div>
      <div className="absolute top-[20%] right-[-50px] w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 z-0"></div>
      <div className="absolute bottom-[-100px] left-[20%] w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 z-0"></div>

      <div className="relative z-10 p-12">
        <header className="mb-12">
          <h1 className="text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
            {personal?.name || 'Your Name'}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm font-bold text-gray-600 bg-white/50 backdrop-blur px-4 py-2 rounded-xl inline-flex border border-white">
            {personal?.email && <span>{personal.email}</span>}
            {personal?.phone && <span>{personal.phone}</span>}
            {personal?.location && <span>{personal.location}</span>}
          </div>
        </header>

        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-5 space-y-10">
            {personal?.summary && (
              <div>
                <h3 className="text-2xl font-bold mb-4 font-serif italic text-gray-400">Profile</h3>
                <p className="text-sm leading-relaxed text-gray-700 bg-white/60 p-5 rounded-2xl shadow-sm border border-white/40 backdrop-blur-sm">
                  {personal.summary}
                </p>
              </div>
            )}

            {skills && skills.length > 0 && skills[0] !== '' && (
              <div>
                <h3 className="text-2xl font-bold mb-4 font-serif italic text-gray-400">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.filter(s => s).map((s, i) => (
                    <span key={i} className="px-4 py-2 bg-white shadow-sm border border-gray-100 rounded-full text-sm font-semibold text-gray-800">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {education && education.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold mb-4 font-serif italic text-gray-400">Education</h3>
                {education.map((edu, idx) => (
                  <div key={idx} className="mb-4">
                    <h4 className="font-bold">{edu.degree}</h4>
                    <p className="text-sm text-gray-600">{edu.institution} • {edu.year}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="col-span-7 space-y-10">
            {experience && experience.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold mb-6 font-serif italic text-gray-400">Experience</h3>
                <div className="space-y-8">
                  {experience.map((exp, idx) => (
                    <div key={idx} className="relative pl-6 border-l-2 border-pink-200">
                      <div className="absolute w-4 h-4 rounded-full bg-gradient-to-tr from-pink-400 to-yellow-400 -left-[9px] top-1"></div>
                      <h4 className="text-xl font-bold text-gray-800">{exp.role}</h4>
                      <div className="text-sm font-medium text-pink-500 mb-2">{exp.company} | {exp.startDate} - {exp.endDate}</div>
                      <p className="text-sm text-gray-600">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {projects && projects.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold mb-6 font-serif italic text-gray-400">Projects</h3>
                <div className="grid grid-cols-2 gap-4">
                  {projects.map((proj, idx) => (
                    <div key={idx} className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-white">
                      <h4 className="font-bold text-gray-800 mb-1">{proj.name}</h4>
                      <p className="text-xs font-semibold text-yellow-600 mb-2">{proj.techStack}</p>
                      <p className="text-xs text-gray-600">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;
