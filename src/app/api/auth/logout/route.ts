/**
 * Authentication API Route - Logout (Static Export Compatible)
 * Handles user logout (client-side only for static deployment)
 * 
 * Reference: CONST-P5 (Security First)
 */

import { NextRequest, NextResponse } from 'next/server';

// For static exports, we need to export these routes as static
export const dynamic = 'force-static';
export const revalidate = false;

/**
 * Logout endpoint - Static version for GitHub Pages
 * Note: In static deployment, actual logout logic should be handled client-side
 */
export async function POST(request: NextRequest) {
  try {
    // For static exports, we can only return success
    // Actual logout logic should be handled on the client side
    return NextResponse.json({ 
      success: true, 
      message: 'Logout successful (client-side handling required)' 
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