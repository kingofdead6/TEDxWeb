import { PrismaClient } from '@prisma/client';
import XLSX from 'xlsx';
import QRCode from 'qrcode';

const prisma = new PrismaClient();

export const getAttendees = async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.eventId },
    });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    const attendees = await prisma.attendee.findMany({
      where: {
        events: { some: { id: req.params.eventId } },
      },
      include: {
        registrations: {
          where: { eventId: req.params.eventId },
          select: { status: true, validationTime: true },
        },
      },
    });
    // Map attendees to include registration status and validationTime
    const formattedAttendees = attendees.map((attendee) => ({
      ...attendee,
      status: attendee.registrations[0]?.status || 'pending',
      validationTime: attendee.registrations[0]?.validationTime,
    }));
    res.json(formattedAttendees);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const uploadAttendees = async (req, res) => {
  try {
    const event = await prisma.event.findUnique({ where: { id: req.params.eventId } });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);
    if (data.length === 0) {
      return res.status(400).json({ message: 'Excel file is empty' });
    }
    if (!data.every((row) => row.fullName && row.email)) {
      return res.status(400).json({ message: 'Excel file must contain fullName and email columns' });
    }
    const attendees = await Promise.all(
      data.map(async (row) => {
        const qrCodeData = JSON.stringify({
          eventId: req.params.eventId,
          email: row.email,
        });
        const qrCode = await QRCode.toDataURL(qrCodeData);
        // Check if attendee already exists by email
        let attendee = await prisma.attendee.findUnique({
          where: { email: row.email },
        });
        if (!attendee) {
          attendee = await prisma.attendee.create({
            data: {
              fullName: row.fullName,
              email: row.email,
              phoneNumber: row.phoneNumber || '',
              dateOfBirth: row.dateOfBirth ? new Date(row.dateOfBirth) : new Date('2000-01-01'),
              gender: row.gender || null,
              cityCountry: row.cityCountry || '',
              occupation: row.occupation || '',
              companyUniversity: row.companyUniversity || '',
              eventChoice: row.eventChoice || '',
              eventOther: row.eventOther || null,
              reasonToAttend: row.reasonToAttend || '',
              attendedBefore: row.attendedBefore || '',
              previousEvents: row.previousEvents || null,
              howHeard: row.howHeard || null,
              howHeardOther: row.howHeardOther || null,
              dietaryRestrictions: row.dietaryRestrictions || null,
              interests: row.interests ? (Array.isArray(row.interests) ? row.interests : [row.interests]) : [],
              interestsOther: row.interestsOther || null,
              receiveUpdates: row.receiveUpdates || null,
            },
          });
        }
        // Create or update registration
        const registration = await prisma.registration.upsert({
          where: {
            attendeeId_eventId: {
              attendeeId: attendee.id,
              eventId: req.params.eventId,
            },
          },
          update: {
            status: 'pending',
          },
          create: {
            attendeeId: attendee.id,
            eventId: req.params.eventId,
            status: 'pending',
            events: {
              connect: { id: req.params.eventId },
            },
          },
        });
        return { ...attendee, qrCode, status: registration.status, validationTime: registration.validationTime };
      })
    );
    res.json({ message: 'Attendees uploaded successfully', count: attendees.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const validateQRCode = async (req, res) => {
  const { qrCodeData } = req.body;
  try {
    const parsedData = JSON.parse(qrCodeData);
    const { eventId, email } = parsedData;
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return res.json({ valid: false, message: 'Invalid QR code: Event not found' });
    }
    const attendee = await prisma.attendee.findFirst({
      where: {
        email,
        events: { some: { id: eventId } },
      },
      include: {
        registrations: {
          where: { eventId },
        },
      },
    });
    if (!attendee) {
      return res.json({ valid: false, message: 'Attendee not found' });
    }
    const registration = attendee.registrations[0];
    if (!registration || registration.status === 'confirmed') {
      return res.json({ valid: false, message: 'Attendee already registered or not registered' });
    }
    await prisma.registration.update({
      where: {
        attendeeId_eventId: {
          attendeeId: attendee.id,
          eventId,
        },
      },
      data: {
        status: 'confirmed',
        validationTime: new Date(),
      },
    });
    res.json({
      valid: true,
      message: 'Registration successful',
      attendee: {
        fullName: attendee.fullName,
        email: attendee.email,
        status: 'confirmed',
        validationTime: new Date().toISOString(),
      },
    });
  } catch (err) {
    res.status(500).json({ valid: false, message: 'Server error' });
  }
};