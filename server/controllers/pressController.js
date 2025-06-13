import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new press entry
export const createPress = async (req, res) => {
  try {
    const {
      fullName, email, phoneNumber, mediaOutlet, position, otherPosition,
      cityCountry, socialLinks, coveragePlan, otherCoverage, pastCoverage,
      pastCoverageLinks, interest, specialRequirements
    } = req.body;

    // Basic validation
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
      },
    });

    res.status(201).json({ message: 'Press entry created successfully', press });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};