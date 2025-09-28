/**
 * RSVP API Route (Static Export Compatible)
 * For GitHub Pages deployment, this route provides client-side handling
 * Note: Actual data persistence needs external service (e.g., Formspree, Netlify Forms, etc.)
 */

import { NextRequest, NextResponse } from 'next/server';

// Force static export for GitHub Pages compatibility
export const dynamic = 'force-static';
export const revalidate = false;

interface RSVP {
  id: string;
  name: string;
  email: string;
  attendance: string;
  dietary: string;
  submittedAt: string;
}

// Mock data for static export (replace with external service integration)
const mockRSVPs: RSVP[] = [];

export async function GET() {
  try {
    // For static deployment, return mock data or integrate with external service
    // Consider using services like Airtable, Google Sheets API, or Supabase
    return NextResponse.json({
      message: 'Static deployment: Use external service for data persistence',
      data: mockRSVPs
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read RSVPs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, attendance, dietary } = body;

    // Input validation
    if (!name || !email || !attendance) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    if (!['yes', 'no', 'maybe'].includes(attendance)) {
      return NextResponse.json({ error: 'Invalid attendance value' }, { status: 400 });
    }

    // For static deployment, return success but note that external service is needed
    const newRSVP: RSVP = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      attendance,
      dietary: dietary || '',
      submittedAt: new Date().toISOString(),
    };

    // In a real static deployment, you would:
    // 1. Use a form service like Formspree, Netlify Forms, or EmailJS
    // 2. Send data to a serverless function (Vercel, Netlify Functions)
    // 3. Use a headless CMS like Sanity, Strapi, or Contentful
    // 4. Integrate with Airtable, Google Sheets, or Supabase

    return NextResponse.json({ 
      message: 'RSVP received (Note: Integrate with external service for persistence)', 
      id: newRSVP.id,
      data: newRSVP
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process RSVP' }, { status: 500 });
  }
}