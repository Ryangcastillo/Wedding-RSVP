# Specification - Wedding RSVP App Refactor

## Current State
The app is a basic Next.js wedding RSVP site with:
- Homepage with navigation and hero image
- RSVP form with basic validation
- Admin dashboard with simple password auth
- API routes for saving RSVPs to JSON file
- Placeholder pages for story, moments, schedule, etc.
- Basic styling with Tailwind CSS

## Problems to Address
- **Architecture**: Monolithic structure, components mixed with business logic
- **Code Quality**: No tests, inconsistent naming, potential security issues
- **Scalability**: No proper service layer, hardcoded values
- **Maintainability**: No modular structure, difficult to extend features
- **User Experience**: Basic UI, no error handling, loading states

## Desired Refactored State

### Core Features
1. **Landing Page**: Beautiful homepage showcasing the couple's story, wedding details, and navigation
2. **RSVP System**: Full-featured RSVP form with validation, confirmation, and management
3. **Admin Panel**: Secure dashboard for viewing/managing RSVPs, guest list, and analytics
4. **Content Management**: Pages for wedding story, photo moments, schedule, registry, travel info, Q&A
5. **Guest Experience**: Responsive design, accessibility, offline-capable PWA

### User Journeys

#### Guest Journey
1. **Discovery**: Visit homepage, learn about the couple and wedding
2. **Information Gathering**: Browse story, moments, schedule, travel details
3. **RSVP**: Submit RSVP with dietary preferences, plus-one info
4. **Confirmation**: Receive confirmation with wedding details
5. **Updates**: Get notifications about changes (optional)

#### Couple/Admin Journey
1. **Setup**: Configure wedding details, themes, content
2. **Management**: View RSVPs, send updates, manage guest list
3. **Analytics**: Track responses, dietary needs, attendance
4. **Communication**: Send announcements, reminders

### Success Criteria
- **Functionality**: All features work reliably with proper error handling
- **Performance**: Fast loading (<3s), optimized images, code splitting
- **Accessibility**: WCAG 2.1 AA compliant, keyboard navigation, screen reader support
- **Security**: Secure auth, input validation, HTTPS, no data leaks
- **Maintainability**: Modular code, comprehensive tests, clear documentation
- **Scalability**: Easy to add features, handle 1000+ RSVPs, multiple weddings

### Constraints
- **Tech Stack**: Next.js, TypeScript, Tailwind CSS (as established)
- **Budget**: Free tier services (Vercel, etc.)
- **Timeline**: MVP in 2 weeks, full features in 4 weeks
- **Compliance**: GDPR for EU users, general privacy best practices

### Risks & Mitigations
- **Data Loss**: Regular backups, validation before saves
- **Security Breaches**: Input sanitization, rate limiting, secure auth
- **Performance Issues**: Code splitting, image optimization, caching
- **User Adoption**: Intuitive UI, clear instructions, mobile-first design