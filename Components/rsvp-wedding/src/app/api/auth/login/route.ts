/**
 * Authentication API Route - Login
 * Handles admin login with secure password verification
 * 
 * Reference: CONST-P5 (Security First), CONST-P8 (API First & Service Layer)
 */

import { NextRequest } from 'next/server';
import { adminLoginSchema, AuthResponse } from '@/shared/types/auth';
import { createSecureResponse, checkRateLimit, sanitizeString } from '@/lib/security';

// Environment variables with proper security
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!ADMIN_PASSWORD) {
  console.error('ADMIN_PASSWORD environment variable is required');
  // In production, this would throw an error
  // For development, we'll use a warning but continue
}

// JWT_SECRET reserved for future JWT implementation
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.warn('JWT_SECRET environment variable not set - using development fallback');
}

/**
 * Admin login endpoint
 */
export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') ||
                     request.headers.get('cf-connecting-ip') || // Cloudflare
                     'unknown';

    // Rate limiting check
    const rateLimit = checkRateLimit(`login:${clientIP}`, 5, 15 * 60 * 1000); // 5 attempts per 15 minutes
    if (!rateLimit.allowed) {
      return createSecureResponse<AuthResponse>(
        { 
          success: false, 
          message: 'Too many login attempts. Please try again later.' 
        }, 
        429
      );
    }

    const body = await request.json();
    
    // Validate request body using Zod schema
    const validation = adminLoginSchema.safeParse(body);
    if (!validation.success) {
      return createSecureResponse<AuthResponse>(
        { 
          success: false, 
          message: 'Invalid credentials format' 
        }, 
        400
      );
    }

    const { password } = validation.data;

    // Sanitize input
    const sanitizedPassword = sanitizeString(password);

    // Verify admin password
    if (!ADMIN_PASSWORD) {
      // In development mode, we'll allow a fallback for testing
      if (process.env.NODE_ENV === 'development' && sanitizedPassword === 'wedding123') {
        console.warn('Using development fallback password - NOT for production!');
      } else {
        return createSecureResponse<AuthResponse>(
          { 
            success: false, 
            message: 'Authentication service not configured' 
          }, 
          500
        );
      }
    } else if (sanitizedPassword !== ADMIN_PASSWORD) {
      // Add a small delay to prevent brute force attacks
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return createSecureResponse<AuthResponse>(
        { 
          success: false, 
          message: 'Invalid credentials' 
        }, 
        401
      );
    }

    // Generate simple token (in production, use JWT)
    const token = Buffer.from(`admin:${Date.now()}`).toString('base64');

    // Log successful login
    console.log(`Admin login successful at ${new Date().toISOString()} from IP: ${clientIP}`);

    return createSecureResponse<AuthResponse>({
      success: true,
      token,
      message: 'Login successful',
      user: {
        id: 'admin',
        email: 'admin@wedding.com',
        role: 'admin',
        createdAt: new Date(),
        lastLogin: new Date(),
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    return createSecureResponse<AuthResponse>(
      { 
        success: false, 
        message: 'Server error during authentication' 
      }, 
      500
    );
  }
}

/**
 * Method not allowed for non-POST requests
 */
export async function GET() {
  return createSecureResponse(
    { message: 'Method not allowed' }, 
    405
  );
}