import { PrismaClient } from '@prisma/client';
import cloudinary from '../utils/cloudinary.js';

const prisma = new PrismaClient();

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
    console.error('Get events error:', err);
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
    console.error('Get event error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createEvent = async (req, res) => {
  const {
    title,
    date,
    description,
    location,
    theme,
    watchTalks,
    seats,
    isRegistrationOpen,
    responsibles,
    speakerIds,
    partnerIds,
  } = req.body;
  let pictureUrl = '';
  let galleryUrls = [];

  try {
    // Validate required fields
    if (!title || !date || !location || !theme) {
      return res.status(400).json({ message: 'Title, date, location, and theme are required' });
    }

    // Handle single picture upload
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

    // Handle gallery images upload
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

    // Parse array fields and ensure correct types
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

    // Log input data for debugging
    console.log('Parsed IDs:', {
      responsibleIds,
      parsedSpeakerIds,
      parsedPartnerIds,
      createdById: req.user.id,
    });

    // Validate related records exist
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

    // Conditionally add relations
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

    // Log eventData before creating
    console.log('eventData:', JSON.stringify(eventData, null, 2));

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
    console.error('Create event error:', err);
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
  const { date, description, location, responsibles, theme, watchTalks, speakerIds, partnerIds, seats, isRegistrationOpen } = req.body;
  let pictureUrl = '';

  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
    });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Handle single picture upload
    if (req.files && req.files.picture) {
      // Delete old picture if exists
      if (event.picture) {
        const publicId = event.picture.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`events/${publicId}`);
      }
      const pictureResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: 'events' }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        });
        stream.end(req.files.picture[0].buffer);
      });
      pictureUrl = pictureResult.secure_url;
    }

    const updateData = {
      date: date ? new Date(date) : event.date,
      description: description || event.description,
      location: location || event.location,
      theme: theme || event.theme,
      watchTalks: watchTalks || event.watchTalks,
      picture: pictureUrl || event.picture,
      seats: seats ? parseInt(seats) : event.seats,
      isRegistrationOpen: isRegistrationOpen !== undefined ? (isRegistrationOpen === 'true' || isRegistrationOpen === true) : event.isRegistrationOpen,
    };

    // Handle responsibles
    if (responsibles) {
      const parsedResponsibleIds = JSON.parse(responsibles);
      updateData.responsibles = {
        set: [], // Disconnect existing responsibles
        connect: parsedResponsibleIds.map((id) => ({ id })),
      };
    }

    // Handle speakers
    if (speakerIds) {
      const parsedSpeakerIds = JSON.parse(speakerIds);
      updateData.speakers = {
        set: [], // Disconnect existing speakers
        connect: parsedSpeakerIds.map((id) => ({ id })),
      };
    }

    // Handle partners
    if (partnerIds) {
      const parsedPartnerIds = JSON.parse(partnerIds);
      updateData.partners = {
        set: [], // Disconnect existing partners
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
    console.error('Update event error:', err);
    res.status(400).json({ message: err.message || 'Failed to update event' });
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

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    let galleryUrls = event.gallery || [];

    // Handle gallery images upload
    if (req.files && req.files.gallery) {
      const galleryPromises = req.files.gallery.map((file) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ folder: 'event-gallery' }, (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          });
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
    console.error('Add gallery images error:', err);
    res.status(400).json({ message: err.message || 'Failed to add gallery images' });
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

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Delete associated images from Cloudinary
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
    console.error('Delete event error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getRegistrations = async (req, res) => {
  try {
    const { eventId } = req.query;
    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required' });
    }

    const registrations = await prisma.registration.findMany({
      where: { eventId },
      include: {
        attendee: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
    });

    // Flatten the response to include attendee details directly
    const formattedRegistrations = registrations.map((reg) => ({
      id: reg.id,
      fullName: reg.attendee.fullName,
      email: reg.attendee.email,
      phoneNumber: reg.attendee.phoneNumber,
      checkedIn: reg.checkedIn || false,
    }));

    res.json(formattedRegistrations);
  } catch (err) {
    console.error('Get registrations error:', err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    await prisma.$disconnect();
  }
};