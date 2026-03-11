import Resume from '../models/Resume.js';

export const createResume = async (req, res) => {
  try {
    const { templateId, resumeData } = req.body;
    
    // User ID is attached by the protect middleware
    const resume = await Resume.create({
      userId: req.user._id,
      templateId: templateId || 'minimal',
      resumeData: resumeData || {}
    });

    res.status(201).json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateResume = async (req, res) => {
  try {
    const { id } = req.params;
    const { templateId, resumeData } = req.body;

    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    resume.templateId = templateId || resume.templateId;
    resume.resumeData = resumeData || resume.resumeData;
    resume.updatedAt = Date.now();

    const updatedResume = await resume.save();
    res.json(updatedResume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;

    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await resume.deleteOne();
    res.json({ message: 'Resume removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
