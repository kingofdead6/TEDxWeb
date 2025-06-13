import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new volunteer
export const createVolunteer = async (req, res) => {
  try {
    // Log req.body for debugging
    console.log('Request body:', req.body);

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
    console.error('Error creating volunteer:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all volunteers
export const getVolunteers = async (req, res) => {
  try {
    const volunteers = await prisma.volunteer.findMany();
    res.status(200).json(volunteers);
  } catch (error) {
    console.error('Error fetching volunteers:', error);
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
    console.error('Error deleting volunteer:', error);
    res.status(500).json({ error: 'Server error' });
  }
};