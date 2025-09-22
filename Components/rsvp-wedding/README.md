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
- **Input Validation**: Comprehensive Zod schemas for all data
- **Error Handling**: Graceful error states with user-friendly messages
- **Data Privacy**: GDPR-compliant guest data management

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

### 🚧 In Progress (Phase 2)
- [ ] **Enhanced RSVP Feature**: Feature module migration with service layer
- [ ] **Admin Dashboard Enhancement**: Advanced analytics and management tools
- [ ] **Content Management**: Dynamic wedding content system

### 📅 Planned (Phase 3+)
- [ ] **Testing Framework**: Unit, integration, and E2E tests
- [ ] **Performance Optimization**: Caching, lazy loading, PWA features
- [ ] **Email Integration**: RSVP confirmations and notifications
- [ ] **Deployment Pipeline**: CI/CD with Vercel optimization

## 📚 Documentation

### Architecture Documents
- `constitution.md` - Governing principles and standards
- `specification.md` - Feature requirements and acceptance criteria
- `plan.md` - Technical implementation roadmap
- `tasks.md` - Detailed task breakdown
- `css-styling-guidelines.md` - Design system documentation
- `repository-rules.md` - Development workflow standards
- `agent-guidelines.md` - AI collaboration framework

### API Documentation
- **Authentication**: `/api/auth/login`, `/api/auth/validate`, `/api/auth/logout`
- **RSVP Management**: `/api/rsvp` (GET, POST)

## 🤝 Contributing

1. Follow the repository rules in `repository-rules.md`
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
