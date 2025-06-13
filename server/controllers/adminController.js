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
      },
    });
    res.json(users);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ message: 'Server error' });
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
    if (err.code === 'P2025') { // Prisma error for record not found
      return res.status(404).json({ message: 'User not found' });
    }
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getStatistics = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalEvents = await prisma.event.count();
    const eventStats = await prisma.event.findMany({
      select: {
        title: true,
        _count: {
          select: {
            registrations: true,
          },
        },
        registrations: {
          where: {
            status: 'confirmed',
          },
          select: {
            id: true,
          },
        },
      },
    });

    const formattedEventStats = eventStats.map((event) => ({
      title: event.title,
      totalAttendees: event._count.registrations,
      registeredAttendees: event.registrations.length,
    }));

    res.json({ totalUsers, totalEvents, eventStats: formattedEventStats });
  } catch (err) {
    console.error('Get statistics error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};