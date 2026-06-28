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
  console.error('❌ Failed to load .env file (server.js):', envResult.error);
  process.exit(1);
} else {
  console.log('✅ Environment variables loaded');
}

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Verify MONGODB_URI
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ Configuration error: MONGODB_URI is not defined in the environment variables.');
  process.exit(1);
} else {
  console.log('✅ MongoDB URI detected');
  if (MONGODB_URI.startsWith('mongodb+srv://')) {
    console.log('ℹ️ Connection string matches MongoDB Atlas (mongodb+srv://) format');
  } else {
    console.log('⚠️ Connection string uses local format (mongodb://).');
  }
}

// Verify JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('❌ Configuration error: JWT_SECRET is not defined in environment variables.');
  process.exit(1);
} else if (JWT_SECRET === 'your_jwt_secret_key_here_change_in_production' && NODE_ENV === 'production') {
  console.error('❌ Security alert: Default placeholder JWT_SECRET cannot be used in production environment!');
  process.exit(1);
} else {
  console.log('✅ JWT Secret safety verified');
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

// Dynamic CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server calls or REST client runs where origin is undefined
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS security policy.`));
    }
  },
  credentials: true
}));

// Payload Parsing Configuration (limited to 2mb to block large request flooding while permitting source code uploads)
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running', env: NODE_ENV });
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
      console.log(`✅ Server running in ${NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server startup failed due to database connection error');
    process.exit(1);
  }
};

startServer();
