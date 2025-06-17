import express from 'express';
import { 
  subscribeNewsletter, 
  getNewsletterSubscriptions, 
  updateSubscriptionStatus, 
  deleteSubscription,
  exportSubscriptions 
} from '../controllers/newsLetterController.js';
import { authMiddleware, adminMiddleware } from '../utils/authMiddleware.js';

const router = express.Router();

// POST /api/newsletter - Subscribe to newsletter
router.post('/', subscribeNewsletter);

// GET /api/newsletter - Get all subscriptions (admin only)
router.get('/', authMiddleware, adminMiddleware, getNewsletterSubscriptions);

// PATCH /api/newsletter/:id/status - Update subscription status (admin only)
router.patch('/:id/status', authMiddleware, adminMiddleware, updateSubscriptionStatus);

// DELETE /api/newsletter/:id - Delete a subscription (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, deleteSubscription);

// POST /api/newsletter/export - Export subscriptions to Excel (admin only)
router.post('/export', authMiddleware, adminMiddleware, exportSubscriptions);

export default router;