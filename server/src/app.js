import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.js';
import campaignRoutes from './routes/campaigns.js';
import analyticsRoutes from './routes/analytics.js';
import auditRoutes from './routes/audit.js';
import rulesRoutes from './routes/rules.js';
import reportsRoutes from './routes/reports.js';
import notificationsRoutes from './routes/notifications.js';
import usersRoutes from './routes/users.js';
import { seedDemoData } from './utils/seedDemoData.js';
import { protect } from './middlewares/auth.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/campaigns', campaignRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/audit', auditRoutes);
app.use('/api/v1/rules', rulesRoutes);
app.use('/api/v1/reports', reportsRoutes);
app.use('/api/v1/notifications', notificationsRoutes);
app.use('/api/v1/users', usersRoutes);

// Demo data seed endpoint
app.post('/api/v1/seed-demo', protect, async (req, res) => {
  try {
    const account = await seedDemoData(req.user._id);
    res.json({ success: true, data: { message: 'Demo data seeded', accountId: account._id } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Check demo status
app.get('/api/v1/account-status', protect, async (req, res) => {
  try {
    const GoogleAccount = (await import('./models/GoogleAccount.js')).default;
    const account = await GoogleAccount.findOne({ userId: req.user._id });
    res.json({ success: true, data: { hasAccount: !!account, account: account || null } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default app;
