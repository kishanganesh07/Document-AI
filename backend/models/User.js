import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatarUrl: { type: String },
  jobTitle: { type: String },
  role: { type: String, default: 'member' },
  organizationId: { type: String, default: 'org_001' }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;
