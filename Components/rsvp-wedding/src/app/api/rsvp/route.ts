import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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
    return NextResponse.json(rsvps);
  } catch {
    return NextResponse.json({ error: 'Failed to read RSVPs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, attendance, dietary } = body;

    if (!name || !email || !attendance) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newRSVP: RSVP = {
      id: Date.now().toString(),
      name,
      email,
      attendance,
      dietary: dietary || '',
      submittedAt: new Date().toISOString(),
    };

    const data = fs.readFileSync(rsvpsFilePath, 'utf8');
    const rsvps: RSVP[] = JSON.parse(data);
    rsvps.push(newRSVP);
    fs.writeFileSync(rsvpsFilePath, JSON.stringify(rsvps, null, 2));

    // Placeholder for email notification
    console.log(`New RSVP from ${newRSVP.name} (${newRSVP.email}): ${newRSVP.attendance}`);

    return NextResponse.json({ message: 'RSVP submitted successfully', id: newRSVP.id });
  } catch {
    return NextResponse.json({ error: 'Failed to save RSVP' }, { status: 500 });
  }
}