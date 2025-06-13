import express from 'express';
import { createRegistration, createAttendeeAndRegistration } from '../controllers/registrationController.js';

const router = express.Router();

// POST /api/registrations
router.post('/', createRegistration);
// POST /api/registrations/attendee
router.post('/attendee', createAttendeeAndRegistration);

export default router;