import express from 'express';
const router = express.Router();
import { analyzeATS } from '../controllers/atsController.js';

router.post('/analyze', analyzeATS);

export default router;