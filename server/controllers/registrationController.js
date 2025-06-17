import { PrismaClient } from '@prisma/client';
import QRCode from 'qrcode';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const createAttendeeAndRegistration = async (req, res) => {
  try {
    const {
      fullName, email, phoneNumber, dateOfBirth, gender, cityCountry, occupation,
      companyUniversity, eventChoice, reasonToAttend, attendedBefore, previousEvents,
      howHeard, howHeardOther, dietaryRestrictions, interests, interestsOther,
      receiveUpdates, eventId,
    } = req.body;

    if (!fullName || !email || !phoneNumber || !dateOfBirth || !cityCountry || !occupation || !companyUniversity || !eventChoice || !eventId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    let attendee = await prisma.attendee.findUnique({
      where: { email },
    });

    if (!attendee) {
      attendee = await prisma.attendee.create({
        data: {
          id: uuidv4(),
          fullName, email, phoneNumber, dateOfBirth: new Date(dateOfBirth), gender,
          cityCountry, occupation, companyUniversity, eventChoice, reasonToAttend,
          attendedBefore, previousEvents, howHeard, howHeardOther, dietaryRestrictions,
          interests: interests || [], interestsOther, receiveUpdates,
        },
      });
    }

    const existingRegistration = await prisma.registration.findFirst({
      where: { attendeeId: attendee.id, eventId },
    });
    if (existingRegistration) {
      return res.status(400).json({ error: 'You are already registered for this event' });
    }

    const registration = await prisma.registration.create({
      data: {
        id: uuidv4(),
        attendeeId: attendee.id,
        eventId,
        status: 'pending',
      },
      include: { attendee: true, event: true },
    });

    const qrData = JSON.stringify({
      attendeeId: attendee.id, fullName: attendee.fullName, email: attendee.email,
      eventId, eventTitle: eventChoice,
    });
    const qrCodeBuffer = await QRCode.toBuffer(qrData, { type: 'png' });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `TEDx Registration Confirmation for ${eventChoice}`,
      html: `
        <h1>Thank You for Registering for ${eventChoice}!</h1>
        <p>Dear ${fullName},</p>
        <p>Your registration for ${eventChoice} has been received. Please find your QR code attached, which you can use to validate your presence at the event.</p>
        <p><strong>Event Details:</strong></p>
        <ul>
          <li>Event: ${eventChoice}</li>
          <li>Date: ${new Date(event.date).toLocaleDateString('en-GB')}</li>
          <li>Location: ${event.location}</li>
        </ul>
        <p>If you have any questions, contact us at <a href="mailto:contact@tedxalgeria.com">contact@tedxalgeria.com</a>.</p>
        <p>We look forward to seeing you!</p>
        <p>Best regards,<br>The TEDxAlgeria Team</p>
      `,
      attachments: [
        { filename: 'registration-qr-code.png', content: qrCodeBuffer, contentType: 'image/png' },
      ],
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: 'Registration successful! Please check your email for your QR code.',
      registration,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  } finally {
    await prisma.$disconnect();
  }
};

export const createRegistration = async (req, res) => {
  try {
    const { attendeeId, eventId, status } = req.body;

    if (!attendeeId || !eventId) {
      return res.status(400).json({ error: 'Missing required fields: attendeeId and eventId' });
    }

    const attendee = await prisma.attendee.findUnique({
      where: { id: attendeeId },
    });
    if (!attendee) {
      return res.status(404).json({ error: 'Attendee not found' });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const registration = await prisma.registration.create({
      data: {
        id: uuidv4(),
        attendeeId,
        eventId,
        status: status || 'pending',
      },
      include: {
        attendee: true,
        event: true,
      },
    });

    const qrData = JSON.stringify({
      attendeeId: attendee.id,
      fullName: attendee.fullName,
      email: attendee.email,
      eventId,
      eventTitle: event.title,
    });
    const qrCodeBuffer = await QRCode.toBuffer(qrData, { type: 'png' });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: attendee.email,
      subject: `TEDx Registration Confirmation for ${event.title}`,
      html: `
        <h1>Thank You for Registering for ${event.title}!</h1>
        <p>Dear ${attendee.fullName},</p>
        <p>Your registration for ${event.title} has been received. Please find your QR code attached, which you can use to validate your presence at the event.</p>
        <p><strong>Event Details:</strong></p>
        <ul>
          <li>Event: ${event.title}</li>
          <li>Date: ${new Date(event.date).toLocaleDateString('en-GB')}</li>
          <li>Location: ${event.location}</li>
        </ul>
        <p>If you have any questions, contact us at <a href="mailto:contact@tedxalgeria.com">contact@tedxalgeria.com</a>.</p>
        <p>We look forward to seeing you!</p>
        <p>Best regards,<br>The TEDxAlgeria Team</p>
      `,
      attachments: [
        { filename: 'registration-qr-code.png', content: qrCodeBuffer, contentType: 'image/png' },
      ],
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Registration created successfully', registration });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  } finally {
    await prisma.$disconnect();
  }
};

export const sendEmailsToSelected = async (req, res) => {
  try {
    const { registrationIds, eventId } = req.body;

    if (!registrationIds || !Array.isArray(registrationIds) || registrationIds.length === 0 || !eventId) {
      return res.status(400).json({ error: 'Registration IDs and event ID are required' });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const registrations = await prisma.registration.findMany({
      where: { id: { in: registrationIds }, eventId },
      include: { attendee: true },
    });

    for (const reg of registrations) {
      const qrData = JSON.stringify({
        attendeeId: reg.attendee.id,
        fullName: reg.attendee.fullName,
        email: reg.attendee.email,
        eventId,
        eventTitle: event.title,
      });
      const qrCodeBuffer = await QRCode.toBuffer(qrData, { type: 'png' });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: reg.attendee.email,
        subject: `TEDx Registration Confirmation for ${event.title}`,
        html: `
          <h1>Thank You for Registering for ${event.title}!</h1>
          <p>Dear ${reg.attendee.fullName},</p>
          <p>Your registration for ${event.title} has been received. Please find your QR code attached, which you can use to validate your presence at the event.</p>
          <p><strong>Event Details:</strong></p>
          <ul>
            <li>Event: ${event.title}</li>
            <li>Date: ${new Date(event.date).toLocaleDateString ('en-GB')}
            </li>
            <li>Location: ${event.location}</li>
          </ul>
          <p>If you have any questions, contact us at <a href="mailto:contact@tedxalgeria.com">contact@tedxalgeria.com</a>.</p>
          <p>We look forward to seeing you!</p>
          <p>Best regards,<br>The TEDxAlgeria Team</p>
        `,
        attachments: [
          { filename: 'registration-qr-code.png', content: qrCodeBuffer, contentType: 'image/png' },
        ],
      };

      await transporter.sendMail(mailOptions);
    }

    res.json({ message: `Emails sent to ${registrations.length} attendees` });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  } finally {
    await prisma.$disconnect();
  }
};