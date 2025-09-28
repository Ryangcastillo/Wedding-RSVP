# Repository Rules - Wedding RSVP Project

> Development workflow standards for maintaining code quality and collaboration

**Reference**: CONST-P12 (Deployment & DevOps), CONST-P14 (Collaboration), CONST-P6 (Code Quality)

## Overview

This document establishes repository management standards for the Wedding RSVP project, ensuring consistent development practices, code quality, and efficient collaboration workflows.

## Branch Strategy

### Main Branches
- **`main`**: Production-ready code, always deployable
- **`develop`**: Integration branch for features, pre-production testing
- **`release/v*`**: Release preparation branches (when needed)
- **`hotfix/*`**: Critical production fixes

### Feature Branches
- **Naming**: `feature/brief-description` or `feat/brief-description`
- **Examples**: `feature/rsvp-form`, `feat/admin-dashboard`, `feature/mobile-responsive`
- **Lifecycle**: Create → Develop → Test → Review → Merge → Delete

### Branch Protection Rules
```yaml
main:
  - Require pull request reviews (minimum 1)
  - Require status checks to pass
  - Require branches to be up to date
  - Restrict pushes to main
  
develop:
  - Require pull request reviews
  - Allow force pushes (for clean history)
  - Require status checks
```

## Commit Standards

### Commit Message Format
```
<type>(<scope>): <description>

<optional body>

<optional footer>
```

### Commit Types
- **feat**: New feature implementation
- **fix**: Bug fixes and corrections
- **docs**: Documentation updates
- **style**: Code formatting, no logic changes
- **refactor**: Code restructuring without behavior changes
- **test**: Adding or updating tests
- **chore**: Build process, dependencies, tooling
- **perf**: Performance improvements
- **ci**: CI/CD configuration changes

### Commit Examples
```bash
# Feature development
feat(rsvp): add guest dietary restrictions field
feat(admin): implement RSVP analytics dashboard
feat(ui): add loading states to all forms

# Bug fixes
fix(validation): correct email format validation regex
fix(responsive): adjust mobile navigation menu positioning
fix(api): handle empty RSVP response gracefully

# Documentation and maintenance
docs(readme): update setup instructions
style(components): apply consistent spacing
refactor(types): consolidate RSVP type definitions
```

### Commit Best Practices
- **Atomic commits**: One logical change per commit
- **Clear messages**: Describe what and why, not how
- **Present tense**: "Add feature" not "Added feature"
- **Imperative mood**: "Fix bug" not "Fixes bug"
- **Line length**: Keep subject line under 50 characters
- **Reference issues**: Include issue numbers when applicable

## Pull Request Guidelines

### PR Creation Standards
1. **Title Format**: `<type>: Brief description of changes`
2. **Description Template**:
   ```markdown
   ## Changes Made
   - [ ] List key changes implemented
   - [ ] Include any breaking changes
   - [ ] Note configuration updates
   
   ## Testing
   - [ ] Manual testing completed
   - [ ] Edge cases verified
   - [ ] Mobile experience confirmed
   - [ ] Design system compliance checked
   
   ## Documentation
   - [ ] Code comments added where needed
   - [ ] Documentation updated if applicable
   - [ ] Type definitions updated
   
   ## Screenshots/Videos
   (Include visual proof of changes when applicable)
   
   ## Related Issues
   Closes #123, Fixes #456
   ```

### PR Review Process

#### Before Creating PR
- [ ] Self-review all changes
- [ ] Run local tests and linting
- [ ] Verify design system compliance
- [ ] Test on multiple screen sizes
- [ ] Ensure no breaking changes
- [ ] Update relevant documentation

#### Review Checklist for Reviewers
- [ ] **Code Quality**: Follows project conventions
- [ ] **Architecture**: Fits within established patterns
- [ ] **Design System**: Consistent with wedding theme
- [ ] **TypeScript**: Proper typing and validation
- [ ] **Performance**: No obvious bottlenecks
- [ ] **Security**: No vulnerabilities introduced
- [ ] **Mobile**: Responsive design implemented
- [ ] **Testing**: Adequate test coverage
- [ ] **Documentation**: Clear and up-to-date

#### Review Guidelines
- **Be constructive**: Suggest improvements, don't just point out problems
- **Ask questions**: "Why did you choose this approach?"
- **Praise good work**: Acknowledge clever solutions
- **Focus on code**: Keep personal preferences separate from standards
- **Be thorough**: Check edge cases and error handling

### PR Approval Requirements
- Minimum 1 approval for feature branches to develop
- Minimum 1 approval for develop to main
- All status checks must pass
- No unresolved conversations
- Up-to-date with target branch

## Code Quality Gates

### Automated Checks
```yaml
# GitHub Actions pipeline
checks:
  - TypeScript compilation
  - ESLint static analysis  
  - Prettier formatting
  - Build verification
  - Test suite execution (when implemented)
  - Bundle size analysis
```

### Manual Quality Assurance
- Wedding theme consistency verification
- Mobile responsiveness testing
- Accessibility compliance checking
- User experience validation
- Performance impact assessment

### Quality Metrics
- **Zero TypeScript errors**: Strict mode compliance
- **Zero ESLint errors**: All rules must pass
- **100% Prettier compliance**: Consistent formatting
- **Successful build**: No build failures allowed
- **Bundle size limits**: Monitor and prevent bloat

## Workflow Patterns

