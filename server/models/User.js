import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  name: { type: String, trim: true },
  avatar: { type: String },
  googleId: { type: String, unique: true, sparse: true, index: true },
  passwordHash: { type: String, default: null },
  plan: { type: String, enum: ['free', 'growth', 'scale'], default: 'free' },
  planExpiresAt: { type: Date },
  isEmailVerified: { type: Boolean, default: false },
  emailVerifyToken: { type: String },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  preferences: {
    timezone: { type: String, default: 'Asia/Kolkata' },
    currency: { type: String, default: 'INR' },
    weeklyReportDay: { type: Number, default: 1 },
    weeklyReportTime: { type: String, default: '09:00' },
    alertsEnabled: { type: Boolean, default: true },
    emailAlerts: { type: Boolean, default: true },
    inAppAlerts: { type: Boolean, default: true },
  },
  lastLoginAt: { type: Date },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('passwordHash') || !this.passwordHash) return;
  const salt = await bcrypt.genSalt(12);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Remove sensitive fields from JSON
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.passwordHash;
  delete user.resetToken;
  delete user.resetTokenExpiry;
  delete user.emailVerifyToken;
  return user;
};

export default mongoose.model('User', userSchema);
