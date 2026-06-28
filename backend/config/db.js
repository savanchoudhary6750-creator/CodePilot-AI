import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  
  const options = {
    maxPoolSize: 10, // Maintain up to 10 active socket connections for pooling
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of default 30s to fail fast
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    family: 4 // Skip checking IPv6 resolution and default to IPv4
  };

  // Mongoose connection event listeners for health monitoring
  mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB Connected successfully.');
  });

  mongoose.connection.on('error', (err) => {
    console.error(`❌ MongoDB connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB connection lost. Attempting auto-reconnection...');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('✅ MongoDB auto-reconnected successfully.');
  });

  try {
    const conn = await mongoose.connect(uri, options);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB Connection failed during initial startup.');
    console.error(`Error details: ${error.stack || error.message}`);
    process.exit(1); // Exit process if database is down at startup
  }
};

export default connectDB;
