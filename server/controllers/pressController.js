import { PrismaClient } from '@prisma/client';
import ExcelJS from 'exceljs';

const prisma = new PrismaClient();

// Create a new press entry
export const createPress = async (req, res) => {
  try {
    const {
      fullName, email, phoneNumber, mediaOutlet, position, otherPosition,
      cityCountry, socialLinks, coveragePlan, otherCoverage, pastCoverage,
      pastCoverageLinks, interest, specialRequirements
    } = req.body;

    if (!fullName || !email || !mediaOutlet || !position || !cityCountry || !coveragePlan || !pastCoverage || !interest) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const press = await prisma.press.create({
      data: {
        fullName,
        email,
        phoneNumber,
        mediaOutlet,
        position,
        otherPosition,
        cityCountry,
        socialLinks,
        coveragePlan,
        otherCoverage,
        pastCoverage,
        pastCoverageLinks,
        interest,
        specialRequirements,
        isVisibleOnMainPage: false,
      },
    });

    res.status(201).json({ message: 'Press entry created successfully', press });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Export press to Excel
export const exportPress = async (req, res) => {
  try {
    const pressData = await prisma.press.findMany();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('press');

    worksheet.columns = [
      { header: 'Full Name', key: 'fullName', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone Number', key: 'phoneNumber', width: 15 },
      { header: 'Media Outlet', key: 'mediaOutlet', width: 25 },
      { header: 'Position', key: 'position', width: 20 },
      { header: 'Other Position', key: 'otherPosition', width: 20 },
      { header: 'City/Country', key: 'cityCountry', width: 20 },
      { header: 'Social Links', key: 'socialLinks', width: 30 },
      { header: 'Coverage Plan', key: 'coveragePlan', width: 30 },
      { header: 'Other Coverage', key: 'otherCoverage', width: 20 },
      { header: 'Past Coverage', key: 'pastCoverage', width: 30 },
      { header: 'Past Coverage Links', key: 'pastCoverageLinks', width: 30 },
      { header: 'Interest', key: 'interest', width: 30 },
      { header: 'Special Requirements', key: 'specialRequirements', width: 30 },
      { header: 'Visible on Main Page', key: 'isVisibleOnMainPage', width: 20 },
    ];

    pressData.forEach((press) => {
      worksheet.addRow({
        fullName: press.fullName,
        email: press.email,
        phoneNumber: press.phoneNumber || 'N/A',
        mediaOutlet: press.mediaOutlet,
        position: press.position,
        otherPosition: press.otherPosition || 'N/A',
        cityCountry: press.cityCountry,
        socialLinks: press.socialLinks || 'N/A',
        coveragePlan: press.coveragePlan,
        otherCoverage: press.otherCoverage || 'N/A',
        pastCoverage: press.pastCoverage,
        pastCoverageLinks: press.pastCoverageLinks || 'N/A',
        interest: press.interest,
        specialRequirements: press.specialRequirements || 'N/A',
        isVisibleOnMainPage: press.isVisibleOnMainPage ? 'Yes' : 'No',
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=press.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to export press' });
  }
};

// Update visibility
export const updatePressVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVisibleOnMainPage } = req.body;

    const press = await prisma.press.update({
      where: { id },
      data: { isVisibleOnMainPage },
    });

    res.json({ message: 'Visibility updated', press });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update visibility' });
  }
};
// Get all press entries
export const getAllPress = async (req, res) => {
  try {
    const press = await prisma.press.findMany();
    res.json(press);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch press' });
  }
};