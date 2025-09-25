/**
 * Enhanced RSVP Form Component
 * Beautiful, accessible RSVP form with comprehensive validation
 * 
 * Reference: CONST-P15 (Wedding Theme), CONST-P4 (Type Safety), CONST-P14 (User Experience)
 */

'use client';

import React from 'react';
import { Button } from '@/shared/components/button';
import { Input } from '@/shared/components/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card';
import { Alert, AlertDescription } from '@/shared/components/alert';
import { useRSVPForm } from '../hooks/use-rsvp';
import { RSVPFormData } from '@/shared/types/rsvp';

interface RSVPFormProps {
  initialData?: Partial<RSVPFormData>;
  onSuccess?: (data: RSVPFormData) => void;
  className?: string;
}

export function RSVPForm({ initialData, onSuccess, className }: RSVPFormProps) {
  const {
    data,
    errors,
    isSubmitting,
    isSubmitted,
    submissionError,
    submissionSuccess,
    updateField,
    submitForm,
    clearMessages,
  } = useRSVPForm(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submitForm();
    if (success) {
      onSuccess?.(data);
    }
  };

  // If successfully submitted, show success state
  if (isSubmitted && submissionSuccess) {
    return (
      <Card className={`w-full max-w-xl mx-auto ${className || ''}`}>
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl font-bold text-primary mb-2">
              Thank You!
            </h2>
            <p className="text-muted-foreground">
              {submissionSuccess}
            </p>
          </div>
          
          {data.attendance === 'yes' && (
            <div className="bg-primary/10 rounded-lg p-4 mb-4">
              <p className="text-sm text-primary">
                We can&apos;t wait to celebrate with you! You&apos;ll receive a confirmation email soon 
                with all the wedding details.
              </p>
            </div>
          )}
          
          {data.attendance === 'no' && (
            <div className="bg-sage/10 rounded-lg p-4 mb-4">
              <p className="text-sm text-sage">
                We understand and appreciate you letting us know. We&apos;ll miss having you there!
              </p>
            </div>
          )}

          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
          >
            Submit Another RSVP
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full max-w-xl mx-auto ${className || ''}`}>
      <CardHeader className="text-center">
        <CardTitle className="font-serif text-3xl text-primary mb-2">
          RSVP
        </CardTitle>
        <p className="text-muted-foreground">
          We&apos;re so excited to celebrate with you! Please let us know if you can join us.
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Messages */}
          {submissionError && (
            <Alert variant="destructive">
              <AlertDescription>{submissionError}</AlertDescription>
            </Alert>
          )}

          {/* Name Field */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Full Name *
            </label>
            <Input
              id="name"
              type="text"
              value={data.name}
              onChange={(e) => {
                clearMessages();
                updateField('name', e.target.value);
              }}
              placeholder="Enter your full name"
              className={errors.name ? 'border-destructive' : ''}
              disabled={isSubmitting}
              required
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address *
            </label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => {
                clearMessages();
                updateField('email', e.target.value);
              }}
              placeholder="Enter your email address"
              className={errors.email ? 'border-destructive' : ''}
              disabled={isSubmitting}
              required
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Attendance Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">
              Will you be attending? *
            </label>
            <div className="space-y-2">
              {[
                { value: 'yes', label: 'Yes, I&apos;ll be there! 🎉', color: 'text-green-600' },
                { value: 'no', label: 'Sorry, I can&apos;t make it 😢', color: 'text-red-600' },
                { value: 'maybe', label: 'I&apos;m not sure yet 🤔', color: 'text-yellow-600' },
              ].map(({ value, label, color }) => (
                <label key={value} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="attendance"
                    value={value}
                    checked={data.attendance === value}
                    onChange={(e) => {
                      clearMessages();
                      updateField('attendance', e.target.value as 'yes' | 'no' | 'maybe');
                    }}
                    className="w-4 h-4 text-primary"
                    disabled={isSubmitting}
                  />
                  <span className={`${color} font-medium`}>{label}</span>
                </label>
              ))}
            </div>
            {errors.attendance && (
              <p className="text-sm text-destructive">{errors.attendance}</p>
            )}
          </div>

          {/* Plus One Section - Only show if attending */}
          {data.attendance === 'yes' && (
            <div className="space-y-3 p-4 bg-primary/5 rounded-lg">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.plusOne}
                  onChange={(e) => {
                    clearMessages();
                    updateField('plusOne', e.target.checked);
                    if (!e.target.checked) {
                      updateField('plusOneName', '');
                    }
                  }}
                  className="w-4 h-4 text-primary"
                  disabled={isSubmitting}
                />
                <span className="text-sm font-medium">I&apos;ll be bringing a plus one</span>
              </label>

              {data.plusOne && (
                <div className="space-y-2">
                  <label htmlFor="plusOneName" className="text-sm font-medium">
                    Plus One Name
                  </label>
                  <Input
                    id="plusOneName"
                    type="text"
                    value={data.plusOneName || ''}
                    onChange={(e) => {
                      clearMessages();
                      updateField('plusOneName', e.target.value);
                    }}
                    placeholder="Enter your guest's name"
                    className={errors.plusOneName ? 'border-destructive' : ''}
                    disabled={isSubmitting}
                  />
                  {errors.plusOneName && (
                    <p className="text-sm text-destructive">{errors.plusOneName}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Dietary Restrictions - Only show if attending */}
          {data.attendance === 'yes' && (
            <div className="space-y-2">
              <label htmlFor="dietary" className="text-sm font-medium">
                Dietary Restrictions or Allergies
              </label>
              <textarea
                id="dietary"
                value={data.dietary || ''}
                onChange={(e) => {
                  clearMessages();
                  updateField('dietary', e.target.value);
                }}
                placeholder="Please let us know about any dietary restrictions, allergies, or special meal requests..."
                rows={3}
                className={`w-full px-3 py-2 border rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.dietary ? 'border-destructive' : 'border-input'
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
                maxLength={500}
              />
              <div className="flex justify-between">
                {errors.dietary && (
                  <p className="text-sm text-destructive">{errors.dietary}</p>
                )}
                <p className="text-xs text-muted-foreground ml-auto">
                  {(data.dietary || '').length}/500
                </p>
              </div>
            </div>
          )}

          {/* Message Field */}
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message for the Couple (Optional)
            </label>
            <textarea
              id="message"
              value={data.message || ''}
              onChange={(e) => {
                clearMessages();
                updateField('message', e.target.value);
              }}
              placeholder="Share your excitement, well wishes, or any questions you have..."
              rows={3}
              className={`w-full px-3 py-2 border rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.message ? 'border-destructive' : 'border-input'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
              maxLength={1000}
            />
            <div className="flex justify-between">
              {errors.message && (
                <p className="text-sm text-destructive">{errors.message}</p>
              )}
              <p className="text-xs text-muted-foreground ml-auto">
                {(data.message || '').length}/1000
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting RSVP...' : 'Submit RSVP'}
          </Button>

          {/* Privacy Notice */}
          <p className="text-xs text-muted-foreground text-center">
            Your information is kept private and will only be used for wedding planning purposes.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}