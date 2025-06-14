import express from 'express';
import { createRegistration, createAttendeeAndRegistration, sendEmailsToSelected } from '../controllers/registrationController.js';
import { authMiddleware, adminMiddleware } from '../utils/authMiddleware.js';

const router = express.Router();

// POST /api/registrations
router.post('/', authMiddleware, adminMiddleware, createRegistration);
// POST /api/registrations/attendee
router.post('/attendee', createAttendeeAndRegistration);
// POST /api/registrations/send-emails
router.post('/send-emails', authMiddleware, sendEmailsToSelected);

export default router;