import express from 'express';
import { createSpeaker, getSpeakers, deleteSpeaker, getVisibleSpeakers, updateSpeakerVisibility, exportSpeakers } from '../controllers/speakerController.js';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';
import { authMiddleware } from '../utils/authMiddleware.js';

const router = express.Router();

// Configure multer with Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tedx/speakers',
    public_id: (req, file) => `speaker-${Date.now()}`,
  },
});
const upload = multer({ storage });

// POST: Create a new speaker
router.post('/', upload.single('pfp'), createSpeaker);

// GET: Fetch all speakers
router.get('/', getSpeakers);

// GET: Fetch visible speakers
router.get('/visible', getVisibleSpeakers);

// PATCH: Update speaker visibility
router.patch('/:id/visibility', updateSpeakerVisibility);

// DELETE: Delete a speaker
router.delete('/:id', deleteSpeaker);

router.post('/export', exportSpeakers);


export default router;
