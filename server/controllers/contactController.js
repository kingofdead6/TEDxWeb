import { PrismaClient } from '@prisma/client';
import ExcelJS from 'exceljs';

const prisma = new PrismaClient();

// Create a new contact inquiry
export const createContact = async (req, res) => {
  try {
    const {
      fullName, email, phoneNumber, organization, reason, otherReason,
      message, preferredContact, hearAboutUs, otherHearAboutUs
    } = req.body;

    // Basic validation
    if (!fullName || !email || !reason || !message || !preferredContact || !hearAboutUs) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const contact = await prisma.contact.create({
      data: {
        fullName,
        email,
        phoneNumber,
        organization,
        reason,
        otherReason,
        message,
        preferredContact,
        hearAboutUs,
        otherHearAboutUs,
        isSeen: false, // Default to unseen
      },
    });

    res.status(201).json({ message: 'Contact inquiry submitted successfully', contact });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all contact inquiries
export const getContacts = async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update contact seen status
export const updateContactSeen = async (req, res) => {
  try {
    const { id } = req.params;
    const { isSeen } = req.body;

    const contact = await prisma.contact.findUnique({ where: { id } });
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    const updatedContact = await prisma.contact.update({
      where: { id },
      data: { isSeen },
    });

    res.status(200).json({ message: 'Contact status updated successfully', contact: updatedContact });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a contact inquiry
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await prisma.contact.findUnique({ where: { id } });
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    await prisma.contact.delete({ where: { id } });
    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const exportContacts = async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Contacts');

    worksheet.columns = [
      { header: 'Full Name', key: 'fullName', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone Number', key: 'phoneNumber', width: 15 },
      { header: 'Organization', key: 'organization', width: 25 },
      { header: 'Reason', key: 'reason', width: 20 },
      { header: 'Other Reason', key: 'otherReason', width: 20 },
      { header: 'Message', key: 'message', width: 40 },
      { header: 'Preferred Contact', key: 'preferredContact', width: 20 },
      { header: 'Heard About Us', key: 'hearAboutUs', width: 20 },
      { header: 'Other Source', key: 'otherHear', width: 20 },
      { header: 'Status', key: 'isSeen', width: 10 },
      { header: 'Submitted', key: 'createdAt', width: 20 },
    ];

    contacts.forEach((contact) => {
      worksheet.addRow({
        fullName: contact.fullName,
        email: contact.email,
        phoneNumber: contact.phoneNumber || 'N/A',
        organization: contact.organization || 'N/A',
        reason: contact.reason,
        otherReason: contact.otherReason || 'N/A',
        message: contact.message,
        preferredContact: contact.preferredContact,
        hearAboutUs: contact.hearAboutUs,
        otherHear: contact.otherHear || 'N/A',
        isSeen: contact.isSeen ? 'Seen' : 'Unseen',
        createdAt: new Date(contact.createdAt).toLocaleString(),
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=contact_messages.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to export contacts' });
  }
};