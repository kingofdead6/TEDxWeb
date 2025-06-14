import { PrismaClient } from '@prisma/client';
import cloudinary from '../utils/cloudinary.js';
import csvParser from 'csv-parser';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import QRCode from 'qrcode';
import { Readable } from 'stream';

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const getEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        createdBy: { select: { name: true } },
        responsibles: { select: { id: true, name: true } },
        speakers: { select: { id: true, fullName: true } },
        partners: { select: { id: true, organizationName: true } },
      },
    });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: {
        createdBy: { select: { name: true } },
        responsibles: { select: { id: true, name: true } },
        speakers: { select: { id: true, fullName: true } },
        partners: { select: { id: true, organizationName: true } },
      },
    });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createEvent = async (req, res) => {
  const {
    title, date, description, location, theme, watchTalks, seats,
    isRegistrationOpen, responsibles, speakerIds, partnerIds,
  } = req.body;
  let pictureUrl = '';
  let galleryUrls = [];

  try {
    if (!title || !date || !location || !theme) {
      return res.status(400).json({ message: 'Title, date, location, and theme are required' });
    }

    if (req.files && req.files.picture) {
      const pictureResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'events', resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.files.picture[0].buffer);
      });
      pictureUrl = pictureResult.secure_url;
    }

    if (req.files && req.files.gallery) {
      const galleryPromises = req.files.gallery.map((file) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'event-gallery', resource_type: 'image' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          stream.end(file.buffer);
        })
      );
      galleryUrls = await Promise.all(galleryPromises);
    }

    const responsibleIds = Array.isArray(responsibles)
      ? responsibles.map((id) => parseInt(id))
      : responsibles
      ? responsibles.split(',').map((id) => parseInt(id.trim()))
      : [];
    const parsedSpeakerIds = Array.isArray(speakerIds)
      ? speakerIds
      : speakerIds
      ? speakerIds.split(',').map((id) => id.trim())
      : [];
    const parsedPartnerIds = Array.isArray(partnerIds)
      ? partnerIds
      : partnerIds
      ? partnerIds.split(',').map((id) => id.trim())
      : [];

    if (responsibleIds.length) {
      const users = await prisma.user.findMany({
        where: { id: { in: responsibleIds } },
      });
      if (users.length !== responsibleIds.length) {
        return res.status(400).json({ message: 'One or more responsible user IDs are invalid' });
      }
    }
    if (parsedSpeakerIds.length) {
      const speakers = await prisma.speaker.findMany({
        where: { id: { in: parsedSpeakerIds } },
      });
      if (speakers.length !== parsedSpeakerIds.length) {
        return res.status(400).json({ message: 'One or more speaker IDs are invalid' });
      }
    }
    if (parsedPartnerIds.length) {
      const partners = await prisma.partner.findMany({
        where: { id: { in: parsedPartnerIds } },
      });
      if (partners.length !== parsedPartnerIds.length) {
        return res.status(400).json({ message: 'One or more partner IDs are invalid' });
      }
    }

    const eventData = {
      title,
      date: new Date(date),
      description: description || '',
      location,
      theme,
      createdById: parseInt(req.user.id),
      picture: pictureUrl || null,
      gallery: galleryUrls || [],
      watchTalks: watchTalks || null,
      checkins: 0,
      seats: seats ? parseInt(seats) : null,
      isRegistrationOpen: isRegistrationOpen === 'true' || isRegistrationOpen === true,
    };

    if (responsibleIds.length) {
      eventData.responsibles = {
        connect: responsibleIds.map((id) => ({ id })),
      };
    }
    if (parsedSpeakerIds.length) {
      eventData.speakers = {
        connect: parsedSpeakerIds.map((id) => ({ id })),
      };
    }
    if (parsedPartnerIds.length) {
      eventData.partners = {
        connect: parsedPartnerIds.map((id) => ({ id })),
      };
    }

    const event = await prisma.event.create({
      data: eventData,
      include: {
        createdBy: { select: { name: true } },
        responsibles: { select: { id: true, name: true } },
        speakers: { select: { id: true, fullName: true } },
        partners: { select: { id: true, organizationName: true } },
      },
    });

    res.json(event);
  } catch (err) {
    if (err.name === 'PrismaClientInitializationError') {
      return res.status(500).json({
        message: 'Failed to connect to the database',
        details: err.message,
      });
    }
    if (err.name === 'PrismaClientValidationError') {
      return res.status(400).json({
        message: 'Invalid data provided for event creation',
        details: err.message,
      });
    }
    res.status(400).json({
      message: err.message || 'Failed to create event',
      details: err.meta?.cause || err.message,
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const updateEvent = async (req, res) => {
  const {
    title, date, description, location, theme, watchTalks, seats,
    isRegistrationOpen, responsibles, speakerIds, partnerIds,
  } = req.body;
  let pictureUrl = '';
  let galleryUrls = [];

  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: {
        responsibles: true,
        speakers: true,
        partners: true,
      },
    });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (req.files && req.files.picture) {
      if (event.picture) {
        const publicId = event.picture.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`events/${publicId}`);
      }
      const pictureResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'events', resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.files.picture[0].buffer);
      });
      pictureUrl = pictureResult.secure_url;
    }

    if (req.files && req.files.gallery) {
      if (event.gallery.length > 0) {
        const galleryPublicIds = event.gallery.map((url) => `event-gallery/${url.split('/').pop().split('.')[0]}`);
        await Promise.all(galleryPublicIds.map((id) => cloudinary.uploader.destroy(id)));
      }
      const galleryPromises = req.files.gallery.map((file) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'event-gallery', resource_type: 'image' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          stream.end(file.buffer);
        })
      );
      galleryUrls = await Promise.all(galleryPromises);
    } else {
      galleryUrls = event.gallery;
    }

    const responsibleIds = Array.isArray(responsibles)
      ? responsibles.map((id) => parseInt(id))
      : responsibles
      ? responsibles.split(',').map((id) => parseInt(id.trim()))
      : [];
    const parsedSpeakerIds = Array.isArray(speakerIds)
      ? speakerIds
      : speakerIds
      ? speakerIds.split(',').map((id) => id.trim())
      : [];
    const parsedPartnerIds = Array.isArray(partnerIds)
      ? partnerIds
      : partnerIds
      ? partnerIds.split(',').map((id) => id.trim())
      : [];

    if (responsibleIds.length) {
      const users = await prisma.user.findMany({
        where: { id: { in: responsibleIds } },
      });
      if (users.length !== responsibleIds.length) {
        return res.status(400).json({ message: 'One or more responsible user IDs are invalid' });
      }
    }
    if (parsedSpeakerIds.length) {
      const speakers = await prisma.speaker.findMany({
        where: { id: { in: parsedSpeakerIds } },
      });
      if (speakers.length !== parsedSpeakerIds.length) {
        return res.status(400).json({ message: 'One or more speaker IDs are invalid' });
      }
    }
    if (parsedPartnerIds.length) {
      const partners = await prisma.partner.findMany({
        where: { id: { in: parsedPartnerIds } },
      });
      if (partners.length !== parsedPartnerIds.length) {
        return res.status(400).json({ message: 'One or more partner IDs are invalid' });
      }
    }

    const updateData = {
      title: title || event.title,
      date: date ? new Date(date) : event.date,
      description: description || event.description,
      location: location || event.location,
      theme: theme || event.theme,
      watchTalks: watchTalks || event.watchTalks,
      picture: pictureUrl || event.picture,
      gallery: galleryUrls,
      seats: seats ? parseInt(seats) : event.seats,
      isRegistrationOpen:
        isRegistrationOpen !== undefined
          ? isRegistrationOpen === 'true' || isRegistrationOpen === true
          : event.isRegistrationOpen,
    };

    if (responsibles) {
      updateData.responsibles = {
        set: [],
        connect: responsibleIds.map((id) => ({ id })),
      };
    }
    if (speakerIds) {
      updateData.speakers = {
        set: [],
        connect: parsedSpeakerIds.map((id) => ({ id })),
      };
    }
    if (partnerIds) {
      updateData.partners = {
        set: [],
        connect: parsedPartnerIds.map((id) => ({ id })),
      };
    }

    const updatedEvent = await prisma.event.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        createdBy: { select: { name: true } },
        responsibles: { select: { id: true, name: true } },
        speakers: { select: { id: true, fullName: true } },
        partners: { select: { id: true, organizationName: true } },
      },
    });

    res.json(updatedEvent);
  } catch (err) {
    if (err.name === 'PrismaClientInitializationError') {
      return res.status(500).json({
        message: 'Failed to connect to the database',
        details: err.message,
      });
    }
    if (err.name === 'PrismaClientValidationError') {
      return res.status(400).json({
        message: 'Invalid data provided for event update',
        details: err.message,
      });
    }
    res.status(400).json({
      message: err.message || 'Failed to update event',
      details: err.meta?.cause || err.message,
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const addGalleryImages = async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
    });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    let galleryUrls = event.gallery || [];

    if (req.files && req.files.gallery) {
      const galleryPromises = req.files.gallery.map((file) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'event-gallery', resource_type: 'image' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          stream.end(file.buffer);
        })
      );
      const newUrls = await Promise.all(galleryPromises);
      galleryUrls = [...galleryUrls, ...newUrls];
    }

    const updatedEvent = await prisma.event.update({
      where: { id: req.params.id },
      data: { gallery: galleryUrls },
      include: {
        createdBy: { select: { name: true } },
        responsibles: { select: { id: true, name: true } },
        speakers: { select: { id: true, fullName: true } },
        partners: { select: { id: true, organizationName: true } },
      },
    });

    res.json(updatedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message || 'Failed to add gallery images' });
  } finally {
    await prisma.$disconnect();
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
    });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (event.picture) {
      const publicId = event.picture.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`events/${publicId}`);
    }
    if (event.gallery.length > 0) {
      const galleryPublicIds = event.gallery.map((url) => `event-gallery/${url.split('/').pop().split('.')[0]}`);
      await Promise.all(galleryPublicIds.map((id) => cloudinary.uploader.destroy(id)));
    }

    await prisma.event.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  } finally {
    await prisma.$disconnect();
  }
};



