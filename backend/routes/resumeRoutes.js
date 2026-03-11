import express from 'express';
import { createResume, getUserResumes, updateResume, deleteResume } from '../controllers/resumeController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All resume routes require authentication
router.use(protect);

router.post('/create', createResume);
router.get('/user', getUserResumes);
router.put('/update/:id', updateResume);
router.delete('/delete/:id', deleteResume);

export default router;
