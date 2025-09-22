/**
 * Security Utilities
 * Centralized security functions for consistent implementation
 * 
 * Reference: CONST-P5 (Security First)
 */

import { NextResponse } from 'next/server';

/**
 * Security headers for API responses
 */
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;",
} as const;

/**
 * Add security headers to a NextResponse
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

/**
 * Create a secure API response with proper headers
 */
export function createSecureResponse<T>(data: T, status: number = 200): NextResponse {
  const response = NextResponse.json(data, { status });
  return addSecurityHeaders(response);
}

/**
 * Input sanitization for strings
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/['"]/g, '') // Remove quotes to prevent injection
    .trim()
    .substring(0, 1000); // Limit length
}

/**
 * Email validation with additional security checks
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const sanitized = sanitizeString(email);
  
  return (
    emailRegex.test(sanitized) &&
    sanitized.length <= 254 && // RFC 5321 limit
    !sanitized.includes('..') && // No consecutive dots
    !sanitized.startsWith('.') &&
    !sanitized.endsWith('.')
  );
}

/**
 * Rate limiting check (simple in-memory implementation)
 * In production, use Redis or similar
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string, 
  maxRequests: number = 5, 
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): { allowed: boolean; resetTime: number } {
  const now = Date.now();
  const key = `rate_limit:${identifier}`;
  const current = rateLimitMap.get(key);

  if (!current || now > current.resetTime) {
    // Reset or initialize
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, resetTime: now + windowMs };
  }

  if (current.count >= maxRequests) {
    return { allowed: false, resetTime: current.resetTime };
  }

  // Increment counter
  current.count++;
  return { allowed: true, resetTime: current.resetTime };
}

/**
 * Clean up expired rate limit entries
 */
export function cleanupRateLimit(): void {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}

// Cleanup expired entries every 30 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimit, 30 * 60 * 1000);
}