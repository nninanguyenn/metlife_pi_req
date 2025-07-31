import express from 'express';
import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// In-memory storage for MFA codes (in production, use Redis or database)
const mfaCodes = new Map();

// Validation schemas
const personalInfoSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(50).required(),
  lastName: Joi.string().trim().min(1).max(50).required(),
  address: Joi.string().trim().min(5).max(200).required(),
  state: Joi.string().trim().min(1).max(50).required(),
  email: Joi.string().email().required(),
  dateOfBirth: Joi.date().iso().max('now').required(),
  ssn: Joi.string().pattern(/^\d{3}-?\d{2}-?\d{4}$/).required()
});

const mfaRequestSchema = Joi.object({
  personalInfo: personalInfoSchema.required(),
  mobileNumber: Joi.string().pattern(/^\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/).required(),
  captchaVerified: Joi.boolean().valid(true).required()
});

const mfaVerifySchema = Joi.object({
  mobileNumber: Joi.string().pattern(/^\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/).required(),
  mfaCode: Joi.string().length(6).pattern(/^\d{6}$/).required(),
  sessionId: Joi.string().uuid().required()
});

const piRequestSchema = Joi.object({
  personalInfo: personalInfoSchema.required(),
  mobileNumber: Joi.string().pattern(/^\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/).required(),
  requestType: Joi.string().valid('report', 'delete').required(),
  deliveryMethod: Joi.string().valid('email', 'mail', 'secure-portal').required(),
  sessionId: Joi.string().uuid().required()
});

// Helper function to normalize phone number
const normalizePhoneNumber = (phone) => {
  return phone.replace(/\D/g, '').slice(-10);
};

// Helper function to generate random 6-digit code
const generateMfaCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper function to mask sensitive data for logging
const maskSensitiveData = (data) => {
  const masked = { ...data };
  if (masked.personalInfo) {
    masked.personalInfo = {
      ...masked.personalInfo,
      ssn: '***-**-' + masked.personalInfo.ssn.slice(-4),
      email: masked.personalInfo.email.replace(/(.{2}).*(@.*)/, '$1***$2')
    };
  }
  return masked;
};

/**
 * POST /api/pi-request/request-mfa-code
 * Request MFA code for personal information request
 */
router.post('/request-mfa-code', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = mfaRequestSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }

    const { personalInfo, mobileNumber, captchaVerified } = value;
    
    // Normalize phone number
    const normalizedPhone = normalizePhoneNumber(mobileNumber);
    
    // Check if captcha is verified
    if (!captchaVerified) {
      return res.status(400).json({
        success: false,
        message: 'Human verification required'
      });
    }

    // Generate session ID and MFA code
    const sessionId = uuidv4();
    const mfaCode = generateMfaCode();
    
    // Store MFA code with expiration (5 minutes)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    mfaCodes.set(sessionId, {
      code: mfaCode,
      phoneNumber: normalizedPhone,
      personalInfo,
      expiresAt,
      attempts: 0,
      maxAttempts: 3
    });

    // Log request (with masked sensitive data)
    console.log('MFA code requested:', {
      sessionId,
      timestamp: new Date().toISOString(),
      phoneNumber: normalizedPhone.replace(/(\d{3})(\d{3})(\d{4})/, '***-***-$3'),
      personalInfo: maskSensitiveData({ personalInfo }).personalInfo
    });

    // In production, send actual SMS here
    // For now, we'll simulate the SMS sending
    console.log(`🔐 MFA Code for ${normalizedPhone}: ${mfaCode} (Session: ${sessionId})`);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    res.status(200).json({
      success: true,
      message: 'MFA code sent successfully',
      data: {
        sessionId,
        phoneNumber: mobileNumber.replace(/(\d{3})(\d{3})(\d{4})/, '***-***-$3'),
        expiresIn: 300 // 5 minutes in seconds
      }
    });

  } catch (error) {
    console.error('Error requesting MFA code:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send MFA code. Please try again.'
    });
  }
});

