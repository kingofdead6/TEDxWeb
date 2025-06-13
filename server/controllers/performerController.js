import { PrismaClient } from '@prisma/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// Create a new performer
export const createPerformer = async (req, res) => {
  try {
    const {
      fullName, email, phoneNumber, team, cityCountry, socialLinks,
      performanceType, performanceTitle, description, duration,
      specialEquipment, sampleLink, additionalComments
    } = req.body;

    // Basic validation
    if (!fullName || !email || !cityCountry || !performanceType || !description || !duration || !sampleLink) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Handle file upload (pfp)
    let pfpPath = null;
    if (req.file) {
      pfpPath = `/uploads/${req.file.filename}`;
    }

    const performer = await prisma.performer.create({
      data: {
        fullName,
        email,
        phoneNumber,
        team,
        cityCountry,
        socialLinks,
        performanceType,
        performanceTitle,
        description,
        duration,
        specialEquipment,
        sampleLink,
        additionalComments,
        pfp: pfpPath,
      },
    });

    res.status(201).json({ message: 'Performer created successfully', performer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};