# CSS Styling Guidelines - Wedding RSVP App

> Comprehensive styling guide emphasizing Tailwind CSS utility-first approach with wedding-themed design system.

**Reference**: CONST-P7 (Design System & UI Excellence), CONST-P14 (User Experience Excellence), CONST-P15 (Wedding Theme Integration)

This guide establishes how to manage styling in our wedding RSVP project, ensuring consistency, maintainability, and performance while creating a beautiful, celebratory user experience.

## 1. Tailwind CSS Foundation

### Version & Installation ✅ IMPLEMENTED
- **Latest Stable**: Using Tailwind CSS v4 for cutting-edge features
- **Local Install**: Installed via npm, avoiding global installations
- **JIT Mode**: Just-in-time compilation for optimal performance
- **Purge Configuration**: Unused styles automatically removed in production

### Configuration ✅ IMPLEMENTED
Our `tailwind.config.js` defines the wedding design system:

```js
// Wedding Theme Configuration
theme: {
  extend: {
    colors: {
      // Wedding Color Palette
      primary: {
        50: '#fdf7f0',   // Champagne light
        100: '#f7e6d1',  // Champagne
        500: '#d4af37',  // Gold
        600: '#b8941f',  // Dark gold
        900: '#8b6914'   // Deep gold
      },
      blush: {
        50: '#fef7f7',   // Soft blush
        100: '#fce8e6',  // Light blush
        200: '#f7cdc8',  // Blush
        300: '#f1a7a0'   // Deep blush
      },
      sage: {
        50: '#f7f9f7',   // Light sage
        100: '#e8f2e8',  // Sage green
        200: '#c8dcc8',  // Medium sage
        300: '#a3c4a3'   // Deep sage
      }
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],      // Body text
      serif: ['Playfair Display', 'Georgia', 'serif']   // Headings
    }
  }
}
```

## 2. Wedding Design System

### Color Philosophy
**Semantic Color Usage**:
- **Primary (Gold)**: CTAs, important actions, accent elements
- **Blush**: Romantic touches, soft backgrounds, gentle highlights
- **Sage**: Natural elements, calm sections, secondary content
- **Neutrals**: Text, backgrounds, subtle elements

**Color Application Rules**:
- ✅ **DO**: Use semantic color names (`text-primary-600`, `bg-blush-50`)
- ❌ **DON'T**: Mix arbitrary colors (`bg-red-500` with `bg-green-500`)
- ✅ **DO**: Maintain contrast ratios for accessibility
- ❌ **DON'T**: Use colors that don't align with wedding theme

### Typography System
**Font Hierarchy**:
```css
/* Headings - Playfair Display (serif) */
.heading-display    /* text-5xl font-serif font-bold */
.heading-1          /* text-4xl font-serif font-bold */
.heading-2          /* text-3xl font-serif font-semibold */
.heading-3          /* text-2xl font-serif font-semibold */

/* Body - Inter (sans) */
.body-large         /* text-lg font-sans */
.body-base          /* text-base font-sans */
.body-small         /* text-sm font-sans */
.caption           /* text-xs font-sans text-gray-600 */
```

**Usage Guidelines**:
- **Headings**: Always use serif font for elegance and romance
- **Body Text**: Sans-serif for readability and modern feel
- **CTAs**: Medium weight, clear hierarchy
- **Captions**: Light weight, subtle styling

### Spacing & Layout
**Spacing Scale** (multiples of 4px):
- `space-1` = 4px (tight spacing)
- `space-2` = 8px (small spacing)
- `space-4` = 16px (base spacing)
- `space-6` = 24px (medium spacing)
- `space-8` = 32px (large spacing)
- `space-12` = 48px (extra large spacing)

**Layout Patterns**:
```css
/* Card Container */
.wedding-card {
  @apply bg-white rounded-xl shadow-lg p-6 border border-blush-100;
}

/* Section Spacing */
.section-spacing {
  @apply py-12 px-4;
}

/* Container Widths */
.container-sm { @apply max-w-2xl mx-auto; }
.container-md { @apply max-w-4xl mx-auto; }
.container-lg { @apply max-w-6xl mx-auto; }
```

## 3. Responsive Design Excellence

### Mobile-First Approach ✅ IMPLEMENTED
**Breakpoint Strategy**:
- **Base (320px+)**: Mobile phones - primary design target
- **sm (640px+)**: Large phones, small tablets
- **md (768px+)**: Tablets, small laptops
- **lg (1024px+)**: Laptops, desktops
- **xl (1280px+)**: Large desktops

**Implementation Pattern**:
```jsx
// Mobile-first responsive design
<div className="
  grid grid-cols-1 gap-4    // Mobile: single column
  sm:grid-cols-2           // Small screens: 2 columns  
  lg:grid-cols-3           // Large screens: 3 columns
  xl:gap-6                 // Extra large: bigger gaps
">
```

### Wedding-Specific Responsive Rules
- **RSVP Form**: Single column on mobile, two columns on tablet+
- **Navigation**: Hamburger menu on mobile, horizontal on desktop
- **Photo Gallery**: 1 column mobile, 2-3 columns tablet, 4+ desktop
- **Admin Dashboard**: Stack cards on mobile, grid layout on desktop

## 4. Component-Level Styling

### Tailwind Utility Classes ✅ PRIMARY METHOD
**Class Grouping Pattern**:
```jsx
// Group by concern for readability
<button className="
  // Layout & Sizing
  px-6 py-3 rounded-lg
  // Typography  
  font-medium text-base
  // Colors & States
  bg-primary-500 text-white
  hover:bg-primary-600 focus:bg-primary-700
  // Transitions
  transition-colors duration-200
">
  RSVP Now
</button>
```

