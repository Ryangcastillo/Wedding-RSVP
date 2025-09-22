/**
 * Authentication API Route - Token Validation
 * Validates authentication tokens
 * 
 * Reference: CONST-P5 (Security First)
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Validate authentication token
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { valid: false, message: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Simple token validation (in production, use proper JWT validation)
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const [user, timestamp] = decoded.split(':');
      
      if (user !== 'admin') {
        return NextResponse.json(
          { valid: false, message: 'Invalid token' },
          { status: 401 }
        );
      }

      // Check if token is not too old (24 hours)
      const tokenTime = parseInt(timestamp);
      const now = Date.now();
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours

      if (now - tokenTime > maxAge) {
        return NextResponse.json(
          { valid: false, message: 'Token expired' },
          { status: 401 }
        );
      }

      return NextResponse.json({ valid: true });

    } catch {
      return NextResponse.json(
        { valid: false, message: 'Invalid token format' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json(
      { valid: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

/**
 * Method not allowed for non-GET requests
 */
export async function POST() {
  return NextResponse.json(
    { message: 'Method not allowed' }, 
    { status: 405 }
  );
}