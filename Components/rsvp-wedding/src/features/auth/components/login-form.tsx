/**
 * Login Form Component
 * Secure admin login form with wedding theme styling
 * 
 * Reference: CONST-P15 (Wedding Theme Integration), CONST-P4 (Type Safety)
 */

'use client';

import React from 'react';
import { Button } from '@/shared/components/button';
import { Input } from '@/shared/components/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card';
import { Alert, AlertDescription } from '@/shared/components/alert';
import { useLoginForm } from '../hooks/use-auth';

interface LoginFormProps {
  onSuccess?: () => void;
  className?: string;
}

export function LoginForm({ onSuccess, className }: LoginFormProps) {
  const {
    credentials,
    isSubmitting,
    error,
    handleSubmit,
    handleInputChange,
    clearError,
  } = useLoginForm();

  // Handle successful login
  React.useEffect(() => {
    if (!error && !isSubmitting && credentials.password === '') {
      // Password was cleared, indicating successful login
      onSuccess?.();
    }
  }, [error, isSubmitting, credentials.password, onSuccess]);

  return (
    <Card className={`w-full max-w-md ${className || ''}`}>
      <CardHeader className="text-center">
        <CardTitle className="font-serif text-2xl text-primary">
          Admin Login
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Enter admin password"
              value={credentials.password}
              onChange={(e) => {
                clearError();
                handleInputChange('password', e.target.value);
              }}
              disabled={isSubmitting}
              required
              className="w-full"
              autoComplete="current-password"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting || !credentials.password}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

/**
 * Simple login page wrapper component
 */
export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-primary mb-2">
            Wedding Admin
          </h1>
          <p className="text-muted-foreground">
            Access your wedding management dashboard
          </p>
        </div>
        
        <LoginForm />
        
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Secure access for wedding administrators only
          </p>
        </div>
      </div>
    </div>
  );
}