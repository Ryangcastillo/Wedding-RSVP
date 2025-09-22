# Agent Guidelines for Wedding RSVP Project

> Comprehensive AI collaboration framework for consistent, efficient development

**Reference**: CONST-P2 (AI-Driven Development), CONST-P13 (Documentation), CONST-P14 (Collaboration)

## Overview

This document establishes standards for AI agent collaboration in the Wedding RSVP project, ensuring consistent communication, optimal context management, and efficient workflow execution.

## Core Principles

### 1. Context Management
- **Always gather context before acting**: Use read_file, grep_search, or semantic_search before making changes
- **Maintain conversation continuity**: Reference previous decisions and acknowledge ongoing work
- **Preserve user intent**: Keep original requirements clear throughout implementation
- **Document assumptions**: Explicitly state any assumptions made during development

### 2. Communication Patterns
- **Progress transparency**: Use manage_todo_list for complex multi-step work
- **Clear status updates**: Report completion of each significant step
- **Error acknowledgment**: Acknowledge and explain any issues encountered
- **Solution-focused**: Propose alternatives when initial approaches fail

### 3. Wedding Project Specifics
- **Theme consistency**: Always apply wedding design system (gold, blush, sage)
- **User experience focus**: Prioritize simplicity and elegance in UI/UX decisions
- **Data sensitivity**: Treat RSVP data as private and implement appropriate security
- **Mobile-first**: Consider mobile experience in all design decisions

## Workflow Patterns

### Standard Development Workflow

1. **Analysis Phase**
   ```
   📋 Understand requirements
   🔍 Gather relevant context
   📝 Create implementation plan (if complex)
   ✅ Confirm approach with user
   ```

2. **Implementation Phase**
   ```
   🚀 Execute planned changes
   ⚡ Test incrementally
   📊 Validate against requirements
   ✨ Apply design system consistently
   ```

3. **Completion Phase**
   ```
   ✅ Mark todos as completed
   📖 Update relevant documentation
   🎯 Summarize changes made
   🔄 Prepare for next iteration
   ```

### Prompting Patterns

#### For Complex Tasks
```
I'll handle this systematically:

1. [Analysis of current state]
2. [Implementation plan]
3. [Execution with progress updates]
4. [Validation and cleanup]

Let me start by...
```

#### For Simple Tasks
```
I'll [specific action] by [method].
```

#### For Error Scenarios
```
I encountered [specific issue]. 

Here's what I found:
- [Root cause]
- [Impact assessment]
- [Proposed solution]

Would you like me to proceed with [solution]?
```

## Code Quality Standards

### Before Any Code Changes
- [ ] Understand the feature/component's purpose
- [ ] Check existing patterns and conventions
- [ ] Validate against TypeScript types
- [ ] Ensure design system compliance
- [ ] Consider mobile responsiveness

### During Implementation
- [ ] Follow feature-based architecture
- [ ] Use proper Zod validation schemas
- [ ] Implement error handling
- [ ] Add appropriate TypeScript types
- [ ] Apply wedding theme consistently

### After Implementation
- [ ] Test functionality locally when possible
- [ ] Check for lint errors
- [ ] Validate against acceptance criteria
- [ ] Update documentation if needed
- [ ] Confirm mobile experience

## Collaboration Guidelines

### With User
- **Confirm before major changes**: Always outline approach for significant modifications
- **Provide options**: Offer alternatives when multiple valid solutions exist
- **Ask for clarification**: Request specifics when requirements are ambiguous
- **Show progress**: Use todo lists and status updates for transparency

### With Codebase
- **Respect existing patterns**: Follow established conventions and structures
- **Maintain consistency**: Ensure new code matches existing style and quality
- **Preserve functionality**: Don't break existing features during refactoring
- **Document decisions**: Update relevant docs when making architectural changes

## Technical Patterns

### File Organization
```
✅ Place components in appropriate feature directories
✅ Use shared/components for reusable UI elements
✅ Store types alongside their related code
✅ Group related functionality together
```

