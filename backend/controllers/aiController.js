import InterviewSession from '../models/InterviewSession.js';
import Resume from '../models/Resume.js';

// Mock Implementation. In a real scenario, you'd use OpenAI API here.

export const processAtsAnalysis = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;
    
    // Simulate AI Processing Delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock response
    res.json({
      score: Math.floor(Math.random() * 40) + 50, // 50-90 score
      keywordMatch: ['React', 'Node.js', 'Teamwork'],
      missingKeywords: ['Docker', 'AWS', 'GraphQL'],
      suggestions: [
        'Add more quantifiable achievements in your experience section.',
        'Include cloud computing skills to better match the job description.',
        'Optimize your summary to highlight relevant keywords.'
      ]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const generateInterviewQuestions = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;
    
    // Fetch the resume from DB
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const data = resume.resumeData || {};
    const skills = data.skills?.length > 0 ? data.skills.slice(0, 3).join(', ') : 'your core skills';
    const recentRole = data.experience?.[0]?.role || 'your previous role';
    const projectName = data.projects?.[0]?.name || 'one of your recent projects';
    const firstSkill = data.skills?.[0] || 'your primary technology';
    
    const job = jobDescription ? 'this role' : 'the target position';

    // Generate dynamic questions based on user's specific resume data
    const questions = [
      { type: 'technical', questionText: `Based on your experience with ${skills}, how would you apply them to succeed in ${job}?` },
      { type: 'behavioral', questionText: `Tell me about a time during your work as ${recentRole} where you had to overcome a significant challenge.` },
      { type: 'project', questionText: `Can you walk me through your work on "${projectName}"? What were the key technical decisions you made?` },
      { type: 'scenario', questionText: `If you were hired for ${job}, what would be your strategy for your first 30 days?` },
      { type: 'technical', questionText: `What is the most complex technical problem you've solved recently using ${firstSkill}?` }
    ];

    // Create session in DB
    const session = await InterviewSession.create({
      userId: req.user._id,
      questions: questions,
    });

    res.json({ sessionId: session._id, questions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitMockInterviewAnswer = async (req, res) => {
  try {
    const { sessionId, questionIndex, answerText } = req.body;
    
    // Fetch session
    const session = await InterviewSession.findById(sessionId);
    if (!session || session.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Save answer
    session.answers.push({ questionIndex, answerText, submittedAt: Date.now() });
    await session.save();

    // Mock AI feedback
    await new Promise(resolve => setTimeout(resolve, 1000));
    const feedback = {
      score: Math.floor(Math.random() * 3) + 7, // 7-10 score
      clarity: 'Good',
      improvements: 'Try to be more specific with metrics and outcomes.'
    };

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
