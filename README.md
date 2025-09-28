# Wedding RSVP Application

> A beautiful, secure, and modern wedding RSVP management system built with Next.js 15+

## ✨ Features

### 🎯 Core Functionality
- **Guest RSVP System**: Beautiful form with validation and confirmation
- **Admin Dashboard**: Secure management interface with analytics
- **Wedding Information**: Story, schedule, moments, travel, and registry pages
- **Mobile-First Design**: Optimized for all devices with wedding theme

### 🛡️ Security & Authentication
- **Protected Admin Routes**: Secure authentication with token-based sessions
- **Rate Limiting**: IP-based protection against brute force attacks
- **Input Validation**: Comprehensive Zod schemas with sanitization
- **Security Headers**: XSS, CSRF, and content type protection
- **Error Handling**: Graceful error states with secure error messages
- **Data Privacy**: GDPR-compliant guest data management with duplicate prevention

### 🏗️ Technical Excellence
- **Feature-Based Architecture**: Modular structure with clean separation of concerns
- **Type Safety**: Full TypeScript with strict mode enabled
- **Design System**: Wedding-themed Tailwind CSS with semantic tokens
- **Performance**: Optimized builds with code splitting and lazy loading

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17+ or 20+
- npm, yarn, pnpm, or bun

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd rsvp-wedding

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup
Create a `.env.local` file:
```env
ADMIN_PASSWORD=your-secure-password
JWT_SECRET=your-jwt-secret-key
```

### Access the Application
- **Guest Interface**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **Development Build**: `npm run build`

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin dashboard page
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   └── rsvp/                 # RSVP management
│   ├── rsvp/                     # Guest RSVP page
│   ├── story/                    # Wedding story
│   ├── moments/                  # Photo gallery
│   ├── schedule/                 # Wedding schedule
│   └── ...                       # Other pages
├── features/                     # Feature modules
│   ├── auth/                     # Authentication feature
│   │   ├── components/           # Login forms, protected routes
│   │   ├── hooks/                # Auth state management
│   │   ├── services/             # API integration
│   │   └── types/                # Auth types
│   ├── rsvp/                     # RSVP feature (in development)
│   ├── admin/                    # Admin feature
│   └── content/                  # Content management
├── shared/                       # Cross-cutting concerns
│   ├── components/               # Reusable UI components
│   ├── types/                    # Global types with Zod validation
│   ├── utils/                    # Utility functions
│   └── styles/                   # Theme configuration
└── lib/                          # Core infrastructure
```

## 🎨 Design System

### Wedding Theme
- **Primary**: Gold (#F59E0B) - Elegant wedding gold
- **Blush**: Pink (#FCA5A5) - Soft romantic accent
- **Sage**: Gray (#A3A3A3) - Natural complement
- **Typography**: Playfair Display (serif) + Inter (sans-serif)

### Components
- Built on shadcn/ui foundation
- Wedding-specific customizations
- Mobile-first responsive design
- Accessibility compliant (WCAG 2.1 AA)

## 🛠️ Development

### Key Scripts
```bash
npm run dev         # Start development server
npm run build       # Production build
npm run lint        # ESLint checking
npm run type-check  # TypeScript validation
```

### Code Quality
- **TypeScript**: Strict mode with comprehensive types
- **ESLint**: Extended Next.js configuration
- **Prettier**: Consistent code formatting
- **Zod**: Runtime validation for all data

### Architecture Principles
Following constitutional principles (CONST-P1 through CONST-P15):
- Modular architecture first
- AI-driven development
- Type safety everywhere
- Security-first approach
- Wedding theme integration

## 📋 Current Status

### ✅ Completed (Phase 1-2)
- [x] **Foundation Setup**: Project structure, design system, type safety
- [x] **Authentication System**: Secure admin login with protected routes
- [x] **Enhanced Governance**: Constitutional principles and development standards
- [x] **Code Quality**: Zero lint errors, successful production builds

### 🚧 Recent Refactoring (Completed)
- [x] **Code Quality**: Fixed TypeScript errors, eliminated `any` types
- [x] **Performance**: Optimized React components with hooks patterns
- [x] **Security**: Comprehensive security implementation with rate limiting
- [x] **Architecture**: Validated modular structure, identified optimization opportunities

### 📅 Planned (Phase 3+)
- [ ] **Testing Framework**: Unit, integration, and E2E tests
- [ ] **Performance Optimization**: Caching, lazy loading, PWA features
- [ ] **Email Integration**: RSVP confirmations and notifications
- [ ] **Deployment Pipeline**: CI/CD with Vercel optimization

## 📚 Documentation

> **📁 Organized Documentation**: All project documentation is now organized in the [`docs/`](./docs/) directory for better discoverability.

### Architecture & Design
- [`docs/architecture/`](./docs/architecture/) - System architecture and design decisions
  - [`constitution.md`](./docs/architecture/constitution.md) - Governing principles and development standards  
  - [`specification.md`](./docs/architecture/specification.md) - Feature requirements and acceptance criteria
  - [`plan.md`](./docs/architecture/plan.md) - Technical implementation roadmap
  - [`components-list.md`](./docs/architecture/components-list.md) - Component inventory

### Development Guides  
- [`docs/development/`](./docs/development/) - Development workflows and team standards
  - [`repository-rules.md`](./docs/development/repository-rules.md) - Git workflow and development standards
  - [`css-styling-guidelines.md`](./docs/development/css-styling-guidelines.md) - Design system documentation
  - [`agent-guidelines.md`](./docs/development/agent-guidelines.md) - AI collaboration framework
  - [`tasks.md`](./docs/development/tasks.md) - Detailed task breakdown and planning

### Project History
- [`docs/logs/`](./docs/logs/) - Historical records and migration documentation
  - [`refactor_log.md`](./docs/logs/refactor_log.md) - Complete log of refactoring changes and fixes  
  - [`migration_guide.md`](./docs/logs/migration_guide.md) - Step-by-step migration documentation

### Security & Configuration
- `SECURITY.md` - Security guide and implementation details
- `.env.example` - Environment configuration template

### API Documentation
- **Authentication**: `/api/auth/login`, `/api/auth/validate`, `/api/auth/logout`
- **RSVP Management**: `/api/rsvp` (GET, POST)

## 🤝 Contributing

1. Follow the repository rules in [`docs/development/repository-rules.md`](./docs/development/repository-rules.md)
2. Use conventional commits for all changes
3. Ensure TypeScript strict compliance
4. Apply wedding design system consistently
5. Update documentation for significant changes

## 🎯 Wedding Context

This application is specifically designed for wedding RSVP management with:
- **Guest Privacy**: Secure handling of personal information
- **Mobile Experience**: Most guests will use mobile devices
- **Elegant Design**: Beautiful interface worthy of your special day
- **Easy Management**: Simple admin tools for the couple

---

*Built with ❤️ for your special day*