export const getRegistrations = async (req, res) => {
  try {
    const { eventId, search, status } = req.query;

    if (!eventId) {
      return res.status(400).json({ error: 'Event ID is required' });
    }

    const where = { eventId };
    if (search) {
      where.attendee = {
        OR: [
          { fullName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      };
    }
    if (status === 'registered') {
      where.checkedIn = false;
    } else if (status === 'checkedIn') {
      where.checkedIn = true;
    }

    console.log('getRegistrations query:', { eventId, search, status, where }); // Debug log

    const registrations = await prisma.registration.findMany({
      where,
      include: {
        attendee: true, // Include all Attendee fields
      },
    });

    const formattedRegistrations = registrations.map((reg) => ({
      id: reg.id,
      attendeeId: reg.attendee.id,
      fullName: reg.attendee.fullName,
      email: reg.attendee.email,
      phoneNumber: reg.attendee.phoneNumber,
      checkedIn: reg.checkedIn,
      validationTime: reg.validationTime,
      attendee: {
        id: reg.attendee.id,
        fullName: reg.attendee.fullName,
        email: reg.attendee.email,
        phoneNumber: reg.attendee.phoneNumber,
        dateOfBirth: reg.attendee.dateOfBirth,
        gender: reg.attendee.gender,
        cityCountry: reg.attendee.cityCountry,
        occupation: reg.attendee.occupation,
        companyUniversity: reg.attendee.companyUniversity,
        eventChoice: reg.attendee.eventChoice,
        eventOther: reg.attendee.eventOther,
        reasonToAttend: reg.attendee.reasonToAttend,
        attendedBefore: reg.attendee.attendedBefore,
        previousEvents: reg.attendee.previousEvents,
        howHeard: reg.attendee.howHeard,
        howHeardOther: reg.attendee.howHeardOther,
        dietaryRestrictions: reg.attendee.dietaryRestrictions,
        interests: reg.attendee.interests,
        interestsOther: reg.attendee.interestsOther,
        receiveUpdates: reg.attendee.receiveUpdates,
        createdAt: reg.attendee.createdAt,
        updatedAt: reg.attendee.updatedAt,
      },
    }));

    console.log('getRegistrations result count:', formattedRegistrations.length); // Debug log

    res.json(formattedRegistrations);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ error: 'Server error' });
  } finally {
    await prisma.$disconnect();
  }
};

