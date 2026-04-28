import express from 'express';
import { processAtsAnalysis, generateInterviewQuestions, submitMockInterviewAnswer } from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';



const router = express.Router();
import { analyzeATS } from '../controllers/atsController.js';

router.post('/ats/analyze', analyzeATS);

router.use(protect); // Secure these endpoints

router.post('/ats/analyze', processAtsAnalysis);
router.post('/interview/analyze', generateInterviewQuestions);
router.post('/interview/mock', submitMockInterviewAnswer);

export default router;
