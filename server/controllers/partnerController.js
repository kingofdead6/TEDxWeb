import { PrismaClient } from '@prisma/client';
import cloudinary from '../utils/cloudinary.js';
import ExcelJS from 'exceljs';

const prisma = new PrismaClient();

export const createPartner = async (req, res) => {
  try {
    const formData = req.body; 

    const {
      organizationName, contactPerson, contactEmail, contactPhone, websiteLinks,
      cityCountry, orgType, otherOrgType, whyPartner, supportType,
      otherSupportType, specificEvents, partnershipBenefits, additionalComments,
      isVisibleOnMainPage, addedByAdmin
    } = formData;

    // Basic validation
    if (!organizationName || !contactPerson || !contactEmail || !contactPhone || !websiteLinks || !cityCountry || !orgType || !whyPartner || !specificEvents || !partnershipBenefits) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let companyProfileUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'tedx/partners',
        public_id: `partner-${Date.now()}`,
      });
      companyProfileUrl = result.secure_url;
    }

    const partner = await prisma.partner.create({
      data: {
        organizationName,
        contactPerson,
        contactEmail,
        contactPhone,
        websiteLinks,
        cityCountry,
        orgType,
        otherOrgType,
        whyPartner,
        supportType: JSON.parse(supportType),
        otherSupportType,
        specificEvents,
        partnershipBenefits,
        companyProfile: companyProfileUrl,
        additionalComments,
        isVisibleOnMainPage: isVisibleOnMainPage === 'true',
        addedByAdmin: addedByAdmin === 'true',
      },
    });

    res.status(201).json({ message: 'Partner created successfully', partner });
  } catch (error) {
    console.error('Error creating partner:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all partners
export const getPartners = async (req, res) => {
  try {
    const partners = await prisma.partner.findMany();
    res.status(200).json(partners);
  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get visible partners for main page
export const getVisiblePartners = async (req, res) => {
  try {
    const partners = await prisma.partner.findMany({
      where: { isVisibleOnMainPage: true },
    });
    res.status(200).json(partners);
  } catch (error) {
    console.error('Error fetching visible partners:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update partner visibility
export const updatePartnerVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVisibleOnMainPage } = req.body;

    const partner = await prisma.partner.findUnique({ where: { id } });
    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    const updatedPartner = await prisma.partner.update({
      where: { id },
      data: { isVisibleOnMainPage: isVisibleOnMainPage },
    });

    res.status(200).json({ message: 'Partner visibility updated', partner: updatedPartner });
  } catch (error) {
    console.error('Error updating partner visibility:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a partner
export const deletePartner = async (req, res) => {
  try {
    const { id } = req.params;
    const partner = await prisma.partner.findUnique({ where: { id } });
    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    // Delete companyProfile from Cloudinary if exists
    if (partner.companyProfile) {
      const publicId = partner.companyProfile.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`tedx/partners/${publicId}`);
    }

    await prisma.partner.delete({ where: { id } });
    res.status(200).json({ message: 'Partner deleted successfully' });
  } catch (error) {
    console.error('Error deleting partner:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const exportPartners = async (req, res) => {
  try {
    const partners = req.body;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Partners');

    worksheet.columns = [
      { header: 'Organization Name', key: 'organizationName', width: 25 },
      { header: 'Contact Person', key: 'contactPerson', width: 20 },
      { header: 'Email', key: 'contactEmail', width: 30 },
      { header: 'Phone', key: 'contactPhone', width: 15 },
      { header: 'Website', key: 'websiteLinks', width: 30 },
      { header: 'City/Country', key: 'cityCountry', width: 20 },
      { header: 'Org Type', key: 'orgType', width: 20 },
      { header: 'Other Org Type', key: 'otherOrgType', width: 20 },
      { header: 'Why Partner', key: 'whyPartner', width: 40 },
      { header: 'Support Type', key: 'supportType', width: 30 },
      { header: 'Other Support Type', key: 'otherSupportType', width: 20 },
      { header: 'Specific Events', key: 'specificEvents', width: 30 },
      { header: 'Partnership Benefits', key: 'partnershipBenefits', width: 40 },
      { header: 'Company Profile', key: 'companyProfile', width: 30 },
      { header: 'Additional Comments', key: 'additionalComments', width: 40 },
      { header: 'Visible on Main Page', key: 'isVisibleOnMainPage', width: 20 },
      { header: 'Added by Admin', key: 'addedByAdmin', width: 15 },
    ];

    partners.forEach((partner) => {
      worksheet.addRow({
        organizationName: partner.organizationName,
        contactPerson: partner.contactPerson,
        contactEmail: partner.contactEmail,
        contactPhone: partner.contactPhone,
        websiteLinks: partner.websiteLinks,
        cityCountry: partner.cityCountry,
        orgType: partner.orgType,
        otherOrgType: partner.otherOrgType || 'N/A',
        whyPartner: partner.whyPartner,
        supportType: partner.supportType.join(', '),
        otherSupportType: partner.otherSupportType || 'N/A',
        specificEvents: partner.specificEvents,
        partnershipBenefits: partner.partnershipBenefits,
        companyProfile: partner.companyProfile || 'N/A',
        additionalComments: partner.additionalComments || 'N/A',
        isVisibleOnMainPage: partner.isVisibleOnMainPage ? 'Yes' : 'No',
        addedByAdmin: partner.addedByAdmin ? 'Yes' : 'No',
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=partners.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to export partners' });
  }
};