import express from 'express';
import { createPartner, getPartners, deletePartner, getVisiblePartners, updatePartnerVisibility } from '../controllers/partnerController.js';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';

const router = express.Router();

// Configure multer with Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tedx/partners',
    public_id: (req, file) => `partner-${Date.now()}`,
  },
});
const upload = multer({ storage });

// POST: Create a new partner
router.post('/', upload.single('companyProfile'), createPartner);

// GET: Fetch all partners
router.get('/', getPartners);

// GET: Fetch visible partnersa
router.get('/visible', getVisiblePartners);

// PATCH: Update partner visibility
router.patch('/:id/visibility', updatePartnerVisibility);

// DELETE: Delete a partner
router.delete('/:id', deletePartner);

export default router;
