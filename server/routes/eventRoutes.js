import express from 'express';
import { getEvents, getEventById, createEvent, updateEvent, addGalleryImages, deleteEvent, getRegistrations, updateCheckIn, uploadRegistrations, validateRegistration, confirmCheckIn } from '../controllers/eventController.js';
import { authMiddleware, adminMiddleware } from '../utils/authMiddleware.js';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const router = express.Router();


// Get all events
router.get('/', getEvents);

// Get registrations for an event
router.get('/registrations', authMiddleware, getRegistrations);

// Get event by ID
router.get('/:id', getEventById);

// Create new event
router.post('/', authMiddleware, adminMiddleware, upload.fields([{ name: 'picture', maxCount: 1 }, { name: 'gallery', maxCount: 10 }]), createEvent);

// Update event
router.put('/:id', authMiddleware, adminMiddleware, upload.fields([{ name: 'picture', maxCount: 1 }, { name: 'gallery', maxCount: 10 }]), updateEvent);

// Add gallery images to event
router.post('/:id/gallery', authMiddleware, adminMiddleware, upload.array('gallery', 10), addGalleryImages);

// Delete event
router.delete('/:id', authMiddleware, adminMiddleware, deleteEvent);

// Update check-in status
router.patch('/registrations/:id/checkin', authMiddleware, updateCheckIn);

// Upload CSV for registrations
router.post('/registrations/upload', authMiddleware, upload.single('csv'), uploadRegistrations);

// Validate QR code
router.post('/registrations/validate', authMiddleware, validateRegistration);

// Confirm check-in
router.post('/registrations/confirm-checkin', authMiddleware, confirmCheckIn);

export default router;