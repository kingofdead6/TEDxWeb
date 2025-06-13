import { PrismaClient } from '@prisma/client';

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
      },
    });

    res.status(201).json({ message: 'Contact inquiry submitted successfully', contact });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all contact inquiries
export const getContacts = async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' }, // Default to newest first
    });
    res.status(200).json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
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
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Server error' });
  }
};