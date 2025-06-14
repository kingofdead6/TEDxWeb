import express from 'express';
import { createPress, getAllPress, exportPress, updatePressVisibility } from '../controllers/pressController.js';

const router = express.Router();

// POST: Create a new press entry
router.post('/', createPress);

// GET: Fetch all press entries
router.get('/', getAllPress);

// GET: Export press to Excel
router.post('/export', exportPress);

// PATCH: Update press visibility
router.patch('/:id/visibility', updatePressVisibility);

export default router;