/**
 * Admin Navigation Component
 * Navigation sidebar for the admin dashboard
 * 
 * Reference: CONST-P12 (Admin Interface), CONST-P14 (User Experience)
 */

'use client';

import React from 'react';
import { Card, CardContent } from '@/shared/components/card';
import { Button } from '@/shared/components/button';

interface AdminNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  className?: string;
}

export function AdminNav({ activeSection, onSectionChange, className }: AdminNavProps) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      description: 'Overview & Analytics'
    },
    {
      id: 'rsvps',
      label: 'RSVPs',
      icon: '📝',
      description: 'Manage Responses'
    },
    {
      id: 'guests',
      label: 'Guest List',
      icon: '👥',
      description: 'Guest Management'
    },
    {
      id: 'content',
      label: 'Content',
      icon: '📄',
      description: 'Website Content'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      description: 'System Configuration'
    },
    {
      id: 'exports',
      label: 'Exports',
      icon: '📤',
      description: 'Data & Reports'
    }
  ];

  return (
    <Card className={className}>
      <CardContent className="p-0">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "default" : "ghost"}
              className={`w-full justify-start text-left p-4 h-auto ${
                activeSection === item.id ? 'bg-primary text-primary-foreground' : ''
              }`}
              onClick={() => onSectionChange(item.id)}
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className={`text-xs ${
                    activeSection === item.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {item.description}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
}