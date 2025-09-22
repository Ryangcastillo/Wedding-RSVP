'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/shared/components/button';
import { Input } from '@/shared/components/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card';

interface RSVP {
  id: string;
  name: string;
  email: string;
  attendance: string;
  dietary: string;
  submittedAt: string;
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'wedding2024') { // Simple password, change as needed
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
    } else {
      alert('Incorrect password');
    }
  };

  const fetchRsvps = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/rsvp');
      if (response.ok) {
        const data = await response.json();
        setRsvps(data);
      }
    } catch (error) {
      console.error('Failed to fetch RSVPs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('adminAuth') === 'true') {
      setIsAuthenticated(true);
      fetchRsvps();
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" className="w-full">Login</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-serif text-4xl font-bold text-center mb-8">Admin Dashboard</h1>
        <div className="mb-8 text-center">
          <Button onClick={fetchRsvps} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh RSVPs'}
          </Button>
        </div>
        <div className="grid gap-4">
          {rsvps.map((rsvp) => (
            <Card key={rsvp.id}>
              <CardHeader>
                <CardTitle>{rsvp.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>Email:</strong> {rsvp.email}</p>
                <p><strong>Attendance:</strong> {rsvp.attendance}</p>
                <p><strong>Dietary:</strong> {rsvp.dietary || 'None'}</p>
                <p><strong>Submitted:</strong> {new Date(rsvp.submittedAt).toLocaleString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        {rsvps.length === 0 && !loading && (
          <p className="text-center text-muted-foreground">No RSVPs yet.</p>
        )}
      </div>
    </div>
  );
}