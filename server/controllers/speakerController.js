import { PrismaClient } from '@prisma/client';
import cloudinary from '../utils/cloudinary.js';
import ExcelJS from 'exceljs';

const prisma = new PrismaClient();


export const createSpeaker = async (req, res) => {
  try {
    const formData = req.body; 

    const {
      fullName, email, phoneNumber, occupation, organization, cityCountry,
      linkedin, instagram, website, talkTitle, talkSummary, talkImportance,
      priorTalk, priorTalkDetails, speakerQualities, pastSpeeches, additionalInfo,
      isVisibleOnMainPage, addedByAdmin
    } = formData;

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
        addedByAdmin: addedByAdmin === 'true',
      },
    });

    res.status(201).json({ message: 'Speaker created successfully', speaker });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all speakers
export const getSpeakers = async (req, res) => {
  try {
    const speakers = await prisma.speaker.findMany();
    res.status(200).json(speakers);
  } catch (error) {
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
    res.status(500).json({ error: 'Server error' });
  }
};

export const exportSpeakers = async (req, res) => {
  try {
    const speakers = req.body || [];

    if (!speakers.length) {
      return res.status(400).json({ error: 'No speaker data provided' });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Speakers');

    worksheet.columns = [
      { header: 'Full Name', key: 'fullName', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone Number', key: 'phoneNumber', width: 15 },
      { header: 'Occupation', key: 'occupation', width: 20 },
      { header: 'Organization', key: 'organization', width: 25 },
      { header: 'City/Country', key: 'cityCountry', width: 20 },
      { header: 'LinkedIn', key: 'linkedin', width: 30 },
      { header: 'Instagram', key: 'instagram', width: 30 },
      { header: 'Website', key: 'website', width: 30 },
      { header: 'Talk Title', key: 'talkTitle', width: 30 },
      { header: 'Talk Summary', key: 'talkSummary', width: 40 },
      { header: 'Talk Importance', key: 'talkImportance', width: 40 },
      { header: 'Prior Talk', key: 'priorTalk', width: 20 },
      { header: 'Prior Talk Details', key: 'priorTalkDetails', width: 40 },
      { header: 'Speaker Qualities', key: 'speakerQualities', width: 40 },
      { header: 'Past Speeches', key: 'pastSpeeches', width: 40 },
      { header: 'Profile Picture', key: 'pfp', width: 30 },
      { header: 'Additional Info', key: 'additionalInfo', width: 40 },
      { header: 'Visible on Main Page', key: 'isVisibleOnMainPage', width: 20 },
      { header: 'Added by Admin', key: 'addedByAdmin', width: 15 },
    ];

    speakers.forEach((speaker) => {
      worksheet.addRow({
        fullName: speaker.fullName || 'N/A',
        email: speaker.email || 'N/A',
        phoneNumber: speaker.phoneNumber || 'N/A',
        occupation: speaker.occupation || 'N/A',
        organization: speaker.organization || 'N/A',
        cityCountry: speaker.cityCountry || 'N/A',
        linkedin: speaker.linkedin || 'N/A',
        instagram: speaker.instagram || 'N/A',
        website: speaker.website || 'N/A',
        talkTitle: speaker.talkTitle || 'N/A',
        talkSummary: speaker.talkSummary || 'N/A',
        talkImportance: speaker.talkImportance || 'N/A',
        priorTalk: speaker.priorTalk || 'N/A',
        priorTalkDetails: speaker.priorTalkDetails || 'N/A',
        speakerQualities: speaker.speakerQualities || 'N/A',
        pastSpeeches: speaker.pastSpeeches || 'N/A',
        pfp: speaker.pfp || 'N/A',
        additionalInfo: speaker.additionalInfo || 'N/A',
        isVisibleOnMainPage: speaker.isVisibleOnMainPage ? 'Yes' : 'No',
        addedByAdmin: speaker.addedByAdmin ? 'Yes' : 'No',
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=speakers.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to export speakers', details: error.message });
  }
};