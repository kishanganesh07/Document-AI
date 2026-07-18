import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  documentType: { type: String, required: true }, // e.g., 'invoice', 'offer_letter', 'nda'
  title: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['draft', 'generated', 'verified', 'revoked'], 
    default: 'draft' 
  },
  documentData: { type: mongoose.Schema.Types.Mixed, default: {} }, // Flexible JSON for extracted/generated AI data
  content: { type: String, default: '' }, // Optional raw text content
  currentVersion: { type: Number, default: 1 },
  recipientName: { type: String },
  pdfUrl: { type: String }, // For generated PDFs
  verificationId: { type: String, unique: true, sparse: true },
  verification: {
    issuedAt: { type: Date },
    documentHash: { type: String },
    verificationCount: { type: Number, default: 0 },
    revokedAt: { type: Date },
    revocationReason: { type: String }
  }
}, {
  timestamps: true
});

const Document = mongoose.model('Document', documentSchema);
export default Document;
