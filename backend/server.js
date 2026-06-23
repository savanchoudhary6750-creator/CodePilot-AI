import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import aiRoutes from './routes/ai.js';

// Load dotenv
const envResult = dotenv.config();
if (envResult.error) {
  console.error('❌ Failed to load .env file (server.js:L11):', envResult.error);
  process.exit(1);
} else {
  console.log('✅ Environment variables loaded');
}

const app = express();
const PORT = process.env.PORT || 5000;

// Verify MONGODB_URI
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MongoDB URI detected: MONGODB_URI is not defined in .env file (server.js:L22)');
  process.exit(1);
} else {
  console.log('✅ MongoDB URI detected');
  if (MONGODB_URI.startsWith('mongodb+srv://')) {
    console.log('ℹ️ Connection string matches MongoDB Atlas (mongodb+srv://) format');
  } else {
    console.log('⚠️ Connection string uses local format (mongodb://). If you intend to connect to Atlas, update backend/.env');
  }
}

// Global Security Middleware
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // limit each IP to 150 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes.' }
});
app.use('/api', limiter);

// CORS Configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Connect to MongoDB and start Express server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server startup failed due to database connection error (server.js:L75)');
    process.exit(1);
  }
};

startServer();
