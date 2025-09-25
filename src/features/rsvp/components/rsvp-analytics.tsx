/**
 * RSVP Analytics Component
 * Dashboard component showing wedding RSVP statistics and insights
 * 
 * Reference: CONST-P12 (Admin Interface), CONST-P4 (Type Safety)
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card';
import { useRSVPAnalytics } from '../hooks/use-rsvp';
import { RSVP } from '@/shared/types/rsvp';

interface RSVPAnalyticsProps {
  rsvps: RSVP[];
  className?: string;
}

export function RSVPAnalytics({ rsvps, className }: RSVPAnalyticsProps) {
  const { analytics, recentRSVPs, dietaryRequests } = useRSVPAnalytics(rsvps);

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{analytics.total}</div>
              <div className="text-sm text-muted-foreground">Total RSVPs</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{analytics.attending}</div>
              <div className="text-sm text-muted-foreground">Attending</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{analytics.notAttending}</div>
              <div className="text-sm text-muted-foreground">Not Attending</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{analytics.maybe}</div>
              <div className="text-sm text-muted-foreground">Maybe</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analytics.plusOnes}</div>
              <div className="text-sm text-muted-foreground">Plus Ones</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{analytics.attendanceRate}%</div>
              <div className="text-sm text-muted-foreground">Response Rate</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent RSVPs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">📅</span>
              Recent RSVPs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentRSVPs.length > 0 ? (
              <div className="space-y-3">
                {recentRSVPs.map((rsvp) => (
                  <div key={rsvp.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{rsvp.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(rsvp.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rsvp.attendance === 'yes' 
                          ? 'text-green-600 bg-green-50'
                          : rsvp.attendance === 'no' 
                            ? 'text-red-600 bg-red-50'
                            : 'text-yellow-600 bg-yellow-50'
                      }`}>
                        {rsvp.attendance === 'yes' ? '✅' : rsvp.attendance === 'no' ? '❌' : '❓'} {rsvp.attendance}
                      </span>
                      {rsvp.plusOne && (
                        <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                          +1
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <div className="text-3xl mb-2">📝</div>
                <p>No RSVPs yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dietary Requirements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">🍽️</span>
              Dietary Requirements ({analytics.dietaryRestrictions})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dietaryRequests.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {dietaryRequests.map((request, index) => (
                  <div key={index} className="p-3 bg-amber-50 rounded-lg">
                    <div className="font-medium text-amber-900">{request.name}</div>
                    <div className="text-sm text-amber-700 mt-1">{request.dietary}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <div className="text-3xl mb-2">🍽️</div>
                <p>No dietary requirements yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Attendance Visual */}
      {analytics.total > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">📊</span>
              Response Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Attendance Bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Attending ({analytics.attending})</span>
                  <span>{Math.round((analytics.attending / analytics.total) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(analytics.attending / analytics.total) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Maybe Bar */}
              {analytics.maybe > 0 && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Maybe ({analytics.maybe})</span>
                    <span>{Math.round((analytics.maybe / analytics.total) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-yellow-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(analytics.maybe / analytics.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Not Attending Bar */}
              {analytics.notAttending > 0 && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Not Attending ({analytics.notAttending})</span>
                    <span>{Math.round((analytics.notAttending / analytics.total) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-red-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(analytics.notAttending / analytics.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}