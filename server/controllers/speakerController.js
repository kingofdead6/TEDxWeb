import { PrismaClient } from '@prisma/client';
import cloudinary from '../utils/cloudinary.js';

const prisma = new PrismaClient();

// Create a new speaker
export const createSpeaker = async (req, res) => {
  try {
    const {
      fullName, email, phoneNumber, occupation, organization, cityCountry,
      linkedin, instagram, website, talkTitle, talkSummary, talkImportance,
      priorTalk, priorTalkDetails, speakerQualities, pastSpeeches, additionalInfo,
      isVisibleOnMainPage
    } = req.body;

    // Basic validation
    if (!fullName || !email || !phoneNumber || !occupation || !organization || !cityCountry || !talkTitle || !talkSummary || !talkImportance || !priorTalk || !speakerQualities) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Handle file upload (pfp)
    let pfpUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'tedx/speakers',
        public_id: `speaker-${Date.now()}`,
      });
      pfpUrl = result.secure_url;
    }

    const speaker = await prisma.speaker.create({
      data: {
        fullName,
        email,
        phoneNumber,
        occupation,
        organization,
        cityCountry,
        linkedin,
        instagram,
        website,
        talkTitle,
        talkSummary,
        talkImportance,
        priorTalk,
        priorTalkDetails,
        speakerQualities,
        pastSpeeches,
        additionalInfo,
        pfp: pfpUrl,
        isVisibleOnMainPage: isVisibleOnMainPage === 'true',
      },
    });

    res.status(201).json({ message: 'Speaker created successfully', speaker });
  } catch (error) {
    console.error('Error creating speaker:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all speakers
export const getSpeakers = async (req, res) => {
  try {
    const speakers = await prisma.speaker.findMany();
    res.status(200).json(speakers);
  } catch (error) {
    console.error('Error fetching speakers:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get visible speakers for main page
export const getVisibleSpeakers = async (req, res) => {
  try {
    const speakers = await prisma.speaker.findMany({
      where: { isVisibleOnMainPage: true },
    });
    res.status(200).json(speakers);
  } catch (error) {
    console.error('Error fetching visible speakers:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update speaker visibility
export const updateSpeakerVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVisibleOnMainPage } = req.body;

    const speaker = await prisma.speaker.findUnique({ where: { id } });
    if (!speaker) {
      return res.status(404).json({ error: 'Speaker not found' });
    }

    const updatedSpeaker = await prisma.speaker.update({
      where: { id },
      data: { isVisibleOnMainPage: isVisibleOnMainPage },
    });

    res.status(200).json({ message: 'Speaker visibility updated', speaker: updatedSpeaker });
  } catch (error) {
    console.error('Error updating speaker visibility:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a speaker
export const deleteSpeaker = async (req, res) => {
  try {
    const { id } = req.params;
    const speaker = await prisma.speaker.findUnique({ where: { id } });
    if (!speaker) {
      return res.status(404).json({ error: 'Speaker not found' });
    }

    // Delete pfp from Cloudinary if exists
    if (speaker.pfp) {
      const publicId = speaker.pfp.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`tedx/speakers/${publicId}`);
    }

    await prisma.speaker.delete({ where: { id } });
    res.status(200).json({ message: 'Speaker deleted successfully' });
  } catch (error) {
    console.error('Error deleting speaker:', error);
    res.status(500).json({ error: 'Server error' });
  }
};