**Class Ordering (via ESLint plugin)**:
1. Layout (display, position, grid, flex)
2. Sizing (width, height, padding, margin)
3. Typography (font, text, leading)
4. Colors (background, text, border)
5. Effects (shadow, opacity, transform)
6. Interactions (hover, focus, active)
7. Transitions (transition, duration, ease)

### CSS Modules for Complex Components
**When to Use CSS Modules**:
- Complex animations not achievable with Tailwind
- Component-specific styles with dynamic values
- Legacy browser compatibility requirements

**File Structure**:
```
src/
├── shared/
│   ├── components/
│   │   ├── WeddingCard/
│   │   │   ├── WeddingCard.tsx
│   │   │   ├── WeddingCard.module.css  // Only when needed
│   │   │   └── index.ts
```

### Wedding Theme Components
**Standardized Component Styles**:

```jsx
// Wedding Button Variants
const buttonVariants = {
  primary: "bg-primary-500 hover:bg-primary-600 text-white",
  secondary: "bg-blush-100 hover:bg-blush-200 text-primary-700",
  ghost: "bg-transparent hover:bg-blush-50 text-primary-600"
}

// Wedding Card Styles  
const cardVariants = {
  elegant: "bg-white border border-blush-100 shadow-lg rounded-xl",
  romantic: "bg-gradient-to-br from-blush-50 to-white border border-blush-200",
  modern: "bg-white shadow-xl rounded-2xl border-0"
}
```

## 5. Accessibility & Inclusive Design

### Color Contrast ✅ WCAG 2.1 AA
- **Body Text**: Minimum 4.5:1 contrast ratio
- **Large Text**: Minimum 3:1 contrast ratio  
- **Interactive Elements**: Minimum 3:1 for focus indicators
- **Testing**: Use tools like Colour Contrast Analyser

### Keyboard Navigation
```jsx
// Proper focus management
<button className="
  focus:outline-none 
  focus-visible:ring-2 
  focus-visible:ring-primary-500 
  focus-visible:ring-offset-2
">
  {children}
</button>
```

### Screen Reader Support
- **Semantic HTML**: Use proper heading hierarchy (h1 → h2 → h3)
- **ARIA Labels**: Descriptive labels for interactive elements
- **Alt Text**: Meaningful descriptions for wedding photos
- **Skip Links**: Allow keyboard users to skip navigation

## 6. Performance & Optimization

### Bundle Size Optimization ✅ IMPLEMENTED
- **Purge CSS**: Remove unused Tailwind classes in production
- **Class Merging**: Use `clsx` or `cn` utility for conditional classes
- **Critical CSS**: Inline critical styles for above-the-fold content

### Loading Performance
```jsx
// Optimized image loading
import Image from 'next/image'

<Image
  src="/wedding-hero.jpg"
  alt="Beautiful wedding ceremony"
  width={800}
  height={600}
  priority={true}        // For hero images
  placeholder="blur"     // Show blur while loading
  className="rounded-lg object-cover"
/>
```

## 7. Error Prevention & Quality

### ESLint Tailwind Plugin ✅ CONFIGURED
```json
{
  "extends": ["plugin:@tailwindcss/recommended"],
  "rules": {
    "@tailwindcss/classnames-order": "error",
    "@tailwindcss/no-contradicting-classname": "error",
    "@tailwindcss/no-unnecessary-arbitrary-value": "error"
  }
}
```

### Styling Conventions
- **Consistent Naming**: Use design system tokens consistently
- **No Magic Numbers**: All spacing/sizing from Tailwind scale
- **Avoid Arbitrary Values**: Use design tokens instead of arbitrary values
- **Component Variants**: Define reusable component style variants

## 8. Wedding-Specific Guidelines

### Emotional Design Principles
- **Joy & Celebration**: Use warm, inviting colors and gentle animations
- **Elegance**: Clean layouts with plenty of whitespace
- **Romance**: Soft gradients, elegant typography, beautiful imagery
- **Personal**: Incorporate couple's style and personality

### Animation & Interactions
```jsx
// Subtle, celebratory animations
<div className="
  transform transition-all duration-300 ease-in-out
  hover:scale-105 hover:shadow-xl
  hover:-translate-y-1
">
  {/* Wedding content */}
</div>
```

### Photo & Media Styling
- **Rounded Corners**: Use `rounded-lg` or `rounded-xl` for warmth
- **Soft Shadows**: `shadow-lg` for depth without harshness
- **Aspect Ratios**: Consistent ratios for photo galleries
- **Overlay Text**: Ensure readability over images

## 9. Implementation Checklist

### Before Styling a Component
- [ ] Review design system tokens and wedding theme
- [ ] Consider mobile-first responsive behavior
- [ ] Plan hover, focus, and active states
- [ ] Ensure accessibility compliance
- [ ] Check color contrast ratios

### Code Review Checklist
- [ ] Uses Tailwind utility classes appropriately
- [ ] Follows established class ordering
- [ ] Maintains consistent spacing scale
- [ ] Implements proper focus states
- [ ] Mobile-responsive design verified
- [ ] Wedding theme colors used correctly

---

*These styling guidelines ensure our wedding RSVP app delivers a beautiful, accessible, and performant user experience that celebrates love and creates joy for every guest.*