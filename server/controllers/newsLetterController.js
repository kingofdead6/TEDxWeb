import { PrismaClient } from '@prisma/client';
import ExcelJS from 'exceljs';

const prisma = new PrismaClient();

// Subscribe to newsletter
export const subscribeNewsletter = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Basic validation
    if (!name || !email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: 'Name and valid email are required' });
    }

    // Check if email already exists
    const existingSubscription = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (existingSubscription) {
      return res.status(400).json({ error: 'Email already subscribed' });
    }

    const subscription = await prisma.newsletter.create({
      data: {
        name,
        email,
        isActive: true,
      },
    });

    res.status(201).json({ message: 'Successfully subscribed to newsletter', subscription });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all newsletter subscriptions
export const getNewsletterSubscriptions = async (req, res) => {
  try {
    const subscriptions = await prisma.newsletter.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update subscription status
export const updateSubscriptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const subscription = await prisma.newsletter.findUnique({ where: { id } });
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const updatedSubscription = await prisma.newsletter.update({
      where: { id },
      data: { isActive },
    });

    res.status(200).json({ message: 'Subscription status updated successfully', subscription: updatedSubscription });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a subscription
export const deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await prisma.newsletter.findUnique({ where: { id } });
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    await prisma.newsletter.delete({ where: { id } });
    res.status(200).json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Export subscriptions to Excel
export const exportSubscriptions = async (req, res) => {
  try {
    const subscriptions = await prisma.newsletter.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Newsletter Subscriptions');

    worksheet.columns = [
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Status', key: 'isActive', width: 10 },
      { header: 'Subscribed At', key: 'createdAt', width: 20 },
    ];

    subscriptions.forEach((subscription) => {
      worksheet.addRow({
        name: subscription.name,
        email: subscription.email,
        isActive: subscription.isActive ? 'Active' : 'Inactive',
        createdAt: new Date(subscription.createdAt).toLocaleString(),
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=newsletter_subscriptions.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Export subscriptions error:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to export subscriptions' });
  }
};