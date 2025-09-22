/**
 * Authentication API Route - Logout
 * Handles user logout (primarily for logging purposes)
 * 
 * Reference: CONST-P5 (Security First)
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Logout endpoint
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    // Log logout attempt (even if no token provided)
    console.log(`Logout attempt at ${new Date().toISOString()}`);
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        const [user] = decoded.split(':');
        
        if (user === 'admin') {
          console.log(`Admin logout successful at ${new Date().toISOString()}`);
        }
      } catch {
        // Invalid token format, but still process logout
        console.log('Logout with invalid token format');
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Logout successful' 
    });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Server error during logout' 
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