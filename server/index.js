// backend/index.js
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import performerRoutes from './routes/performerRoutes.js';
import speakerRoutes from './routes/speakerRoutes.js';
import volunteerRoutes from './routes/volunteerRoutes.js';
import pressRoutes from './routes/pressRoutes.js';
import partnerRoutes from './routes/partnerRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import attendeeRoutes from './routes/attendeeRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

// Routes
app.use('/api/performers', performerRoutes);
app.use('/api/speakers', speakerRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/press', pressRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/attendees', attendeeRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('TEDx API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});