/**
 * RSVP Page
 * Beautiful, accessible RSVP form for wedding guests
 * 
 * Reference: CONST-P15 (Wedding Theme), CONST-P14 (User Experience)
 */

'use client';

import { RSVPForm } from '@/features/rsvp';

export default function RSVP() {
  const handleRSVPSuccess = () => {
    // Optional: Add any additional success handling here
    // The form already handles success state display
    console.log('RSVP submitted successfully');
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background py-12 px-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
            Join Our Celebration
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your presence would make our special day even more magical. 
            Please let us know if you can celebrate with us!
          </p>
          <div className="mt-6 w-24 h-0.5 bg-primary mx-auto"></div>
        </div>

        {/* RSVP Form */}
        <RSVPForm 
          onSuccess={handleRSVPSuccess}
          className="mb-12"
        />

        {/* Additional Information */}
        <div className="text-center text-sm text-muted-foreground space-y-2">
          <p>
            Questions about the wedding? Check out our{' '}
            <a href="/qa" className="text-primary hover:underline font-medium">
              Q&A page
            </a>{' '}
            or visit our{' '}
            <a href="/travel" className="text-primary hover:underline font-medium">
              travel information
            </a>.
          </p>
          <p>
            Need help with your RSVP? Contact us at{' '}
            <a href="mailto:wedding@example.com" className="text-primary hover:underline font-medium">
              wedding@example.com
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
