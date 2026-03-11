import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  templateId: {
    type: String,
    default: 'minimal'
  },
  resumeData: {
    personal: {
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      summary: { type: String, default: '' },
      website: { type: String, default: '' }
    },
    experience: [{
      role: String,
      company: String,
      startDate: String,
      endDate: String,
      description: String
    }],
    education: [{
      degree: String,
      institution: String,
      year: String,
      grade: String
    }],
    skills: [{ type: String }],
    projects: [{
      name: String,
      techStack: String,
      description: String,
      link: String
    }]
  }
}, { timestamps: true });

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
