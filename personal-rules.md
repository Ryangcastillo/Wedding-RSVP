# Personal Development Rules - Wedding RSVP App

## Phase 2 Implementation Guidelines

### 🎯 **Priority Order**
1. **Authentication First** - Secure admin access is critical
2. **RSVP Enhancement** - Core functionality improvement
3. **Admin Dashboard** - Management interface
4. **Content Management** - Dynamic content system

### 🏗️ **Architecture Rules**

#### Feature Module Structure
Each feature must have this exact structure:
```
src/features/{feature}/
├── components/          # UI components specific to this feature
├── hooks/              # Custom React hooks for this feature
├── services/           # API calls and business logic
├── types/              # Feature-specific types (extends shared types)
└── index.ts            # Clean exports only
```

#### Import Rules
- ✅ **DO**: Import from feature indexes: `import { LoginForm } from '@/features/auth'`
- ✅ **DO**: Import shared types: `import { ApiResponse } from '@/shared/types'`
- ❌ **DON'T**: Deep import into feature internals: `import { LoginForm } from '@/features/auth/components/LoginForm'`
- ❌ **DON'T**: Cross-feature imports: auth importing from rsvp directly

#### Component Rules
- **Single Responsibility**: One component = one clear purpose
- **Props Interface**: Always define TypeScript interfaces for props
- **Error Boundaries**: Wrap risky operations in error handling
- **Loading States**: Every async operation needs loading UI

### 🔒 **Security Rules**

#### Authentication
- **JWT Tokens**: Store in httpOnly cookies, never localStorage
- **Session Management**: Implement proper session timeouts
- **Role Checking**: Verify permissions on every protected action
- **Password Security**: Hash passwords, implement rate limiting

#### Input Validation
- **Client + Server**: Validate on both frontend and API
- **Zod Schemas**: Use existing schemas for consistency
- **Sanitization**: Clean all user inputs before processing
- **SQL Injection Prevention**: Use parameterized queries

### 🧪 **Testing Rules** (Phase 3)
- **Test First**: Write test before implementation for critical paths
- **Mock External Dependencies**: Never hit real APIs in tests
- **Integration Tests**: Test feature workflows end-to-end
- **Coverage Minimum**: 80% coverage for services, 60% for components

### 🎨 **UI/UX Rules**

#### Design System
- **Consistent Spacing**: Use Tailwind spacing tokens only
- **Wedding Theme**: Stick to defined color palette
- **Typography**: Inter for body, Playfair Display for headings
- **Responsive Design**: Mobile-first approach

#### Accessibility
- **Semantic HTML**: Use proper HTML5 elements
- **ARIA Labels**: Add labels for screen readers
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Color Contrast**: Meet WCAG 2.1 AA standards

### 📊 **Performance Rules**

#### React Optimization
- **Lazy Loading**: Use React.lazy() for heavy components
- **Memoization**: Use useMemo/useCallback for expensive operations
- **State Management**: Keep state as local as possible
- **Re-render Prevention**: Optimize component updates

#### Bundle Optimization
- **Code Splitting**: Split by routes and features
- **Tree Shaking**: Ensure unused code is eliminated
- **Image Optimization**: Use Next.js Image component
- **CSS Purging**: Remove unused Tailwind classes

### 🔄 **Development Workflow**

#### Before Starting Each Feature
1. ✅ Update todo list with specific tasks
2. ✅ Review existing types and components to reuse
3. ✅ Plan the API contracts and data flow
4. ✅ Identify potential security concerns
5. ✅ Consider error handling scenarios

#### Implementation Order
1. **Types & Schemas** - Define data structures first
2. **Services** - Implement business logic and API calls
3. **Hooks** - Create React hooks for state management
4. **Components** - Build UI components last
5. **Integration** - Wire everything together

#### Before Committing
1. ✅ Run `npm run lint` - no warnings allowed
2. ✅ Run `npm run build` - successful build required
3. ✅ Test critical paths manually
4. ✅ Check responsive design on mobile
5. ✅ Update documentation if needed

### 🚨 **Red Flags - Never Do This**
- ❌ **No Any Types**: Never use `any`, always define proper types
- ❌ **No Hardcoded Values**: Use constants or environment variables
- ❌ **No Business Logic in Components**: Keep components pure UI
- ❌ **No Unhandled Promises**: Always handle async errors
- ❌ **No Direct DOM Manipulation**: Use React patterns only
- ❌ **No Sensitive Data in Client**: Keep secrets server-side
- ❌ **No Skipping Validation**: Validate every user input

### 📝 **Documentation Rules**
- **README Updates**: Document any new features or setup steps
- **Code Comments**: Explain why, not what
- **Type Definitions**: Self-documenting through TypeScript
- **API Documentation**: Document all endpoints and responses

## Next Phase Goals

### Phase 2 Success Criteria
- ✅ All features follow modular architecture
- ✅ Zero TypeScript errors or lint warnings
- ✅ Successful build and manual testing
- ✅ Proper error handling and loading states
- ✅ Security best practices implemented
- ✅ Responsive design working on mobile

### Phase 3 Preparation
- Testing infrastructure setup
- Performance optimization
- Accessibility improvements
- Production deployment readiness