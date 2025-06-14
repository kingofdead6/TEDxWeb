import express from 'express';
import { createPerformer, getAllPerformers, exportPerformers, updatePerformerVisibility } from '../controllers/performerController.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `performer-${Date.now()}.${ext}`);
  },
});
const upload = multer({ storage });

// POST: Create a new performer
router.post('/', upload.single('pfp'), createPerformer);

// GET: Fetch all performers
router.get('/', getAllPerformers);

// GET: Export performers to Excel
router.post('/export', exportPerformers);

// PATCH: Update performer visibility
router.patch('/:id/visibility', updatePerformerVisibility);

export default router;