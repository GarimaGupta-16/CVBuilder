import InterviewSession from '../models/InterviewSession.js';
import Resume from '../models/Resume.js';
import Groq from 'groq-sdk';

let groq = null;

const getGroqClient = () => {
  if (!groq) {
    const apiKey = process.env.GROQ_API_KEY;
    if (apiKey) {
      groq = new Groq({ apiKey });
    }
  }
  return groq;
};

// Mock Implementation fallback if no API key is set.

// Custom ATS Analysis - No external dependencies, 100% transparent
const analyzeResumeATS = (resumeText) => {
  let score = 0;
  const feedback = {
    keywordMatch: [],
    missingKeywords: [],
    suggestions: []
  };

  // ===== SECTION 1: CONTACT INFORMATION (10 points) =====
  const hasEmail = /@/.test(resumeText);
  const hasPhone = /\d{7,}/.test(resumeText);
  const hasLocation = /city|location|address|based|new york|london|mumbai|delhi|bangalore|india|usa|uk|canada|australia|singapore|dubai/i.test(resumeText);
  
  if (hasEmail) { score += 3; feedback.keywordMatch.push('Email'); }
  else { feedback.missingKeywords.push('Email Address'); }
  
  if (hasPhone) { score += 3; feedback.keywordMatch.push('Phone Number'); }
  else { feedback.missingKeywords.push('Phone Number'); }
  
  if (hasLocation) { score += 4; feedback.keywordMatch.push('Location'); }
  else { feedback.missingKeywords.push('Location/City'); }

  // ===== SECTION 2: PROFESSIONAL SUMMARY (8 points) =====
  const hasSummary = /summary|overview|professional|objective|about|profile/i.test(resumeText);
  if (hasSummary) { 
    score += 8; 
    feedback.keywordMatch.push('Professional Summary');
  } else { 
    feedback.missingKeywords.push('Professional Summary');
  }

  // ===== SECTION 3: WORK EXPERIENCE (15 points) =====
  const hasExperience = /experience|employment|worked|position|role|title|company|organization|project/i.test(resumeText);
  const experienceCount = (resumeText.match(/\b\d{1,2}[+]?\s*(year|yr|yrs|years|month|months)/gi) || []).length;
  
  if (hasExperience) { 
    score += 10;
    feedback.keywordMatch.push('Work Experience');
  } else { 
    feedback.missingKeywords.push('Work Experience Section');
  }
  
  if (experienceCount > 0) { 
    score += 5; 
  } else { 
    feedback.missingKeywords.push('Experience Duration Details');
  }

  // ===== SECTION 4: EDUCATION (10 points) =====
  const hasEducation = /education|degree|bachelor|master|phd|mba|diploma|university|college|school|graduation|graduated/i.test(resumeText);
  if (hasEducation) { 
    score += 10; 
    feedback.keywordMatch.push('Education Section');
  } else { 
    feedback.missingKeywords.push('Education Section');
  }

  // ===== SECTION 5: SKILLS (12 points) =====
  const hasSkills = /skills|technical|languages|proficiencies|expertise|technologies|tools|programming/i.test(resumeText);
  if (hasSkills) { 
    score += 12; 
    feedback.keywordMatch.push('Skills Section');
  } else { 
    feedback.missingKeywords.push('Skills Section');
  }

  // ===== SECTION 6: ACTION VERBS (8 points) =====
  const actionVerbs = ['led', 'managed', 'developed', 'created', 'implemented', 'designed', 'improved', 'increased', 'achieved', 'accelerated', 'spearheaded', 'orchestrated', 'strategized', 'optimized', 'transformed', 'pioneered', 'coordinated', 'executed', 'established'];
  const actionVerbCount = actionVerbs.filter(verb => new RegExp(`\\b${verb}\\b`, 'gi').test(resumeText)).length;
  
  if (actionVerbCount > 5) { 
    score += 8; 
    feedback.keywordMatch.push('Strong Action Verbs');
  } else if (actionVerbCount > 2) { 
    score += 4; 
    feedback.suggestions.push('Add more action verbs (led, managed, developed, implemented, etc.)');
  } else { 
    feedback.missingKeywords.push('Action Verbs (led, managed, developed, etc.)');
    feedback.suggestions.push('Start achievement statements with strong action verbs like "Led", "Developed", "Managed"');
  }

  // ===== SECTION 7: QUANTIFIABLE ACHIEVEMENTS (10 points) =====
  const hasNumbers = /\d+%|\$\d+|increased by|grew by|improved by|reduced by|achieved|delivered|generated|saved/i.test(resumeText);
  const numberCount = (resumeText.match(/\d+%|\$\d+/g) || []).length;
  
  if (numberCount >= 3) { 
    score += 10; 
    feedback.keywordMatch.push('Quantified Metrics');
  } else if (numberCount > 0) { 
    score += 5;
    feedback.suggestions.push('Include more quantifiable metrics (percentages, revenue, numbers)');
  } else { 
    feedback.missingKeywords.push('Quantifiable Metrics & Results');
    feedback.suggestions.push('Add specific numbers, percentages, or revenue figures to achievements');
  }

  // ===== SECTION 8: TECHNICAL KEYWORDS (12 points) =====
  const techKeywords = ['javascript', 'python', 'java', 'react', 'node', 'sql', 'aws', 'docker', 'html', 'css', 'api', 'database', 'git', 'agile', 'scrum', 'linux', 'windows', 'cloud', 'devops', 'rest', 'json', 'xml', 'machine learning', 'ai', 'analytics', 'excel', 'tableau', 'salesforce'];
  const techCount = techKeywords.filter(tech => new RegExp(`\\b${tech}\\b`, 'gi').test(resumeText)).length;
  
  if (techCount >= 5) { 
    score += 12; 
    feedback.keywordMatch.push('Strong Technical Skills');
  } else if (techCount >= 3) { 
    score += 8;
  } else if (techCount > 0) { 
    score += 4;
  }

  // ===== SECTION 9: FORMATTING & STRUCTURE (5 points) =====
  const lineCount = resumeText.split('\n').length;
  const wordCount = resumeText.split(/\s+/).length;
  
  if (lineCount > 20 && wordCount > 200 && wordCount < 1500) { 
    score += 5; 
    feedback.keywordMatch.push('Good Length & Structure');
  } else if (wordCount < 100) { 
    feedback.missingKeywords.push('More Content & Details');
  }

  // ===== CAP SCORE AT 100 =====
  score = Math.min(score, 100);

  // ===== GENERATE ADDITIONAL SUGGESTIONS =====
  if (feedback.suggestions.length < 4) {
    if (!hasEducation) feedback.suggestions.push('Clearly list your educational qualifications');
    if (!hasExperience) feedback.suggestions.push('Add detailed work experience with achievements');
    if (actionVerbCount < 5) feedback.suggestions.push('Use powerful action verbs at the start of each bullet point');
    if (numberCount < 3) feedback.suggestions.push('Include specific metrics and results from your work');
  }

  // Limit suggestions to 4
  feedback.suggestions = feedback.suggestions.slice(0, 4);

  return {
    score,
    keywordMatch: feedback.keywordMatch.length > 0 ? feedback.keywordMatch : ['Professional Background'],
    missingKeywords: feedback.missingKeywords.length > 0 ? feedback.missingKeywords : ['Additional Details'],
    suggestions: feedback.suggestions.length > 0 ? feedback.suggestions : ['Great resume structure!']
  };
};