### Feature Development Workflow
```bash
# 1. Start feature
git checkout develop
git pull origin develop
git checkout -b feature/new-rsvp-field

# 2. Development cycle
# Make changes...
git add .
git commit -m "feat(rsvp): add dietary restrictions field"

# 3. Stay current (regularly)
git checkout develop
git pull origin develop
git checkout feature/new-rsvp-field
git rebase develop

# 4. Push and create PR
git push origin feature/new-rsvp-field
# Create PR via GitHub UI

# 5. After PR approval
git checkout develop
git pull origin develop
git branch -d feature/new-rsvp-field
```

### Hotfix Workflow
```bash
# 1. Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug-fix

# 2. Fix the issue
git add .
git commit -m "fix(critical): resolve RSVP submission error"

# 3. Create PR to main
git push origin hotfix/critical-bug-fix
# Create PR to main via GitHub UI

# 4. Also merge to develop
git checkout develop
git pull origin develop
git merge hotfix/critical-bug-fix
git push origin develop
git branch -d hotfix/critical-bug-fix
```

### Release Workflow
```bash
# 1. Create release branch
git checkout develop
git pull origin develop
git checkout -b release/v1.2.0

# 2. Final preparations
# Update version numbers, documentation
git add .
git commit -m "chore(release): prepare v1.2.0"

# 3. Create PR to main
git push origin release/v1.2.0
# Create PR to main

# 4. After merge, tag the release
git checkout main
git pull origin main
git tag -a v1.2.0 -m "Release v1.2.0"
git push origin v1.2.0

# 5. Merge back to develop
git checkout develop
git merge main
git push origin develop
git branch -d release/v1.2.0
```

## Issue Management

### Issue Labels
- **Type**: `bug`, `feature`, `enhancement`, `documentation`
- **Priority**: `critical`, `high`, `medium`, `low`
- **Status**: `ready`, `in-progress`, `blocked`, `needs-review`
- **Area**: `ui`, `api`, `admin`, `auth`, `rsvp`, `content`
- **Wedding Specific**: `design-system`, `mobile`, `accessibility`

### Issue Templates
```markdown
## Bug Report Template
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Device Information:**
- Device: [e.g. iPhone 12, Desktop]
- Browser: [e.g. chrome, safari]
- Version: [e.g. 22]

**Additional context**
Add any other context about the problem here.
```

```markdown
## Feature Request Template
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features you've considered.

**Wedding Context**
How does this feature enhance the wedding RSVP experience?

**Additional context**
Add any other context or screenshots about the feature request.
```

## Documentation Requirements

### Code Documentation
- **Complex functions**: JSDoc comments explaining purpose and parameters
- **Business logic**: Inline comments explaining wedding-specific rules
- **API endpoints**: Comprehensive documentation with examples
- **Component props**: TypeScript interfaces with descriptions

### Project Documentation
- Keep README.md current with setup and deployment instructions
- Update [`specification.md`](../architecture/specification.md) with new feature requirements
- Maintain architectural decision records (ADRs)
- Document configuration changes and environment variables

## Security Practices

### Sensitive Data Protection
- Never commit API keys, passwords, or secrets
- Use environment variables for configuration
- Implement proper .gitignore patterns
- Regular dependency security audits

### Code Security
- Validate all user inputs using Zod schemas
- Implement proper error handling without information leakage
- Use secure coding practices for authentication
- Regular security reviews of critical paths

## Performance Standards

### Code Performance
- Monitor bundle size increases
- Optimize images and assets
- Implement proper loading states
- Use React best practices for re-rendering

### Development Performance
- Keep CI/CD pipeline under 5 minutes
- Optimize Docker builds when implemented
- Use dependency caching effectively
- Monitor and optimize build times

## Collaboration Guidelines

### Communication
- Use descriptive PR titles and descriptions
- Respond to review feedback promptly
- Ask questions when requirements are unclear
- Share knowledge through code comments and documentation

### Conflict Resolution
- Discuss technical disagreements in PR comments
- Escalate to project lead when needed
- Focus on code quality and user experience
- Document decisions for future reference

### Knowledge Sharing
- Conduct informal code reviews
- Share useful patterns and discoveries
- Maintain tribal knowledge in documentation
- Onboard new contributors effectively

## Monitoring and Metrics

### Repository Health
- Monitor PR merge time
- Track code review coverage
- Measure build success rate
- Analyze commit frequency and patterns

### Quality Metrics
- TypeScript error rate (target: 0%)
- ESLint compliance (target: 100%)
- Test coverage (when implemented)
- Bundle size trends

### Process Improvement
- Regular retrospectives on development process
- Continuous refinement of workflow standards
- Adaptation based on team feedback
- Evolution of practices as project grows

---

## Quick Reference

### Daily Development Commands
```bash
# Start work
git checkout develop && git pull origin develop
git checkout -b feature/your-feature-name

# Regular commits
git add .
git commit -m "type(scope): description"

# Stay current
git fetch origin
git rebase origin/develop

# Create PR
git push origin feature/your-feature-name
```

### Quality Checklist
- [ ] TypeScript compiles without errors
- [ ] ESLint passes without warnings
- [ ] Code follows wedding design system
- [ ] Mobile experience tested
- [ ] PR description complete
- [ ] Self-review completed

### Emergency Procedures
For critical issues:
1. Create hotfix branch from main
2. Fix with minimal changes
3. Create PR directly to main
4. Notify team of critical fix
5. Ensure fix is merged to develop

Remember: These rules exist to maintain quality and enable efficient collaboration on this special wedding project. When in doubt, prioritize user experience and code maintainability.