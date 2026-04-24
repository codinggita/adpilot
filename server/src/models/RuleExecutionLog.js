import mongoose from 'mongoose';

const ruleExecutionLogSchema = new mongoose.Schema({
  ruleId: { type: mongoose.Schema.Types.ObjectId, ref: 'AutomationRule', required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'GoogleAccount' },
  executedAt: { type: Date, default: Date.now, index: true },
  status: { type: String, enum: ['success', 'no_match', 'partial', 'failed'], default: 'success' },
  itemsEvaluated: { type: Number, default: 0 },
  itemsMatched: { type: Number, default: 0 },
  itemsActedOn: { type: Number, default: 0 },
  actions: [{
    entityType: { type: String },
    entityId: { type: String },
    entityName: { type: String },
    actionTaken: { type: String },
    valueBefore: { type: mongoose.Schema.Types.Mixed },
    valueAfter: { type: mongoose.Schema.Types.Mixed },
    success: { type: Boolean },
    error: { type: String },
  }],
  durationMs: { type: Number },
  errorMessage: { type: String },
});

export default mongoose.model('RuleExecutionLog', ruleExecutionLogSchema);
