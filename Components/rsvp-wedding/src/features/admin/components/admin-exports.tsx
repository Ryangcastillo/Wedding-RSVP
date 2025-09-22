/**
 * Admin Exports Component
 * Data export and reporting functionality
 * 
 * Reference: CONST-P12 (Admin Interface), CONST-P4 (Type Safety)
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card';
import { Button } from '@/shared/components/button';
import { Alert, AlertDescription } from '@/shared/components/alert';
import { RSVP } from '@/shared/types/rsvp';

interface AdminExportsProps {
  rsvps: RSVP[];
  className?: string;
}

export function AdminExports({ rsvps, className }: AdminExportsProps) {
  const [exportStatus, setExportStatus] = useState<'idle' | 'exporting' | 'success' | 'error'>('idle');

  const exportFormats = [
    {
      id: 'csv',
      name: 'CSV Export',
      description: 'Comma-separated values file for spreadsheets',
      icon: '📊',
      filename: 'wedding-rsvps.csv'
    },
    {
      id: 'pdf',
      name: 'PDF Report',
      description: 'Formatted report with charts and statistics',
      icon: '📄',
      filename: 'wedding-report.pdf'
    },
    {
      id: 'xlsx',
      name: 'Excel Export',
      description: 'Microsoft Excel spreadsheet with multiple sheets',
      icon: '📈',
      filename: 'wedding-data.xlsx'
    },
    {
      id: 'json',
      name: 'JSON Export',
      description: 'Raw data in JSON format for developers',
      icon: '🔧',
      filename: 'wedding-data.json'
    }
  ];

  const reportTypes = [
    {
      id: 'full-report',
      name: 'Complete Wedding Report',
      description: 'All RSVPs, analytics, and guest information',
      icon: '📋',
      includes: ['Guest List', 'RSVP Responses', 'Analytics', 'Dietary Requirements']
    },
    {
      id: 'guest-list',
      name: 'Guest List Only',
      description: 'Attending guests with contact information',
      icon: '👥',
      includes: ['Attending Guests', 'Contact Details', 'Plus Ones']
    },
    {
      id: 'dietary-report',
      name: 'Dietary Requirements',
      description: 'Special meal requirements for catering',
      icon: '🍽️',
      includes: ['Dietary Restrictions', 'Guest Count', 'Special Requests']
    },
    {
      id: 'analytics-only',
      name: 'Analytics Report',
      description: 'Charts and statistics overview',
      icon: '📊',
      includes: ['Response Rates', 'Attendance Charts', 'Trends']
    }
  ];

  const handleExport = async (format: string, reportType: string) => {
    setExportStatus('exporting');

    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate export data based on format and type
      let exportData: string | object;
      let filename: string;

      switch (format) {
        case 'csv':
          exportData = generateCSV(rsvps, reportType);
          filename = `wedding-${reportType}.csv`;
          break;
        case 'json':
          exportData = generateJSON(rsvps, reportType);
          filename = `wedding-${reportType}.json`;
          break;
        case 'pdf':
        case 'xlsx':
          // These would require special libraries in real implementation
          exportData = `Mock ${format.toUpperCase()} export for ${reportType}`;
          filename = `wedding-${reportType}.${format}`;
          break;
        default:
          exportData = generateCSV(rsvps, reportType);
          filename = `wedding-${reportType}.csv`;
      }

      // Download file
      downloadFile(exportData, filename, format);
      setExportStatus('success');
      
      setTimeout(() => setExportStatus('idle'), 3000);
    } catch {
      setExportStatus('error');
      setTimeout(() => setExportStatus('idle'), 3000);
    }
  };

  const generateCSV = (data: RSVP[], reportType: string): string => {
    const headers = ['Name', 'Email', 'Attendance', 'Plus One', 'Plus One Name', 'Dietary', 'Message', 'Submitted Date'];
    
    let filteredData = data;
    if (reportType === 'guest-list') {
      filteredData = data.filter(rsvp => rsvp.attendance === 'yes');
    } else if (reportType === 'dietary-report') {
      filteredData = data.filter(rsvp => rsvp.dietary && rsvp.dietary.trim().length > 0);
    }

    const csvContent = [
      headers.join(','),
      ...filteredData.map(rsvp => [
        `"${rsvp.name}"`,
        `"${rsvp.email}"`,
        rsvp.attendance,
        rsvp.plusOne ? 'Yes' : 'No',
        `"${rsvp.plusOneName || ''}"`,
        `"${rsvp.dietary || ''}"`,
        `"${rsvp.message || ''}"`,
        new Date(rsvp.submittedAt).toISOString().split('T')[0]
      ].join(','))
    ].join('\n');

    return csvContent;
  };

  const generateJSON = (data: RSVP[], reportType: string): object => {
    let filteredData = data;
    if (reportType === 'guest-list') {
      filteredData = data.filter(rsvp => rsvp.attendance === 'yes');
    } else if (reportType === 'dietary-report') {
      filteredData = data.filter(rsvp => rsvp.dietary && rsvp.dietary.trim().length > 0);
    }

    return {
      exportDate: new Date().toISOString(),
      reportType,
      totalRecords: filteredData.length,
      data: filteredData
    };
  };

  const downloadFile = (content: string | object, filename: string, format: string) => {
    let blob: Blob;

    switch (format) {
      case 'json':
        blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
        break;
      case 'csv':
        blob = new Blob([content as string], { type: 'text/csv;charset=utf-8' });
        break;
      default:
        blob = new Blob([content as string], { type: 'text/plain' });
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  };

  // Statistics for display
  const totalRSVPs = rsvps.length;
  const attendingCount = rsvps.filter(rsvp => rsvp.attendance === 'yes').length;
  const dietaryCount = rsvps.filter(rsvp => rsvp.dietary && rsvp.dietary.trim().length > 0).length;

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Status Messages */}
      {exportStatus === 'exporting' && (
        <Alert>
          <AlertDescription>📤 Preparing your export... Please wait.</AlertDescription>
        </Alert>
      )}
      
      {exportStatus === 'success' && (
        <Alert>
          <AlertDescription>✅ Export completed successfully! Check your downloads folder.</AlertDescription>
        </Alert>
      )}
      
      {exportStatus === 'error' && (
        <Alert variant="destructive">
          <AlertDescription>❌ Export failed. Please try again.</AlertDescription>
        </Alert>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{totalRSVPs}</div>
              <div className="text-sm text-muted-foreground">Total Records</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{attendingCount}</div>
              <div className="text-sm text-muted-foreground">Attending</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{dietaryCount}</div>
              <div className="text-sm text-muted-foreground">Dietary Requests</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {new Date().toLocaleDateString()}
              </div>
              <div className="text-sm text-muted-foreground">Export Date</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Report Types */}
        <Card>
          <CardHeader>
            <CardTitle>Report Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reportTypes.map((report) => (
              <div key={report.id} className="border rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{report.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{report.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {report.includes.map((item, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-3">
                  {exportFormats.map((format) => (
                    <Button
                      key={format.id}
                      size="sm"
                      variant="outline"
                      onClick={() => handleExport(format.id, report.id)}
                      disabled={exportStatus === 'exporting'}
                      className="text-xs"
                    >
                      {format.icon} {format.id.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Export Formats */}
        <Card>
          <CardHeader>
            <CardTitle>Export Formats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {exportFormats.map((format) => (
              <div key={format.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{format.icon}</span>
                    <div>
                      <h3 className="font-medium">{format.name}</h3>
                      <p className="text-sm text-muted-foreground">{format.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Quick Export Buttons */}
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">Quick Exports</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleExport('csv', 'full-report')}
                  disabled={exportStatus === 'exporting'}
                  className="h-12"
                >
                  📊 All Data (CSV)
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExport('csv', 'guest-list')}
                  disabled={exportStatus === 'exporting'}
                  className="h-12"
                >
                  👥 Guest List (CSV)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Exports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-3xl mb-2">📦</div>
            <p>Export history will appear here</p>
            <p className="text-sm">Your recent downloads and exports will be tracked</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}