export const updateCheckIn = async (req, res) => {
  try {
    const { id } = req.params;
    const { checkedIn } = req.body;

    const registration = await prisma.registration.findUnique({
      where: { id },
      include: { attendee: true, event: true },
    });

    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    const updatedRegistration = await prisma.registration.update({
      where: { id },
      data: {
        checkedIn,
        validationTime: checkedIn ? new Date() : null,
      },
      include: { attendee: true },
    });

    if (checkedIn) {
      await prisma.event.update({
        where: { id: registration.eventId },
        data: { checkins: { increment: 1 } },
      });
    } else {
      await prisma.event.update({
        where: { id: registration.eventId },
        data: { checkins: { decrement: 1 } },
      });
    }

    res.json({
      message: `Check-in ${checkedIn ? 'marked' : 'unmarked'} successfully`,
      registration: updatedRegistration,
    });
  } catch (error) {
    console.error('Error updating check-in status:', error);
    res.status(500).json({ error: 'Server error' });
  } finally {
    await prisma.$disconnect();
  }
};

export const uploadRegistrations = async (req, res) => {
  try {
    const { eventId } = req.body;
    const fileBuffer = req.file?.buffer;

    if (!eventId || !fileBuffer) {
      return res.status(400).json({ error: 'Event ID and CSV file are required' });
    }

    console.log('Raw CSV buffer:', fileBuffer.toString('utf-8').slice(0, 200)); // Debug log (first 200 chars)

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const results = [];
    let processedRows = 0;
    let skippedRows = 0;
    let newAttendees = 0;
    let newRegistrations = 0;

    const stream = Readable.from(fileBuffer);
    stream
      .pipe(csvParser({ mapHeaders: ({ header }) => header.toLowerCase().replace(/\s/g, '') }))
      .on('data', (row) => {
        results.push(row);
      })
      .on('end', async () => {
        console.log('CSV rows parsed:', results.length); // Debug log

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        for (const row of results) {
          processedRows++;
          // Map possible header variations
          const fullName = row.fullname || row.full_name || row.name || row['FULL NAME'] || row.FULLNAME;
          const email = row.email || row.EMAIL;
          const phoneNumber = row.phonenumber || row.phone_number || row.phone || row['PHONE NUMBER'] || row.PHONENUMBER;

          console.log('Normalized CSV row:', { fullName, email, phoneNumber }); // Debug log

          if (!fullName || !email || !phoneNumber) {
            console.log('Skipping row due to missing fields:', row); // Debug log
            skippedRows++;
            continue;
          }

          if (!emailRegex.test(email)) {
            console.log('Skipping row due to invalid email:', row); // Debug log
            skippedRows++;
            continue;
          }

          let attendee = await prisma.attendee.findUnique({ where: { email } });
          if (!attendee) {
            attendee = await prisma.attendee.create({
              data: {
                id: uuidv4(),
                fullName,
                email,
                phoneNumber,
                cityCountry: 'Unknown',
                occupation: 'Unknown',
                companyUniversity: 'Unknown',
                eventChoice: event.title,
                dateOfBirth: new Date(),
              },
            });
            newAttendees++;
            console.log('Created new attendee:', attendee.id); // Debug log
          }

          const existingRegistration = await prisma.registration.findFirst({
            where: { attendeeId: attendee.id, eventId },
          });
          if (!existingRegistration) {
            const registration = await prisma.registration.create({
              data: {
                id: uuidv4(),
                attendeeId: attendee.id,
                eventId,
                status: 'registered',
                checkedIn: false,
              },
            });
            newRegistrations++;
            console.log('Created new registration:', registration.id); // Debug log
          } else {
            console.log('Registration already exists for attendee:', attendee.id); // Debug log
            skippedRows++;
          }
        }

        console.log('CSV upload summary:', {
          processedRows,
          skippedRows,
          newAttendees,
          newRegistrations,
        }); // Debug log

        res.json({
          message: 'Registrations processed successfully',
          processedRows,
          skippedRows,
          newAttendees,
          newRegistrations,
        });
      })
      .on('error', (error) => {
        console.error('Error parsing CSV:', error);
        res.status(500).json({ error: 'Error processing CSV file' });
      });
  } catch (error) {
    console.error('Error uploading registrations:', error);
    res.status(500).json({ error: 'Server error' });
  } finally {
    await prisma.$disconnect();
  }
};

