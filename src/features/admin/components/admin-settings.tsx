/**
 * Admin Settings Component
 * System settings and configuration for wedding admin
 * 
 * Reference: CONST-P12 (Admin Interface), CONST-P5 (Security First)
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card';
import { Button } from '@/shared/components/button';
import { Input } from '@/shared/components/input';
import { Alert, AlertDescription } from '@/shared/components/alert';

interface AdminSettingsProps {
  className?: string;
}

export function AdminSettings({ className }: AdminSettingsProps) {
  const [settings, setSettings] = useState({
    weddingDate: '2025-06-15',
    venueName: 'Grand Ballroom',
    venueAddress: '123 Wedding St, Love City, LC 12345',
    rsvpDeadline: '2025-05-01',
    maxGuests: 150,
    allowPlusOnes: true,
    requireDietaryInfo: false,
    emailReminders: true,
    autoResponseEmail: true,
  });

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const handleSave = async () => {
    setSaveStatus('saving');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // In real implementation, this would call an API
      console.log('Saving settings:', settings);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Save Status */}
      {saveStatus === 'saved' && (
        <Alert>
          <AlertDescription>✅ Settings saved successfully!</AlertDescription>
        </Alert>
      )}
      
      {saveStatus === 'error' && (
        <Alert variant="destructive">
          <AlertDescription>❌ Failed to save settings. Please try again.</AlertDescription>
        </Alert>
      )}

      {/* Wedding Details */}
      <Card>
        <CardHeader>
          <CardTitle>Wedding Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Wedding Date</label>
              <Input
                type="date"
                value={settings.weddingDate}
                onChange={(e) => handleInputChange('weddingDate', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">RSVP Deadline</label>
              <Input
                type="date"
                value={settings.rsvpDeadline}
                onChange={(e) => handleInputChange('rsvpDeadline', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Venue Name</label>
            <Input
              value={settings.venueName}
              onChange={(e) => handleInputChange('venueName', e.target.value)}
              placeholder="Enter venue name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Venue Address</label>
            <Input
              value={settings.venueAddress}
              onChange={(e) => handleInputChange('venueAddress', e.target.value)}
              placeholder="Enter full venue address"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Maximum Guests</label>
            <Input
              type="number"
              value={settings.maxGuests}
              onChange={(e) => handleInputChange('maxGuests', parseInt(e.target.value))}
              min="1"
              max="1000"
            />
            <p className="text-xs text-muted-foreground">
              Total capacity including plus ones
            </p>
          </div>
        </CardContent>
      </Card>

      {/* RSVP Settings */}
      <Card>
        <CardHeader>
          <CardTitle>RSVP Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Allow Plus Ones</div>
              <div className="text-sm text-muted-foreground">
                Let guests bring a plus one to the wedding
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.allowPlusOnes}
                onChange={(e) => handleInputChange('allowPlusOnes', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Require Dietary Information</div>
              <div className="text-sm text-muted-foreground">
                Make dietary restrictions field mandatory
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.requireDietaryInfo}
                onChange={(e) => handleInputChange('requireDietaryInfo', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Email Reminders</div>
              <div className="text-sm text-muted-foreground">
                Send automatic reminder emails to guests
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailReminders}
                onChange={(e) => handleInputChange('emailReminders', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Auto-Response Emails</div>
              <div className="text-sm text-muted-foreground">
                Send confirmation emails when RSVPs are submitted
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoResponseEmail}
                onChange={(e) => handleInputChange('autoResponseEmail', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium text-muted-foreground">Version</div>
              <div>1.0.0</div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground">Last Updated</div>
              <div>{new Date().toLocaleDateString()}</div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground">Database Status</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Connected
              </div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground">Storage Used</div>
              <div>2.3 MB / 100 MB</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="destructive" onClick={() => {
          if (confirm('Are you sure you want to reset all settings to defaults?')) {
            // Reset logic here
          }
        }}>
          Reset to Defaults
        </Button>
        
        <Button 
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
        >
          {saveStatus === 'saving' ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}