import express from 'express';
import { 
  processAtsAnalysis, 
  generateInterviewQuestions, 
  submitMockInterviewAnswer, 
  generateSummary, 
  enhanceBullets 
} from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';



const router = express.Router();
import { analyzeATS } from '../controllers/atsController.js';

router.post('/ats/analyze', analyzeATS);

// No auth required for ATS analysis
router.post('/ats', processAtsAnalysis);

// Auth required for these routes
router.post('/interview', protect, generateInterviewQuestions);
router.post('/interview/answer', protect, submitMockInterviewAnswer);
router.post('/generate-summary', generateSummary);
router.post('/enhance-bullets', enhanceBullets);

export default router;