/**
 * POST /api/pi-request/verify-mfa-code
 * Verify MFA code
 */
router.post('/verify-mfa-code', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = mfaVerifySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }

    const { mobileNumber, mfaCode, sessionId } = value;
    const normalizedPhone = normalizePhoneNumber(mobileNumber);

    // Check if session exists
    const storedData = mfaCodes.get(sessionId);
    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired session'
      });
    }

    // Check if session has expired
    if (new Date() > storedData.expiresAt) {
      mfaCodes.delete(sessionId);
      return res.status(400).json({
        success: false,
        message: 'MFA code has expired. Please request a new code.'
      });
    }

    // Check if too many attempts
    if (storedData.attempts >= storedData.maxAttempts) {
      mfaCodes.delete(sessionId);
      return res.status(429).json({
        success: false,
        message: 'Too many failed attempts. Please request a new code.'
      });
    }

    // Verify phone number matches
    if (storedData.phoneNumber !== normalizedPhone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number mismatch'
      });
    }

    // Increment attempts
    storedData.attempts++;

    // Check MFA code
    if (storedData.code !== mfaCode) {
      mfaCodes.set(sessionId, storedData); // Update attempts
      return res.status(400).json({
        success: false,
        message: `Invalid MFA code. ${storedData.maxAttempts - storedData.attempts} attempts remaining.`
      });
    }

    // MFA verification successful
    // Mark session as verified
    storedData.verified = true;
    storedData.verifiedAt = new Date();
    mfaCodes.set(sessionId, storedData);

    console.log('MFA verification successful:', {
      sessionId,
      timestamp: new Date().toISOString(),
      phoneNumber: normalizedPhone.replace(/(\d{3})(\d{3})(\d{4})/, '***-***-$3')
    });

    res.status(200).json({
      success: true,
      message: 'MFA verification successful',
      data: {
        sessionId,
        verified: true
      }
    });

  } catch (error) {
    console.error('Error verifying MFA code:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify MFA code. Please try again.'
    });
  }
});

/**
 * POST /api/pi-request/submit
 * Submit personal information request
 */
router.post('/submit', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = piRequestSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }

    const { personalInfo, mobileNumber, requestType, deliveryMethod, sessionId } = value;

    // Check if session exists and is verified
    const storedData = mfaCodes.get(sessionId);
    if (!storedData || !storedData.verified) {
      return res.status(401).json({
        success: false,
        message: 'MFA verification required'
      });
    }

    // Generate request ID
    const requestId = `PIR-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // In production, save to database
    const requestData = {
      requestId,
      personalInfo,
      mobileNumber,
      requestType,
      deliveryMethod,
      submittedAt: new Date().toISOString(),
      status: 'submitted',
      sessionId
    };

    // Log request submission (with masked data)
    console.log('PI Request submitted:', {
      requestId,
      requestType,
      deliveryMethod,
      timestamp: new Date().toISOString(),
      personalInfo: maskSensitiveData({ personalInfo }).personalInfo
    });

    // Clean up MFA session
    mfaCodes.delete(sessionId);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    res.status(201).json({
      success: true,
      message: 'Personal information request submitted successfully',
      data: {
        requestId,
        status: 'submitted',
        estimatedProcessingTime: '5-7 business days',
        submittedAt: requestData.submittedAt
      }
    });

  } catch (error) {
    console.error('Error submitting PI request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit request. Please try again.'
    });
  }
});

/**
 * GET /api/pi-request/status/:requestId
 * Get status of a personal information request
 */
router.get('/status/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;

    // Validate request ID format
    if (!/^PIR-\d{13}-[A-Z0-9]{9}$/.test(requestId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID format'
      });
    }

    // In production, fetch from database
    // For now, return mock status
    const mockStatus = {
      requestId,
      status: 'processing',
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      estimatedCompletionDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
      lastUpdated: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      data: mockStatus
    });

  } catch (error) {
    console.error('Error fetching request status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch request status'
    });
  }
});

export default router;
