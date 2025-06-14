import express from 'express';
import {
  createTeamMember,
  getTeamMembers,
  getVisibleTeamMembers,
  updateTeamMemberVisibility,
  deleteTeamMember,
  exportTeamMembers,
} from '../controllers/TeamMemberController.js'; // Adjust path as needed
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';

const router = express.Router();

// Configure multer with Cloudinary storage for team members
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tedx/team_members',
    public_id: (req, file) => `team_member-${Date.now()}`,
  },
});
const upload = multer({ storage });

// POST: Create a new team member
router.post('/', upload.single('pfp'), createTeamMember);

// GET: Fetch all team members
router.get('/', getTeamMembers);

// GET: Fetch visible team members
router.get('/visible', getVisibleTeamMembers);

// PATCH: Update team member visibility
router.patch('/:id/visibility', updateTeamMemberVisibility);

// DELETE: Delete a team member
router.delete('/:id', deleteTeamMember);

router.post('/export', exportTeamMembers);

export default router;