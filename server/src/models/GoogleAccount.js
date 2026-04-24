import mongoose from 'mongoose';

const googleAccountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  customerId: { type: String, required: true },
  accountName: { type: String },
  currencyCode: { type: String, default: 'INR' },
  timeZone: { type: String },
  accessToken: { type: String },
  refreshToken: { type: String },
  tokenExpiresAt: { type: Date },
  isActive: { type: Boolean, default: true },
  lastSyncAt: { type: Date },
  syncStatus: { type: String, enum: ['pending', 'syncing', 'success', 'error'], default: 'pending' },
  syncError: { type: String },
  permissions: {
    canReadCampaigns: { type: Boolean, default: true },
    canWriteBids: { type: Boolean, default: false },
    canWriteBudgets: { type: Boolean, default: false },
    canWriteKeywords: { type: Boolean, default: false },
  },
}, { timestamps: true });

export default mongoose.model('GoogleAccount', googleAccountSchema);
