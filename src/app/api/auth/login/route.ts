/**
 * Authentication API Route - Login (Static Export Compatible)
 * Handles admin login for static deployment
 * 
 * Reference: CONST-P5 (Security First), CONST-P8 (API First & Service Layer)
 */

import { NextRequest, NextResponse } from 'next/server';

// Force static export for GitHub Pages compatibility
export const dynamic = 'force-static';
export const revalidate = false;

// For static deployment, authentication should be handled client-side
// Consider using services like Auth0, Firebase Auth, or Supabase Auth

interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    role: string;
    createdAt: Date;
    lastLogin: Date;
  };
}

/**
 * Admin login endpoint - Static version
 * Note: In production static deployment, use proper auth service
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    // Basic validation
    if (!password) {
      return NextResponse.json<AuthResponse>({ 
        success: false, 
        message: 'Password is required' 
      }, { status: 400 });
    }

    // For static deployment demo purposes only
    // In production, integrate with proper auth service
    if (password === 'wedding123') {
      const token = Buffer.from(`admin:${Date.now()}`).toString('base64');

      return NextResponse.json<AuthResponse>({
        success: true,
        token,
        message: 'Login successful (demo mode)',
        user: {
          id: 'admin',
          email: 'admin@wedding.com',
          role: 'admin',
          createdAt: new Date(),
          lastLogin: new Date(),
        },
      });
    }

    return NextResponse.json<AuthResponse>({ 
      success: false, 
      message: 'Invalid credentials' 
    }, { status: 401 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json<AuthResponse>({ 
      success: false, 
      message: 'Server error during authentication' 
    }, { status: 500 });
  }
}

/**
 * Method not allowed for non-POST requests
 */
export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}