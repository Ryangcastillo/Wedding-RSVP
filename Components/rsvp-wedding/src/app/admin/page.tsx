/**
 * Admin Dashboard Page
 * Protected admin interface for managing wedding RSVPs
 * 
 * Reference: CONST-P5 (Security First), CONST-P12 (Admin Interface)
 */

'use client';

import { Button } from '@/shared/components/button';
import { ProtectedRoute, useAuth } from '@/features/auth';
import { RSVPList, RSVPAnalytics } from '@/features/rsvp';
import { useRSVPList } from '@/features/rsvp/hooks/use-rsvp';

/**
 * Admin Dashboard Component
 */
function AdminDashboard() {
  const { logout, user } = useAuth();
  const { rsvps } = useRSVPList();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-serif text-4xl font-bold text-primary mb-2">
              Wedding Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.email || 'Admin'}! Manage your wedding RSVPs here.
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Sign Out
          </Button>
        </div>

        {/* Analytics Dashboard */}
        <RSVPAnalytics rsvps={rsvps} className="mb-8" />

        {/* RSVP Management */}
        <RSVPList />

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground mt-12 py-8 border-t">
          <p>
            Wedding Admin Dashboard • Secure RSVP Management
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