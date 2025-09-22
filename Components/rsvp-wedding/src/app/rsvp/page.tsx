'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/button';
import { Input } from '@/shared/components/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card';

export default function RSVP() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    attendance: '',
    dietary: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('RSVP submitted successfully!');
        setFormData({ name: '', email: '', attendance: '', dietary: '' });
      } else {
        setMessage('Failed to submit RSVP. Please try again.');
      }
    } catch {
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background py-12 px-4">
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-serif text-primary text-center">Loren & Billy Wedding RSVP</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">Your Name</label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">Email Address</label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="attendance" className="block text-sm font-medium text-foreground mb-1">Will you attend?</label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={formData.attendance === 'yes' ? 'default' : 'secondary'}
                  onClick={() => setFormData({ ...formData, attendance: 'yes' })}
                >
                  Yes
                </Button>
                <Button
                  type="button"
                  variant={formData.attendance === 'no' ? 'default' : 'outline'}
                  onClick={() => setFormData({ ...formData, attendance: 'no' })}
                >
                  No
                </Button>
              </div>
            </div>
            <div>
              <label htmlFor="dietary" className="block text-sm font-medium text-foreground mb-1">Dietary Needs</label>
              <Input
                id="dietary"
                name="dietary"
                type="text"
                placeholder="e.g. Vegetarian, Nut Allergy"
                value={formData.dietary}
                onChange={handleChange}
              />
            </div>
            <div className="text-center pt-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
              </Button>
            </div>
            {message && <p className="text-center text-sm text-muted-foreground">{message}</p>}
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