export const validateRegistration = async (req, res) => {
  try {
    const { qrCodeData, eventId } = req.body;

    if (!qrCodeData || !eventId) {
      return res.status(400).json({ valid: false, message: 'QR code data and event ID are required' });
    }

    let parsedData;
    try {
      parsedData = JSON.parse(qrCodeData);
    } catch (error) {
      return res.status(400).json({ valid: false, message: 'Invalid QR code format' });
    }

    const { attendeeId, email, eventId: qrEventId } = parsedData;

    if (!attendeeId && !email) {
      return res.status(400).json({ valid: false, message: 'QR code missing required fields' });
    }

    if (qrEventId && qrEventId !== eventId) {
      return res.status(400).json({ valid: false, message: 'QR code is for a different event' });
    }

    let registration;
    if (attendeeId) {
      registration = await prisma.registration.findFirst({
        where: {
          attendeeId,
          eventId,
        },
        include: {
          attendee: true,
          event: true,
        },
      });
    } else if (email) {
      registration = await prisma.registration.findFirst({
        where: {
          attendee: { email },
          eventId,
        },
        include: {
          attendee: true,
          event: true,
        },
      });
    }

    if (!registration) {
      return res.status(404).json({ valid: false, message: 'Registration not found' });
    }

    const attendeeDetails = {
      id: registration.attendee.id,
      fullName: registration.attendee.fullName,
      email: registration.attendee.email,
      phoneNumber: registration.attendee.phoneNumber,
      checkedIn: registration.checkedIn,
      checkInTime: registration.validationTime,
    };

    if (registration.checkedIn) {
      return res.json({
        valid: true,
        checkedIn: true,
        message: 'Attendee is already checked in',
        attendee: attendeeDetails,
      });
    }

    return res.json({
      valid: true,
      checkedIn: false,
      message: 'QR code is valid',
      attendee: attendeeDetails,
      registrationId: registration.id,
    });
  } catch (error) {
    console.error('Error validating QR code:', error);
    res.status(500).json({ valid: false, message: 'Server error' });
  } finally {
    await prisma.$disconnect();
  }
};

