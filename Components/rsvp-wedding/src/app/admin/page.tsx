/**
 * Admin Dashboard Page
 * Protected admin interface for comprehensive wedding management
 * 
 * Reference: CONST-P5 (Security First), CONST-P12 (Admin Interface)
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@/shared/components/button';
import { ProtectedRoute, useAuth } from '@/features/auth';
import { RSVPList, RSVPAnalytics } from '@/features/rsvp';
import { useRSVPList } from '@/features/rsvp/hooks/use-rsvp';
import { 
  AdminNav, 
  AdminDashboardOverview, 
  AdminGuestManagement, 
  AdminSettings, 
  AdminExports 
} from '@/features/admin';
import { ContentManagement } from '@/features/content';

/**
 * Admin Dashboard Component
 */
function AdminDashboard() {
  const { logout, user } = useAuth();
  const { rsvps } = useRSVPList();
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleLogout = async () => {
    await logout();
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminDashboardOverview rsvps={rsvps} />;
      case 'rsvps':
        return (
          <div className="space-y-6">
            <RSVPAnalytics rsvps={rsvps} />
            <RSVPList />
          </div>
        );
      case 'guests':
        return <AdminGuestManagement rsvps={rsvps} />;
      case 'content':
        return <ContentManagement />;
      case 'settings':
        return <AdminSettings />;
      case 'exports':
        return <AdminExports rsvps={rsvps} />;
      default:
        return <AdminDashboardOverview rsvps={rsvps} />;
    }
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'dashboard':
        return 'Dashboard Overview';
      case 'rsvps':
        return 'RSVP Management';
      case 'guests':
        return 'Guest Management';
      case 'content':
        return 'Content Management';
      case 'settings':
        return 'System Settings';
      case 'exports':
        return 'Data Exports';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-serif text-3xl font-bold text-primary mb-1">
                Wedding Admin
              </h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.email || 'Admin'}
              </p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              Sign Out
            </Button>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar Navigation */}
          <div className="w-64 bg-white border-r min-h-screen p-4">
            <AdminNav 
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {getSectionTitle()}
              </h2>
              <div className="h-1 w-20 bg-primary rounded"></div>
            </div>

            {renderActiveSection()}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground py-8 border-t bg-gray-50">
          <p>
            Wedding Admin Dashboard • Comprehensive Wedding Management System
          </p>
          <p className="mt-2">
            Need help? Contact{' '}
            <a href="mailto:support@wedding.com" className="text-primary hover:underline">
              support@wedding.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Main Admin Page with Authentication Protection
 */
export default function Admin() {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  );
}