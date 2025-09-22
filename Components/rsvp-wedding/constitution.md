# Constitution - Wedding RSVP App

## Core Principles

### 1. Modular Architecture
- **MANDATORY MODULAR STRUCTURE**: Break everything into small, self-contained modules with single responsibilities.
- **STRICT SEPARATION OF CONCERNS**: UI components NEVER handle business logic or API calls directly.
- **FEATURE-BASED FOLDERS**: Organize by features, not file types (no more separate `components/` and `services/` at root).
- **CLEAN ARCHITECTURE**: Separate policy from implementation details - defer technology decisions.

### 2. Code Quality & Consistency
- **TYPE SAFETY**: Strict TypeScript config, no `any` types allowed.
- **NAMING CONVENTIONS**: PascalCase for components, camelCase for variables, kebab-case for files.
- **LINTERS MANDATORY**: ESLint, Prettier, Tailwind CSS linter configured and enforced.
- **DRY PRINCIPLE**: No duplicate logic - create reusable utilities.
- **SOLID PRINCIPLES**: Single responsibility, open/closed, dependency inversion.

### 3. Testing & Quality Assurance
- **UNIT TESTS REQUIRED**: Every core function must have unit tests.
- **TDD FOR CRITICAL PATHS**: Test-driven development for auth, APIs, core features.
- **MOCK EXTERNAL DEPS**: Mock databases, third-party APIs in tests.
- **CI/CD AUTOMATION**: Tests run automatically on every commit/PR.

### 4. Security & Best Practices
- **INPUT SANITIZATION**: Validate and sanitize all user inputs.
- **SECURE AUTHENTICATION**: Token-based auth (JWT, OAuth), HTTPS everywhere.
- **AUTHORIZATION CHECKS**: Role-based access control on all protected routes.
- **NO SECRETS IN CODE**: Use `.env` files, never commit sensitive data.
- **REGULAR SECURITY AUDITS**: Review critical code against security best practices.

### 5. Backend Integration & APIs
- **SERVICE LAYER PATTERN**: All API calls go through dedicated service functions.
- **CUSTOM HOOKS**: Business logic isolated in custom hooks, not components.
- **ERROR BOUNDARIES**: Implement error boundaries for graceful failure handling.
- **LOADING STATES**: Every async operation has loading, success, and error states.
- **ENVIRONMENT VARIABLES**: Never hardcode URLs, API keys, or configuration.

### 6. Styling & Design System
- **TAILWIND UTILITY-FIRST**: Use Tailwind classes for most layouts, spacing, typography.
- **DESIGN SYSTEM TOKENS**: Mirror colors, spacing, fonts in Tailwind config.
- **RESPONSIVE DESIGN**: Mobile-first with Tailwind breakpoints.
- **ACCESSIBILITY**: Sufficient color contrast, focus styles, keyboard navigation.
- **CSS MODULES**: For complex component styles not achievable with utilities.

### 7. Version Control & Collaboration
- **GIT FROM DAY ONE**: Initialize repository before writing any code.
- **FEATURE BRANCH WORKFLOW**: No direct commits to main branch.
- **MEANINGFUL COMMITS**: Clear, descriptive commit messages.
- **CODE REVIEWS MANDATORY**: Every feature branch requires review before merge.
- **REGULAR COMMITS**: Commit at natural breakpoints, not just at end of day.

### 8. Documentation & Knowledge Management
- **COMPREHENSIVE README**: Setup instructions, tech stack, architecture overview.
- **CODE COMMENTS**: Explain the "why" not the "what" - focus on complex logic.
- **ARCHITECTURAL DECISIONS**: Document important design choices (ADRs).
- **KEEP DOCS CURRENT**: Update documentation with every feature change.

### 9. Performance & Scalability
- **CODE SPLITTING**: Lazy loading, dynamic imports.
- **OPTIMIZATION**: Image optimization, caching strategies.
- **MONITORING**: Logging, error tracking, performance metrics.

## Tech Stack Commitments
- **Frontend**: Next.js 15+, TypeScript, Tailwind CSS v4
- **Backend**: Next.js API routes (serverless)
- **Database**: JSON file (for MVP), upgrade to SQLite/PostgreSQL later
- **Testing**: Jest, React Testing Library
- **Linting**: ESLint, Prettier
- **Deployment**: Vercel/Netlify

## Development Process
- **Spec-Driven Development**: Use Spec Kit for planning and implementation
- **AI-Assisted Coding**: Leverage GitHub Copilot with structured prompts
- **Iterative Development**: MVP first, then enhance features
- **Quality Gates**: Tests pass, linting clean, security audit before merge

## Success Metrics
- **Code Coverage**: >80% unit test coverage
- **Performance**: Lighthouse score >90
- **Accessibility**: WCAG 2.1 AA compliance
- **Security**: No high/critical vulnerabilities
- **User Experience**: Intuitive, responsive, fast-loading