export const confirmCheckIn = async (req, res) => {
  try {
    const { registrationId, eventId } = req.body;

    if (!registrationId || !eventId) {
      return res.status(400).json({ error: 'Registration ID and event ID are required' });
    }

    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: { attendee: true, event: true },
    });

    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    if (registration.eventId !== eventId) {
      return res.status(400).json({ error: 'Registration does not match the event' });
    }

    if (registration.checkedIn) {
      return res.json({
        valid: true,
        checkedIn: true,
        message: 'Attendee is already checked in',
        attendee: {
          id: registration.attendee.id,
          fullName: registration.attendee.fullName,
          email: registration.attendee.email,
          phoneNumber: registration.attendee.phoneNumber,
          checkedIn: registration.checkedIn,
          checkInTime: registration.validationTime,
        },
      });
    }

    const updatedRegistration = await prisma.registration.update({
      where: { id: registrationId },
      data: {
        checkedIn: true,
        validationTime: new Date(),
      },
      include: { attendee: true },
    });

    await prisma.event.update({
      where: { id: eventId },
      data: { checkins: { increment: 1 } },
    });

    res.json({
      valid: true,
      checkedIn: true,
      message: 'Attendee checked in successfully',
      attendee: {
        id: updatedRegistration.attendee.id,
        fullName: updatedRegistration.attendee.fullName,
        email: updatedRegistration.attendee.email,
        phoneNumber: updatedRegistration.attendee.phoneNumber,
        checkedIn: updatedRegistration.checkedIn,
        checkInTime: updatedRegistration.validationTime,
      },
    });
  } catch (error) {
    console.error('Error confirming check-in:', error);
    res.status(500).json({ error: 'Server error' });
  } finally {
    await prisma.$disconnect();
  }
};