import express from 'express';
import {
  analyzeCode,
  chat,
  getConversations,
  getConversationById,
  deleteConversation,
  getReviews,
  getReviewById,
  deleteReview,
} from '../controllers/aiController.js';
import { protect, optionalProtect } from '../middleware/auth.js';

const router = express.Router();

// Public / Optionally Authenticated routes
router.post('/analyze', optionalProtect, analyzeCode);
router.post('/chat', optionalProtect, chat);

// Private routes (Require user authentication)
router.get('/conversations', protect, getConversations);
router.get('/conversations/:id', protect, getConversationById);
router.delete('/conversations/:id', protect, deleteConversation);

router.get('/reviews', protect, getReviews);
router.get('/reviews/:id', protect, getReviewById);
router.delete('/reviews/:id', protect, deleteReview);

export default router;
