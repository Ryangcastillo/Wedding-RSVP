/**
 * Protected Route Component
 * Wrapper component that ensures user is authenticated before rendering children
 * 
 * Reference: CONST-P5 (Security First), CONST-P14 (User Experience Excellence)
 */

'use client';

import React from 'react';
import { useRequireAuth } from '../hooks/use-auth';
import { LoginPage } from './login-form';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loadingComponent?: React.ReactNode;
}

/**
 * Wrapper component that protects routes requiring authentication
 */
export function ProtectedRoute({ 
  children, 
  fallback, 
  loadingComponent 
}: ProtectedRouteProps) {
  const { loading, shouldRedirect } = useRequireAuth();

  // Show loading state while checking authentication
  if (loading) {
    return loadingComponent || (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (shouldRedirect) {
    return fallback || <LoginPage />;
  }

  // User is authenticated, render children
  return <>{children}</>;
}

/**
 * Higher-order component version for wrapping components
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    fallback?: React.ReactNode;
    loadingComponent?: React.ReactNode;
  }
) {
  const WrappedComponent = (props: P) => (
    <ProtectedRoute 
      fallback={options?.fallback}
      loadingComponent={options?.loadingComponent}
    >
      <Component {...props} />
    </ProtectedRoute>
  );

  WrappedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}