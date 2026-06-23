import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  
  try {
    // Attempt mongoose connection
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB Connection Error failed at backend/config/db.js:L10');
    console.error(`Error details: ${error.stack || error.message}`);
    process.exit(1); // Force process termination on failure
  }
};

export default connectDB;
