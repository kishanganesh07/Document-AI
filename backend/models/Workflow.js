import mongoose from 'mongoose';

const workflowStepSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., 'OCR', 'Translate', 'Email', 'UploadDrive'
  config: { type: mongoose.Schema.Types.Map, of: mongoose.Schema.Types.Mixed, default: {} }
});

const workflowSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
  steps: [workflowStepSchema]
}, {
  timestamps: true
});

const Workflow = mongoose.model('Workflow', workflowSchema);
export default Workflow;
