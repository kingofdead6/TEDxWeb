import { PrismaClient } from '@prisma/client';
import path from 'path';
import { fileURLToPath } from 'url';
import ExcelJS from 'exceljs';

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

    if (!fullName || !email || !cityCountry || !performanceType || !description || !duration || !sampleLink) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

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
        isVisibleOnMainPage: false,
      },
    });

    res.status(201).json({ message: 'Performer created successfully', performer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Export performers to Excel
export const exportPerformers = async (req, res) => {
  try {
    const performers = await prisma.performer.findMany();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Performers');

    worksheet.columns = [
      { header: 'Full Name', key: 'fullName', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone Number', key: 'phoneNumber', width: 15 },
      { header: 'Team', key: 'team', width: 20 },
      { header: 'City/Country', key: 'cityCountry', width: 20 },
      { header: 'Social Links', key: 'socialLinks', width: 30 },
      { header: 'Performance Type', key: 'performanceType', width: 20 },
      { header: 'Performance Title', key: 'performanceTitle', width: 30 },
      { header: 'Description', key: 'description', width: 40 },
      { header: 'Duration', key: 'duration', width: 15 },
      { header: 'Special Equipment', key: 'specialEquipment', width: 25 },
      { header: 'Sample Link', key: 'sampleLink', width: 30 },
      { header: 'Additional Comments', key: 'additionalComments', width: 40 },
      { header: 'Profile Picture', key: 'pfp', width: 30 },
      { header: 'Visible on Main Page', key: 'isVisibleOnMainPage', width: 20 },
    ];

    performers.forEach((performer) => {
      worksheet.addRow({
        fullName: performer.fullName,
        email: performer.email,
        phoneNumber: performer.phoneNumber || 'N/A',
        team: performer.team || 'N/A',
        cityCountry: performer.cityCountry,
        socialLinks: performer.socialLinks || 'N/A',
        performanceType: performer.performanceType,
        performanceTitle: performer.performanceTitle || 'N/A',
        description: performer.description,
        duration: performer.duration,
        specialEquipment: performer.specialEquipment || 'N/A',
        sampleLink: performer.sampleLink || 'N/A',
        additionalComments: performer.additionalComments || 'N/A',
        pfp: performer.pfp || 'N/A',
        isVisibleOnMainPage: performer.isVisibleOnMainPage ? 'Yes' : 'No',
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=performers.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to export performers' });
  }
};

// Update visibility
export const updatePerformerVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVisibleOnMainPage } = req.body;

    const performer = await prisma.performer.update({
      where: { id },
      data: { isVisibleOnMainPage },
    });

    res.json({ message: 'Visibility updated', performer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update visibility' });
  }
};

// Get all performers
export const getAllPerformers = async (req, res) => {
  try {
    const performers = await prisma.performer.findMany();
    res.json(performers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch performers' });
  }
};