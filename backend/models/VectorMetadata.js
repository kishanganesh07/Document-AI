import mongoose from 'mongoose';

const vectorMetadataSchema = new mongoose.Schema({
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
  chunkIndex: { type: Number, required: true },
  textSnippet: { type: String, required: true },
  vectorId: { type: String, required: true }
}, {
  timestamps: true
});

const VectorMetadata = mongoose.model('VectorMetadata', vectorMetadataSchema);
export default VectorMetadata;
