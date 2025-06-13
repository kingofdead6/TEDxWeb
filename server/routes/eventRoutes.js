// routes/events.js
import express from 'express';
import { getEvents, getEventById, createEvent, updateEvent, addGalleryImages, deleteEvent, getRegistrations } from '../controllers/eventController.js';
import { authMiddleware, adminMiddleware } from '../utils/authMiddleware.js';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const router = express.Router();

console.log('Events routes initialized');

router.get('/test', (req, res) => res.json({ message: 'Events router working' }));
router.get('/', getEvents);
router.get('/:id', getEventById);
router.get('/registrations', authMiddleware, getRegistrations);
router.post('/', adminMiddleware, upload.fields([{ name: 'picture', maxCount: 1 }, { name: 'gallery', maxCount: 10 }]), createEvent);
router.put('/:id', authMiddleware, adminMiddleware, upload.fields([{ name: 'picture', maxCount: 1 }]), updateEvent);
router.post('/:id/gallery', authMiddleware, adminMiddleware, upload.array('gallery', 10), addGalleryImages);
router.delete('/:id', authMiddleware, adminMiddleware, deleteEvent);

export default router;