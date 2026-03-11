import mongoose from 'mongoose';

const interviewSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  },
  questions: [{
    questionText: String,
    type: { type: String, enum: ['technical', 'behavioral', 'project', 'scenario'] }
  }],
  answers: [{
    questionIndex: Number,
    answerText: String,
    submittedAt: Date
  }],
  feedback: {
    overallScore: Number,
    clarityScore: Number,
    technicalScore: Number,
    communicationScore: Number,
    strengths: [String],
    weaknesses: [String],
    overallTips: String
  }
}, { timestamps: true });

const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema);
export default InterviewSession;
