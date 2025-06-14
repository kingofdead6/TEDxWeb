import { PrismaClient } from '@prisma/client';
import cloudinary from '../utils/cloudinary.js';
import ExcelJS from 'exceljs';

const prisma = new PrismaClient();

// Create a new team member
export const createTeamMember = async (req, res) => {
  try {

    const {
      fullName,
      role,
      description,
      linkedin,
      instagram,
      youtube,
      website,
      isVisibleOnMainPage,
    } = req.body;

    if (!fullName || !role || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let pfpUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'tedx/team_members',
        public_id: `team_member-${Date.now()}`,
      });
      pfpUrl = result.secure_url;
    }

    const teamMember = await prisma.teamMember.create({
      data: {
        fullName,
        role,
        description,
        linkedin,
        instagram,
        youtube,
        website,
        pfp: pfpUrl,
        isVisibleOnMainPage: isVisibleOnMainPage === 'true',
      },
    });

    res.status(201).json({ message: 'Team member created successfully', teamMember });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};
// Get all team members
export const getTeamMembers = async (req, res) => {
  try {
    const teamMembers = await prisma.teamMember.findMany();
    res.status(200).json(teamMembers);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get visible team members for main page
export const getVisibleTeamMembers = async (req, res) => {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      where: { isVisibleOnMainPage: true },
    });
    res.status(200).json(teamMembers);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update team member visibility
export const updateTeamMemberVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVisibleOnMainPage } = req.body;

    const teamMember = await prisma.teamMember.findUnique({ where: { id } });
    if (!teamMember) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    const updatedTeamMember = await prisma.teamMember.update({
      where: { id },
      data: { isVisibleOnMainPage },
    });

    res.status(200).json({ message: 'Team member visibility updated', teamMember: updatedTeamMember });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a team member
export const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const teamMember = await prisma.teamMember.findUnique({ where: { id } });
    if (!teamMember) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    // Delete pfp from Cloudinary if exists
    if (teamMember.pfp) {
      const publicId = teamMember.pfp.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`tedx/team_members/${publicId}`);
    }

    await prisma.teamMember.delete({ where: { id } });
    res.status(200).json({ message: 'Team member deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const exportTeamMembers = async (req, res) => {
  try {
    const teamMembers = req.body;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Team Members');

    worksheet.columns = [
      { header: 'Full Name', key: 'fullName', width: 20 },
      { header: 'Role', key: 'role', width: 20 },
      { header: 'Description', key: 'description', width: 40 },
      { header: 'LinkedIn', key: 'linkedin', width: 30 },
      { header: 'Instagram', key: 'instagram', width: 30 },
      { header: 'YouTube', key: 'youtube', width: 30 },
      { header: 'Website', key: 'website', width: 30 },
      { header: 'Profile Picture', key: 'pfp', width: 30 },
      { header: 'Visible on Main Page', key: 'isVisibleOnMainPage', width: 20 },
    ];

    teamMembers.forEach((teamMember) => {
      worksheet.addRow({
        fullName: teamMember.fullName,
        role: teamMember.role,
        description: teamMember.description,
        linkedin: teamMember.linkedin || 'N/A',
        instagram: teamMember.instagram || 'N/A',
        youtube: teamMember.youtube || 'N/A',
        website: teamMember.website || 'N/A',
        pfp: teamMember.pfp || 'N/A',
        isVisibleOnMainPage: teamMember.isVisibleOnMainPage ? 'Yes' : 'No',
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=team-members.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to export team members' });
  }
};