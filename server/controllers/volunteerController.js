import { PrismaClient } from '@prisma/client';
import ExcelJS from 'exceljs';

const prisma = new PrismaClient();

// Create a new volunteer
export const createVolunteer = async (req, res) => {
  try {
    // Check if req.body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'Request body is empty' });
    }

    const {
      fullName,
      email,
      phoneNumber,
      age,
      cityCountry,
      linkedin,
      commitment,
      priorExperience,
      priorExperienceDetails,
      roles,
      otherRole,
      whyVolunteer,
      whatAdd,
      additionalComments,
    } = req.body;

    // Basic validation
    if (!fullName || !email || !age || !cityCountry || !commitment || !priorExperience || !roles || !whyVolunteer || !whatAdd) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Parse roles if sent as a JSON string
    let parsedRoles = roles;
    if (typeof roles === 'string') {
      try {
        parsedRoles = JSON.parse(roles);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid roles format' });
      }
    }

    const volunteer = await prisma.volunteer.create({
      data: {
        fullName,
        email,
        phoneNumber,
        age,
        cityCountry,
        linkedin,
        commitment,
        priorExperience,
        priorExperienceDetails,
        roles: parsedRoles,
        otherRole,
        whyVolunteer,
        whatAdd,
        additionalComments,
      },
    });

    res.status(201).json({ message: 'Volunteer created successfully', volunteer });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all volunteers
export const getVolunteers = async (req, res) => {
  try {
    const volunteers = await prisma.volunteer.findMany();
    res.status(200).json(volunteers);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a volunteer
export const deleteVolunteer = async (req, res) => {
  try {
    const { id } = req.params;
    const volunteer = await prisma.volunteer.findUnique({ where: { id } });
    if (!volunteer) {
      return res.status(404).json({ error: 'Volunteer not found' });
    }

    await prisma.volunteer.delete({ where: { id } });
    res.status(200).json({ message: 'Volunteer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
export const exportVolunteers = async (req, res) => {
  try {
    const volunteers = req.body;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Volunteers');

    worksheet.columns = [
      { header: 'Full Name', key: 'fullName', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone Number', key: 'phoneNumber', width: 15 },
      { header: 'Age', key: 'age', width: 10 },
      { header: 'City/Country', key: 'cityCountry', width: 20 },
      { header: 'LinkedIn', key: 'linkedin', width: 30 },
      { header: 'Commitment', key: 'commitment', width: 20 },
      { header: 'Prior Experience', key: 'priorExperience', width: 20 },
      { header: 'Prior Experience Details', key: 'priorExperienceDetails', width: 40 },
      { header: 'Roles', key: 'roles', width: 30 },
      { header: 'Other Role', key: 'otherRole', width: 20 },
      { header: 'Why Volunteer', key: 'whyVolunteer', width: 40 },
      { header: 'What You Add', key: 'whatAdd', width: 40 },
      { header: 'Additional Comments', key: 'additionalComments', width: 40 },
    ];

    volunteers.forEach((volunteer) => {
      worksheet.addRow({
        fullName: volunteer.fullName,
        email: volunteer.email,
        phoneNumber: volunteer.phoneNumber || 'N/A',
        age: volunteer.age,
        cityCountry: volunteer.cityCountry,
        linkedin: volunteer.linkedin || 'N/A',
        commitment: volunteer.commitment,
        priorExperience: volunteer.priorExperience,
        priorExperienceDetails: volunteer.priorExperienceDetails || 'N/A',
        roles: volunteer.roles.join(', '),
        otherRole: volunteer.otherRole || 'N/A',
        whyVolunteer: volunteer.whyVolunteer,
        whatAdd: volunteer.whatAdd,
        additionalComments: volunteer.additionalComments || 'N/A',
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=volunteers.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to export volunteers' });
  }
};