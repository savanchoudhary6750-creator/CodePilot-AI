import mongoose from 'mongoose';

const codeReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Reviews can be run by guests or logged-in users
    },
    code: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    bugs: [
      {
        severity: String,
        type: { type: String }, // Custom naming key to avoid Mongoose type confusion
        message: String,
        line: Number,
        suggestion: String,
        code: String,
      },
    ],
    security: [
      {
        severity: String,
        type: { type: String },
        message: String,
        line: Number,
        suggestion: String,
        code: String,
      },
    ],
    performance: [
      {
        severity: String,
        type: { type: String },
        message: String,
        line: Number,
        suggestion: String,
        code: String,
      },
    ],
    suggestions: [
      {
        severity: String,
        type: { type: String },
        message: String,
        line: Number,
        suggestion: String,
        code: String,
      },
    ],
    fixedCode: {
      type: String,
      required: true,
    },
    metrics: {
      complexity: Number,
      maintainability: Number,
      security: Number,
      performance: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('CodeReview', codeReviewSchema);
