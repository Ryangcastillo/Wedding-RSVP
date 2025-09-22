# Security Guide - Wedding RSVP App

## Overview
This document outlines the security measures implemented in the Wedding RSVP application.

## Security Features Implemented

### 1. Input Validation & Sanitization
- **Zod Schema Validation**: All API endpoints use Zod schemas for type validation
- **Input Sanitization**: String inputs are sanitized to remove potentially dangerous characters
- **Email Validation**: RFC-compliant email validation with additional security checks
- **Length Limits**: All inputs have appropriate length restrictions

### 2. Rate Limiting
- **Login Attempts**: 5 attempts per 15 minutes per IP address
- **RSVP Submissions**: 10 submissions per hour per IP address
- **In-Memory Storage**: Currently using Map-based storage (upgrade to Redis for production)

### 3. Security Headers
All API responses include comprehensive security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy`: Restrictive CSP policy

### 4. Authentication Security
- **Environment Variables**: No hardcoded passwords in production
- **Token Expiration**: 24-hour token expiration
- **IP Logging**: Security events are logged with IP addresses
- **Brute Force Protection**: Delays and rate limiting prevent attacks

### 5. Data Validation
- **Duplicate Prevention**: Email addresses cannot be used multiple times for RSVPs
- **Type Safety**: TypeScript and Zod ensure data integrity
- **Sanitized Storage**: All stored data is sanitized before persistence

## Security Recommendations for Production

### Environment Configuration
Create a `.env.local` file with secure values:
```bash
ADMIN_PASSWORD=your_very_secure_password_here
JWT_SECRET=your_32_character_minimum_jwt_secret
NODE_ENV=production
```

### Network Security
- Deploy behind HTTPS (automatic with Vercel)
- Consider using a CDN with DDoS protection
- Enable CORS restrictions for API endpoints

### Monitoring
- Set up logging for security events
- Monitor rate limiting triggers
- Track failed authentication attempts

## Known Security Considerations

### Current Limitations
1. **Token Storage**: Currently uses localStorage (client-side vulnerability)
2. **Rate Limiting**: In-memory storage (resets on server restart)
3. **File Storage**: Using JSON files instead of encrypted database

### Future Improvements
1. **Implement httpOnly cookies** for token storage
2. **Upgrade to Redis** for persistent rate limiting
3. **Add proper JWT** with refresh tokens
4. **Implement database encryption**
5. **Add request signing** for API calls

## Security Checklist

- [x] Input validation and sanitization
- [x] Rate limiting implementation  
- [x] Security headers configuration
- [x] Environment variable security
- [x] Error message sanitization
- [x] IP tracking and logging
- [ ] httpOnly cookie implementation
- [ ] JWT token implementation
- [ ] Database encryption
- [ ] Session management

## Incident Response

If a security issue is discovered:
1. Check logs for the extent of the issue
2. Review rate limiting logs
3. Check for unusual patterns in RSVP submissions
4. Update credentials if compromised
5. Review and update security measures

## Contact

For security concerns, please review the logs and consider the recommendations in this guide.