export const processAtsAnalysis = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;
    
    console.log('📋 ATS Analysis Request received');
    console.log('📝 Resume length:', resumeText?.length || 0);
    
    if (!resumeText || resumeText.trim() === '') {
      console.error('❌ Resume text is empty');
      return res.status(400).json({ message: 'Resume text is required' });
    }

    // Use custom ATS analyzer
    const result = analyzeResumeATS(resumeText);
    
    console.log('✅ Analysis complete. Score:', result.score);
    res.json(result);
  } catch (error) {
    console.error('❌ ATS Analysis error:', error.message);
    res.status(500).json({ message: error.message || 'Failed to analyze ATS score' });
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

export const generateSummary = async (req, res) => {
  try {
    const { role, experience, skills } = req.body;
    
    const client = getGroqClient();
    if (client) {
      console.log('🚀 Using Groq API for Summary Generation');
      const prompt = `Write a professional resume summary (around 3-4 sentences). The user is a ${role || 'Professional'} with skills in ${skills || 'various technologies'}. Experience level or details provided: ${experience || 'N/A'}. Keep it concise, engaging, and professional.`;
      const completion = await client.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
      });
      return res.json({ summary: completion.choices[0]?.message?.content || '' });
    }

    // Mock response fallback
    await new Promise(resolve => setTimeout(resolve, 1500));
    res.json({
      summary: `Dedicated and highly skilled ${role || 'Professional'} with expertise in ${skills || 'multiple domains'}. Proven track record of delivering high-quality results. Seeking to leverage experience and strong problem-solving skills in a dynamic environment.`
    });
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ message: error.message || 'Failed to generate summary' });
  }
};

export const enhanceBullets = async (req, res) => {
  try {
    const { text, role } = req.body;
    
    const client = getGroqClient();
    if (client) {
      console.log('🚀 Using Groq API for Bullet Enhancement');
      const prompt = `Enhance the following resume experience description to make it sound more professional, impactful, and action-oriented. Start with strong action verbs, include metrics if provided, and keep it concise. 
Role context: ${role || 'Not specified'}
Original text:
${text}

Return only the enhanced text (it can be in bullet points or a single paragraph based on original).`;
      const completion = await client.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
      });
      const enhancedText = completion.choices[0]?.message?.content || '';
      return res.json({ enhancedText: enhancedText.replace(/\n\n/g, '\n').trim() });
    }

    // Mock response fallback
    await new Promise(resolve => setTimeout(resolve, 1500));
    const mockEnhanced = text.split('\n').map(line => line.length > 5 ? `• Spearheaded and improved: ${line}` : line).join('\n');
    res.json({
      enhancedText: mockEnhanced
    });
  } catch (error) {
    console.error('Error enhancing bullets:', error);
    res.status(500).json({ message: error.message || 'Failed to enhance bullets' });
  }
};
