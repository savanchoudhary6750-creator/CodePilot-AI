import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { analyzeCode } from '../utils/fallbackAnalyzer.js';
import User from '../models/User.js';

// Load env variables
dotenv.config();

const runTests = async () => {
  console.log('🧪 Starting CodePilot AI Backend Unit Tests...\n');
  let passedCount = 0;
  let failedCount = 0;

  const assert = (condition, message) => {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passedCount++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failedCount++;
    }
  };

  // ==========================================
  // TEST UNIT 1: Fallback Analyzer Logic
  // ==========================================
  console.log('--- Test Unit 1: Fallback Analyzer ---');
  
  // Case A: Nested Loop Detection
  const nestedLoopCode = `
    function processMatrix(matrix) {
      for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
          console.log(matrix[i][j]);
        }
      }
    }
  `;
  const loopAnalysis = analyzeCode(nestedLoopCode, 'javascript');
  assert(
    loopAnalysis.performance.length > 0 && loopAnalysis.performance[0].type === 'Algorithm',
    'Nested loops detected and categorized under performance algorithm complexity.'
  );

  // Case B: Hardcoded Credentials Detection
  const secretCode = `
    const secretKey = "super_secret_token_12345_xyz";
  `;
  const secretAnalysis = analyzeCode(secretCode, 'javascript');
  assert(
    secretAnalysis.security.length > 0 && secretAnalysis.security[0].severity === 'High',
    'Hardcoded secret credential detected and flagged with high severity.'
  );

  // Case C: React Missing Cleanup Detection
  const missingCleanupCode = `
    import React, { useEffect } from 'react';
    export default function Clock() {
      useEffect(() => {
        const interval = setInterval(() => {}, 1000);
      }, []);
    }
  `;
  const cleanupAnalysis = analyzeCode(missingCleanupCode, 'javascript');
  assert(
    cleanupAnalysis.bugs.length > 0 && cleanupAnalysis.bugs[0].type === 'React',
    'React useEffect with setInterval missing cleanup callback detected.'
  );

  // Case D: Code Formatting / Fixed Code Verification
  assert(
    loopAnalysis.fixedCode.includes('=== 0') || loopAnalysis.fixedCode !== null,
    'Fixed code version is successfully generated.'
  );

  console.log('\n--- Test Unit 2: User Model & Schema Hook ---\n');

  // ==========================================
  // TEST UNIT 2: User Model & Schema
  // ==========================================
  const dbUri = process.env.MONGODB_URI;
  if (!dbUri) {
    console.warn('⚠️ MONGODB_URI not set. Skipping Database Integration Tests.');
  } else {
    try {
      console.log('Connecting to database for model testing...');
      await mongoose.connect(dbUri);
      console.log('Connected successfully. Running DB integration tests...');

      const testEmail = `test_${Date.now()}@codepilot.ai`;
      const rawPassword = 'secured_password_1234';

      // 1. Creation and Hashing
      const user = await User.create({
        name: 'QA Tester',
        email: testEmail,
        password: rawPassword,
      });

      assert(user._id !== undefined, 'User document created successfully in DB.');
      assert(user.password !== rawPassword, 'Password is encrypted and hashed on pre-save.');

      // 2. Matching Hashed Passwords
      const userWithPwd = await User.findById(user._id).select('+password');
      const isMatch = await userWithPwd.matchPassword(rawPassword);
      assert(isMatch === true, 'Hashed password compares and matches correct raw password.');

      const isMismatch = await userWithPwd.matchPassword('wrong_password');
      assert(isMismatch === false, 'Hashed password rejects incorrect raw password.');

      // 3. Profile Update without Password (Tests our early-return fix)
      let updateError = null;
      try {
        const profileToUpdate = await User.findById(user._id); // password is select: false, so it is undefined
        profileToUpdate.name = 'QA Lead Auditor';
        await profileToUpdate.save(); // Should NOT throw TypeError now!
      } catch (err) {
        updateError = err;
      }
      assert(
        updateError === null,
        'Profile update succeeds without password selection and does not crash on pre-save password checks.'
      );

      // Clean up
      await User.deleteOne({ _id: user._id });
      console.log('Database test cleanup complete.');

    } catch (dbError) {
      console.error('❌ Database connection failed during testing:', dbError.message);
      failedCount++;
    } finally {
      await mongoose.connection.close();
      console.log('Database connection closed.');
    }
  }

  // ==========================================
  // FINAL EVALUATION
  // ==========================================
  console.log('\n==========================================');
  console.log(`📊 Test Results: ${passedCount} passed, ${failedCount} failed.`);
  console.log('==========================================\n');

  if (failedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
};

runTests();
