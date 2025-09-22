/**
 * Admin Dashboard Overview Component
 * Main dashboard view with key metrics and quick actions
 * 
 * Reference: CONST-P12 (Admin Interface), CONST-P4 (Type Safety)
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card';
import { Button } from '@/shared/components/button';
import { Alert, AlertDescription } from '@/shared/components/alert';
import { RSVP } from '@/shared/types/rsvp';

interface AdminDashboardOverviewProps {
  rsvps: RSVP[];
  className?: string;
}

export function AdminDashboardOverview({ rsvps, className }: AdminDashboardOverviewProps) {
  const totalRSVPs = rsvps.length;
  const attendingCount = rsvps.filter(rsvp => rsvp.attendance === 'yes').length;
  const totalGuests = attendingCount + rsvps.filter(rsvp => rsvp.attendance === 'yes' && rsvp.plusOne).length;
  const dietaryCount = rsvps.filter(rsvp => rsvp.dietary && rsvp.dietary.trim().length > 0).length;
  
  // Recent activity (last 7 days)
  const recentDate = new Date();
  recentDate.setDate(recentDate.getDate() - 7);
  const recentRSVPs = rsvps.filter(rsvp => new Date(rsvp.submittedAt) >= recentDate);

  // Pending items that need attention
  const pendingItems = [
    ...(rsvps.filter(rsvp => rsvp.attendance === 'maybe').length > 0 ? 
      [`${rsvps.filter(rsvp => rsvp.attendance === 'maybe').length} guests haven't confirmed attendance`] : []),
    ...(dietaryCount > 0 ? [`${dietaryCount} guests have dietary requirements`] : []),
    ...(recentRSVPs.length > 0 ? [`${recentRSVPs.length} new RSVPs in the last 7 days`] : [])
  ];

  const quickStats = [
    {
      title: 'Total RSVPs',
      value: totalRSVPs,
      subtitle: 'Responses received',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      icon: '📝'
    },
    {
      title: 'Confirmed Guests',
      value: totalGuests,
      subtitle: 'Including plus ones',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: '✅'
    },
    {
      title: 'Response Rate',
      value: totalRSVPs > 0 ? `${Math.round((attendingCount / totalRSVPs) * 100)}%` : '0%',
      subtitle: 'Positive responses',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      icon: '📈'
    },
    {
      title: 'Special Meals',
      value: dietaryCount,
      subtitle: 'Dietary requirements',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      icon: '🍽️'
    }
  ];

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Welcome Message */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">Welcome to Your Wedding Dashboard</h2>
              <p className="text-muted-foreground">
                Here&apos;s what&apos;s happening with your wedding RSVPs today.
              </p>
            </div>
            <div className="text-6xl">💒</div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                {stat.value}
              </div>
              <div className="text-sm font-medium text-gray-900 mb-1">
                {stat.title}
              </div>
              <div className="text-xs text-muted-foreground">
                {stat.subtitle}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center space-y-2">
              <span className="text-2xl">📧</span>
              <span className="text-sm">Send Reminders</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <span className="text-2xl">📊</span>
              <span className="text-sm">Export Data</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <span className="text-2xl">👥</span>
              <span className="text-sm">Guest List</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <span className="text-2xl">⚙️</span>
              <span className="text-sm">Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Attention Items */}
      {pendingItems.length > 0 && (
        <Alert>
          <AlertDescription>
            <div className="font-medium mb-2">Items that need your attention:</div>
            <ul className="list-disc list-inside space-y-1">
              {pendingItems.map((item, index) => (
                <li key={index} className="text-sm">{item}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Recent Activity */}
      {recentRSVPs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent RSVP Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentRSVPs.slice(0, 5).map((rsvp) => (
                <div key={rsvp.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      rsvp.attendance === 'yes' 
                        ? 'bg-green-500'
                        : rsvp.attendance === 'no' 
                          ? 'bg-red-500'
                          : 'bg-yellow-500'
                    }`}></div>
                    <div>
                      <div className="font-medium">{rsvp.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(rsvp.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      rsvp.attendance === 'yes' 
                        ? 'text-green-600'
                        : rsvp.attendance === 'no' 
                          ? 'text-red-600'
                          : 'text-yellow-600'
                    }`}>
                      {rsvp.attendance === 'yes' ? 'Attending' : rsvp.attendance === 'no' ? 'Not Attending' : 'Maybe'}
                    </div>
                    {rsvp.plusOne && (
                      <div className="text-xs text-blue-600">+1 Guest</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}