import express from 'express';
import multer from 'multer';
import { createVolunteer, getVolunteers, deleteVolunteer, exportVolunteers } from '../controllers/volunteerController.js';

const router = express.Router();

// Configure multer to handle form-data without files for volunteers
const upload = multer({ none: true });

// POST: Create a new volunteer
router.post('/', upload.none(), createVolunteer);

// GET: Fetch all volunteers
router.get('/', getVolunteers);

// DELETE: Delete a volunteer
router.delete('/:id', deleteVolunteer);

router.post('/export', exportVolunteers);

export default router;