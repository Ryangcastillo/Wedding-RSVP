import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createSecureResponse, checkRateLimit, sanitizeString, isValidEmail } from '@/lib/security';

const rsvpsFilePath = path.join(process.cwd(), 'rsvps.json');

// Ensure the file exists
if (!fs.existsSync(rsvpsFilePath)) {
  fs.writeFileSync(rsvpsFilePath, JSON.stringify([]));
}

interface RSVP {
  id: string;
  name: string;
  email: string;
  attendance: string;
  dietary: string;
  submittedAt: string;
}

export async function GET() {
  try {
    const data = fs.readFileSync(rsvpsFilePath, 'utf8');
    const rsvps: RSVP[] = JSON.parse(data);
    return createSecureResponse(rsvps);
  } catch {
    return createSecureResponse({ error: 'Failed to read RSVPs' }, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') ||
                     request.headers.get('cf-connecting-ip') || // Cloudflare
                     'unknown';

    // Rate limiting check (10 RSVP submissions per hour per IP)
    const rateLimit = checkRateLimit(`rsvp:${clientIP}`, 10, 60 * 60 * 1000);
    if (!rateLimit.allowed) {
      return createSecureResponse(
        { error: 'Too many RSVP submissions. Please try again later.' }, 
        429
      );
    }

    const body = await request.json();
    const { name, email, attendance, dietary } = body;

    // Input validation and sanitization
    if (!name || !email || !attendance) {
      return createSecureResponse({ error: 'Missing required fields' }, 400);
    }

    const sanitizedName = sanitizeString(name);
    const sanitizedEmail = sanitizeString(email);
    const sanitizedAttendance = sanitizeString(attendance);
    const sanitizedDietary = dietary ? sanitizeString(dietary) : '';

    // Additional validation
    if (sanitizedName.length < 2) {
      return createSecureResponse({ error: 'Name must be at least 2 characters' }, 400);
    }

    if (!isValidEmail(sanitizedEmail)) {
      return createSecureResponse({ error: 'Invalid email address' }, 400);
    }

    if (!['yes', 'no', 'maybe'].includes(sanitizedAttendance)) {
      return createSecureResponse({ error: 'Invalid attendance value' }, 400);
    }

    const newRSVP: RSVP = {
      id: Date.now().toString(),
      name: sanitizedName,
      email: sanitizedEmail,
      attendance: sanitizedAttendance,
      dietary: sanitizedDietary,
      submittedAt: new Date().toISOString(),
    };

    // Check for duplicate email addresses
    const data = fs.readFileSync(rsvpsFilePath, 'utf8');
    const rsvps: RSVP[] = JSON.parse(data);
    
    const existingRSVP = rsvps.find(rsvp => rsvp.email.toLowerCase() === sanitizedEmail.toLowerCase());
    if (existingRSVP) {
      return createSecureResponse({ error: 'An RSVP already exists for this email address' }, 409);
    }

    rsvps.push(newRSVP);
    fs.writeFileSync(rsvpsFilePath, JSON.stringify(rsvps, null, 2));

    // Log RSVP submission
    console.log(`New RSVP from ${newRSVP.name} (${newRSVP.email}): ${newRSVP.attendance} at ${new Date().toISOString()}`);

    return createSecureResponse({ 
      message: 'RSVP submitted successfully', 
      id: newRSVP.id 
    });
  } catch {
    return createSecureResponse({ error: 'Failed to save RSVP' }, 500);
  }
}