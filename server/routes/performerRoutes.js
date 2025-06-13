import express from 'express';
import { createPerformer } from '../controllers/performerController.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
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

export default router;