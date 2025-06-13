import express from 'express';
import { createPress } from '../controllers/pressController.js';

const router = express.Router();

// POST: Create a new press entry
router.post('/', createPress);

export default router;