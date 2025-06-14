import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: { not: 'admin' } },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        team: true,
        roleInTeam: true,
        role: true,
        createdAt: true,
      },
      orderBy: { name: 'asc' },
    });

    console.log('Fetched users count:', users.length); // Debug log
    console.log('Sample user emails:', users.slice(0, 3).map(u => u.email)); // Debug log

    // Fetch associated Attendee data for each user
    const usersWithAttendees = await Promise.all(
      users.map(async (user) => {
        const attendee = await prisma.attendee.findFirst({
          where: { email: { equals: user.email, mode: 'insensitive' } }, // Case-insensitive match
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
            dateOfBirth: true,
            gender: true,
            cityCountry: true,
            occupation: true,
            companyUniversity: true,
            eventChoice: true,
            eventOther: true,
            reasonToAttend: true,
            attendedBefore: true,
            previousEvents: true,
            howHeard: true,
            howHeardOther: true,
            dietaryRestrictions: true,
            interests: true,
            interestsOther: true,
            receiveUpdates: true,
            createdAt: true,
            updatedAt: true,
          },
        });
        console.log(`Attendee for user ${user.email}:`, !!attendee, attendee ? { gender: attendee.gender, howHeard: attendee.howHeard } : 'None'); // Debug log
        return { ...user, attendee };
      })
    );

    res.json(usersWithAttendees);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    await prisma.$disconnect();
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid or missing user ID' });
    }

    const user = await prisma.user.delete({
      where: { id: userId },
    });

    res.json({ message: 'User deleted' });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'User not found' });
    }
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    await prisma.$disconnect();
  }
};

export const getStatistics = async (req, res) => {
  try {
    // Total users
    const totalUsers = await prisma.user.count();

    // Total events
    const totalEvents = await prisma.event.count();

    // Total registered users (all registrations, including uploaded)
    const totalRegisteredUsers = await prisma.registration.count();

    // Event statistics (total registrations and checked-in)
    const eventStats = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        _count: {
          select: {
            registrations: true, // Include all registrations
          },
        },
        registrations: {
          select: {
            id: true,
            checkedIn: true,
          },
        },
      },
    });

    // Gender distribution from Attendee
    const genderStats = await prisma.attendee.groupBy({
      by: ['gender'],
      _count: {
        gender: true,
      },
      where: {
        registrations: {
          some: {}, // Include all registrations
        },
      },
    });

    // Registration sources (howHeard) from Attendee
    const howHeardStats = await prisma.attendee.groupBy({
      by: ['howHeard'],
      _count: {
        howHeard: true,
      },
      where: {
        registrations: {
          some: {}, // Include all registrations
        },
      },
    });

    // Age distribution from Attendee (raw query)
    const ageStatsRaw = await prisma.$queryRaw`
      SELECT 
        CASE 
          WHEN EXTRACT(YEAR FROM AGE("dateOfBirth")) < 18 THEN '<18'
          WHEN EXTRACT(YEAR FROM AGE("dateOfBirth")) BETWEEN 18 AND 24 THEN '18-24'
          WHEN EXTRACT(YEAR FROM AGE("dateOfBirth")) BETWEEN 25 AND 34 THEN '25-34'
          WHEN EXTRACT(YEAR FROM AGE("dateOfBirth")) BETWEEN 35 AND 44 THEN '35-44'
          WHEN EXTRACT(YEAR FROM AGE("dateOfBirth")) BETWEEN 45 AND 54 THEN '45-54'
          ELSE '55+'
        END AS age_range,
        COUNT(*)::INTEGER AS count
      FROM "Attendee"
      WHERE EXISTS (
        SELECT 1 FROM "Registration" r 
        WHERE r."attendeeId" = "Attendee".id
      )
      GROUP BY age_range
      ORDER BY age_range;
    `;

    const formattedEventStats = eventStats.map((event) => {
      const totalRegistrations = event._count.registrations;
      const checkedIn = event.registrations.filter((reg) => reg.checkedIn).length;
      return {
        id: event.id,
        title: event.title,
        totalRegistrations,
        checkedIn,
        notCheckedIn: totalRegistrations - checkedIn,
      };
    });

    const formattedGenderStats = genderStats.map((stat) => ({
      gender: stat.gender || 'Unspecified',
      count: stat._count.gender,
    }));

    const formattedHowHeardStats = howHeardStats.map((stat) => ({
      source: stat.howHeard || 'Unspecified',
      count: stat._count.howHeard,
    }));

    const formattedAgeStats = ageStatsRaw.map((stat) => ({
      ageRange: stat.age_range,
      count: stat.count,
    }));

    console.log('Statistics:', { totalUsers, totalEvents, totalRegisteredUsers, formattedGenderStats, formattedHowHeardStats }); // Debug log

    res.json({
      totalUsers,
      totalEvents,
      totalRegisteredUsers,
      eventStats: formattedEventStats,
      genderStats: formattedGenderStats,
      howHeardStats: formattedHowHeardStats,
      ageStats: formattedAgeStats,
    });
  } catch (err) {
    console.error('Error fetching statistics:', err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    await prisma.$disconnect();
  }
};