### Code Structure
```typescript
// 1. Imports (external libraries first)
import React from 'react';
import { z } from 'zod';

// 2. Imports (internal - absolute paths)
import { Button } from '@/shared/components';
import { RSVPFormData } from './types';

// 3. Types and interfaces
interface Props {
  onSubmit: (data: RSVPFormData) => void;
}

// 4. Component implementation
export function RSVPForm({ onSubmit }: Props) {
  // Component logic
}
```

### Styling Approach
```typescript
// Use CSS modules or Tailwind classes
// Apply wedding theme colors consistently
// Ensure mobile-first responsive design
// Follow accessibility guidelines

<Button 
  variant="primary"     // Use design system variants
  className="w-full"    // Mobile-first approach
  disabled={isLoading}  // Proper state management
>
  {isLoading ? 'Submitting...' : 'Submit RSVP'}
</Button>
```

## Error Handling Strategies

### Development Errors
1. **Syntax/Type Errors**: Fix immediately, explain the correction
2. **Logic Errors**: Trace through the issue, provide clear explanation
3. **Design System Violations**: Correct and reference proper patterns
4. **Performance Issues**: Identify bottleneck, propose optimization

### User Experience Errors
1. **Form Validation**: Provide clear, helpful error messages
2. **Loading States**: Implement appropriate feedback for async operations
3. **Network Issues**: Handle gracefully with retry mechanisms
4. **Data Inconsistency**: Validate and sanitize all user inputs

## Context Optimization

### Efficient Information Gathering
- Use `semantic_search` for broad codebase understanding
- Use `grep_search` for specific pattern matching
- Use `read_file` with appropriate line ranges for targeted reading
- Combine multiple searches when investigating complex issues

### Memory Management
- Summarize key decisions made during long sessions
- Reference previous implementations when building similar features
- Maintain awareness of overall project progress and goals
- Keep track of design decisions and their rationales

## Quality Assurance

### Self-Review Checklist
- [ ] Code follows TypeScript best practices
- [ ] Design system applied correctly
- [ ] Wedding theme consistent throughout
- [ ] Mobile experience considered
- [ ] Error handling implemented
- [ ] Performance implications assessed
- [ ] Documentation updated
- [ ] Tests written (when applicable)

### Handoff Standards
When completing work:
1. **Summary**: Clear description of changes made
2. **Testing**: What was validated and how
3. **Next Steps**: Recommended follow-up actions
4. **Known Issues**: Any limitations or technical debt
5. **Documentation**: Updated docs and decision records

## Escalation Guidelines

### When to Ask for Clarification
- Requirements are ambiguous or conflicting
- Multiple valid approaches exist with significant trade-offs
- User experience decisions need stakeholder input
- Technical constraints prevent ideal implementation

### When to Suggest Alternatives
- Current approach has significant limitations
- Better patterns exist for the use case
- Performance or maintainability concerns arise
- Accessibility issues are identified

## Continuous Improvement

### Learning from Each Interaction
- Note successful patterns for future reference
- Identify areas for workflow optimization
- Recognize common user preferences and priorities
- Build understanding of project-specific context

### Adaptation Guidelines
- Adjust communication style based on user feedback
- Refine technical approaches based on project evolution
- Update guidelines when new patterns emerge
- Maintain consistency while embracing improvement

---

## Quick Reference

### Essential Commands
- `manage_todo_list` - For complex task tracking
- `semantic_search` - For broad codebase understanding
- `read_file` - For targeted code analysis
- `replace_string_in_file` - For precise code modifications

### Key Files
- `constitution.md` - Governing principles (CONST-P#)
- `specification.md` - Feature requirements and acceptance criteria
- `css-styling-guidelines.md` - Design system and styling standards
- `plan.md` - Technical architecture and implementation roadmap

### Wedding Design System
- **Colors**: Primary Gold (#F59E0B), Blush (#FCA5A5), Sage (#A3A3A3)
- **Typography**: Playfair Display (headings), Inter (body)
- **Spacing**: Consistent 4px grid system
- **Components**: shadcn/ui with wedding theme customizations

Remember: This is a wedding project - prioritize elegance, simplicity, and user delight in every interaction.