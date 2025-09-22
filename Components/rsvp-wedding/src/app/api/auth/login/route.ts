/**
 * Authentication API Route - Login
 * Handles admin login with secure password verification
 * 
 * Reference: CONST-P5 (Security First), CONST-P8 (API First & Service Layer)
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminLoginSchema, AuthResponse } from '@/shared/types/auth';

// In production, this would be loaded from environment variables
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'wedding123';
// JWT_SECRET reserved for future JWT implementation
// const JWT_SECRET = process.env.JWT_SECRET || 'wedding-secret-key';

/**
 * Admin login endpoint
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body using Zod schema
    const validation = adminLoginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json<AuthResponse>(
        { 
          success: false, 
          message: 'Invalid credentials format' 
        }, 
        { status: 400 }
      );
    }

    const { password } = validation.data;

    // Verify admin password
    if (password !== ADMIN_PASSWORD) {
      // Add a small delay to prevent brute force attacks
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return NextResponse.json<AuthResponse>(
        { 
          success: false, 
          message: 'Invalid credentials' 
        }, 
        { status: 401 }
      );
    }

    // Generate simple token (in production, use JWT)
    const token = Buffer.from(`admin:${Date.now()}`).toString('base64');

    // Log successful login
    console.log(`Admin login successful at ${new Date().toISOString()}`);

    return NextResponse.json<AuthResponse>({
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
    return NextResponse.json<AuthResponse>(
      { 
        success: false, 
        message: 'Server error during authentication' 
      }, 
      { status: 500 }
    );
  }
}

/**
 * Method not allowed for non-POST requests
 */
export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' }, 
    { status: 405 }
  );
}