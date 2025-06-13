import { PrismaClient } from '@prisma/client';
import cloudinary from '../utils/cloudinary.js';

const prisma = new PrismaClient();

// Create a new partner
export const createPartner = async (req, res) => {
  try {
    const {
      organizationName, contactPerson, contactEmail, contactPhone, websiteLinks,
      cityCountry, orgType, otherOrgType, whyPartner, supportType, otherSupportType,
      specificEvents, partnershipBenefits, additionalComments, isVisibleOnMainPage
    } = req.body;

    // Basic validation
    if (!organizationName || !contactPerson || !contactEmail || !contactPhone || !websiteLinks ||
        !cityCountry || !orgType || !whyPartner || !supportType || !specificEvents || !partnershipBenefits) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Parse supportType if sent as a JSON string
    let supportTypeArray = supportType;
    if (typeof supportType === 'string') {
      try {
        supportTypeArray = JSON.parse(supportType);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid supportType format' });
      }
    }

    if (!Array.isArray(supportTypeArray)) {
      return res.status(400).json({ error: 'supportType must be an array' });
    }

    // Handle file upload (companyProfile)
    let companyProfileUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'tedx/partners',
        public_id: `partner-${Date.now()}`,
      });
      companyProfileUrl = result.secure_url;
    }

    const partner = await prisma.partner.create({
      data: {
        organizationName,
        contactPerson,
        contactEmail,
        contactPhone,
        websiteLinks,
        cityCountry,
        orgType,
        otherOrgType,
        whyPartner,
        supportType: supportTypeArray,
        otherSupportType,
        specificEvents,
        partnershipBenefits,
        companyProfile: companyProfileUrl,
        additionalComments,
        isVisibleOnMainPage: isVisibleOnMainPage === 'true',
      },
    });

    res.status(201).json({ message: 'Partner created successfully', partner });
  } catch (error) {
    console.error('Error creating partner:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all partners
export const getPartners = async (req, res) => {
  try {
    const partners = await prisma.partner.findMany();
    res.status(200).json(partners);
  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get visible partners for main page
export const getVisiblePartners = async (req, res) => {
  try {
    const partners = await prisma.partner.findMany({
      where: { isVisibleOnMainPage: true },
    });
    res.status(200).json(partners);
  } catch (error) {
    console.error('Error fetching visible partners:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update partner visibility
export const updatePartnerVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVisibleOnMainPage } = req.body;

    const partner = await prisma.partner.findUnique({ where: { id } });
    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    const updatedPartner = await prisma.partner.update({
      where: { id },
      data: { isVisibleOnMainPage: isVisibleOnMainPage },
    });

    res.status(200).json({ message: 'Partner visibility updated', partner: updatedPartner });
  } catch (error) {
    console.error('Error updating partner visibility:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a partner
export const deletePartner = async (req, res) => {
  try {
    const { id } = req.params;
    const partner = await prisma.partner.findUnique({ where: { id } });
    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    // Delete companyProfile from Cloudinary if exists
    if (partner.companyProfile) {
      const publicId = partner.companyProfile.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`tedx/partners/${publicId}`);
    }

    await prisma.partner.delete({ where: { id } });
    res.status(200).json({ message: 'Partner deleted successfully' });
  } catch (error) {
    console.error('Error deleting partner:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
