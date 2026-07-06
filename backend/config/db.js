import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  const connectionTimeoutMs = 10000;

  if (!mongoUri) {
    throw new Error('MONGO_URI is not configured in backend/.env');
  }

  let timeoutId;

  try {
    await Promise.race([
      mongoose.connect(mongoUri, {
        dbName: process.env.MONGO_DB_NAME || 'docuflow',
        serverSelectionTimeoutMS: connectionTimeoutMs,
        connectTimeoutMS: connectionTimeoutMs
      }),
      new Promise((_, reject) => {
        timeoutId = setTimeout(
          () => reject(new Error(`Connection timed out after ${connectionTimeoutMs / 1000} seconds`)),
          connectionTimeoutMs
        );
      })
    ]);
    console.log('Connected to MongoDB');
  } catch (err) {
    throw new Error(
      `Could not connect to MongoDB. Check the Atlas Network Access IP allowlist and MONGO_URI. ${err.message}`,
      { cause: err }
    );
  } finally {
    clearTimeout(timeoutId);
  }
};

export default connectDB;
