# Components List - Wedding RSVP Site

This document records the main components and functionalities in the Next.js wedding RSVP codebase, based on the current structure. The site is a client-side React application using shadcn/ui for components and Tailwind CSS for styling. No APIs, databases, or external services are integrated yet.

## 1. Application Structure (Next.js Framework)

### src/app/ (App Router Directory)
- **Purpose**: Defines the Next.js App Router structure for client-side routing and page rendering. Each subdirectory (e.g., `story/`, `moments/`) represents a route, with `page.tsx` files as the entry points.
- **Connections**: None (static routing; no server-side APIs or databases).
- **Related Libraries/Frameworks**: Next.js (React framework for routing and SSR), React (for component rendering), TypeScript (for type safety).
- **Complexity Rating**: Intermediate (App Router requires understanding of file-based routing and React hooks, but no custom logic yet).

### src/components/ (Reusable Components Directory)
- **Purpose**: Houses shared UI components for reuse across pages (e.g., buttons, cards).
- **Connections**: None (pure UI; components are self-contained).
- **Related Libraries/Frameworks**: React (for component logic), shadcn/ui (component library), Tailwind CSS (for styling).
- **Complexity Rating**: Intermediate (Involves variant handling with libraries like `class-variance-authority`, but follows shadcn patterns).

### src/lib/ (Utilities Directory)
- **Purpose**: Contains utility functions (e.g., `utils.ts` for class merging).
- **Connections**: None.
- **Related Libraries/Frameworks**: `tailwind-merge` (for combining Tailwind classes), `clsx` (for conditional classes).
- **Complexity Rating**: Beginner (Simple helper functions).

### public/ (Static Assets Directory)
- **Purpose**: Stores static files like images (e.g., `next.svg`) and favicons served directly.
- **Connections**: None (local assets).
- **Related Libraries/Frameworks**: None (standard web assets).
- **Complexity Rating**: Beginner (Just file hosting).

## 2. UI Components (shadcn/ui Library)

### button.tsx
- **Purpose**: Renders interactive buttons with variants (e.g., default, outline) for actions like form submissions.
- **Connections**: None.
- **Related Libraries/Frameworks**: `class-variance-authority` (for variant definitions), `@radix-ui/react-slot` (for flexible rendering), Tailwind CSS.
- **Complexity Rating**: Intermediate (Uses advanced variant logic and Radix primitives).

### card.tsx
- **Purpose**: Provides layout containers for content sections (e.g., headers, titles) in forms or displays.
- **Connections**: None.
- **Related Libraries/Frameworks**: React, Tailwind CSS, `src/lib/utils.ts` (for class utilities).
- **Complexity Rating**: Beginner (Simple wrapper components).

### input.tsx
- **Purpose**: Creates form input fields with styling and accessibility (e.g., for RSVP forms).
- **Connections**: None (client-side only; no form submission logic yet).
- **Related Libraries/Frameworks**: React, Tailwind CSS.
- **Complexity Rating**: Beginner (Basic input with focus states).

### carousel.tsx
- **Purpose**: Enables image or content scrolling (e.g., for galleries).
- **Connections**: None.
- **Related Libraries/Frameworks**: Embla Carousel (underlying library), React.
- **Complexity Rating**: Intermediate (Requires carousel setup and item mapping).

### hero-carousel.tsx
- **Purpose**: Custom carousel for displaying wedding hero images (shows 3 at a time).
- **Connections**: None (uses static image array).
- **Related Libraries/Frameworks**: Builds on `carousel.tsx`, React.
- **Complexity Rating**: Intermediate (Custom mapping over images).

### alert.tsx, dialog.tsx
- **Purpose**: For notifications (alerts) and modals (dialogs), though not used in current pages.
- **Connections**: None.
- **Related Libraries/Frameworks**: Radix UI (for accessibility), Tailwind CSS.
- **Complexity Rating**: Intermediate (Radix-based for complex interactions).

## 3. Configuration Files

### package.json
- **Purpose**: Defines project metadata, dependencies (e.g., Next.js, Tailwind), and scripts (e.g., `npm run dev`).
- **Connections**: None (local config).
- **Related Libraries/Frameworks**: npm (package manager), Next.js, Tailwind CSS, shadcn/ui dependencies.
- **Complexity Rating**: Beginner (Standard JSON config).

### tailwind.config.js
- **Purpose**: Configures Tailwind CSS paths and plugins for styling.
- **Connections**: None.
- **Related Libraries/Frameworks**: Tailwind CSS.
- **Complexity Rating**: Beginner (Basic setup).

### components.json
- **Purpose**: Configures shadcn/ui installation paths and styles (e.g., "new-york" theme).
- **Connections**: None.
- **Related Libraries/Frameworks**: shadcn/ui CLI.
- **Complexity Rating**: Beginner (Auto-generated config).

### tsconfig.json, next.config.ts
- **Purpose**: TypeScript and Next.js configs for compilation and routing.
- **Connections**: None.
- **Related Libraries/Frameworks**: TypeScript, Next.js.
- **Complexity Rating**: Beginner (Default settings).

### postcss.config.mjs, eslint.config.mjs
- **Purpose**: PostCSS for CSS processing (Tailwind), ESLint for code linting.
- **Connections**: None.
- **Related Libraries/Frameworks**: PostCSS, Autoprefixer, ESLint.
- **Complexity Rating**: Beginner (Standard configs).

### globals.css
- **Purpose**: Global styles with Tailwind imports and theme variables (light/dark mode).
- **Connections**: None.
- **Related Libraries/Frameworks**: Tailwind CSS.
- **Complexity Rating**: Beginner (CSS variables).

## 4. Pages (Route-Specific Files)

### src/app/page.tsx (Homepage)
- **Purpose**: Displays the main wedding page with navigation, hero image, and date. Includes duplicate code (multiple `Home` functions and constants) causing build errors.
- **Connections**: None (static content).
- **Related Libraries/Frameworks**: React, Next.js, Tailwind CSS.
- **Complexity Rating**: Intermediate (JSX layout with mapping, but errors from duplicates).

### src/app/story/page.tsx, src/app/moments/page.tsx, etc. (Placeholder Pages)
- **Purpose**: Basic pages for navigation links (e.g., Story for couple's bio, Moments for photos). Currently just headings.
- **Connections**: None.
- **Related Libraries/Frameworks**: React, Next.js.
- **Complexity Rating**: Beginner (Simple static JSX).

### rsvp.html (Root HTML File)
- **Purpose**: Appears to be a standalone HTML file (possibly legacy or alternative entry).
- **Connections**: None.
- **Related Libraries/Frameworks**: None (plain HTML).
- **Complexity Rating**: Beginner.

## Summary Table

| Component/File | Purpose | Connections | Related Libraries/Frameworks | Complexity Rating |
|----------------|---------|-------------|------------------------------|-------------------|
| **src/app/** (App Router) | Handles routing and page rendering | None | Next.js, React, TypeScript | Intermediate |
| **src/components/** | Reusable UI components | None | React, shadcn/ui, Tailwind CSS | Intermediate |
| **src/lib/** | Utility functions | None | `tailwind-merge`, `clsx` | Beginner |
| **public/** | Static assets | None | None | Beginner |
| **button.tsx** | Interactive buttons with variants | None | `class-variance-authority`, Radix UI, Tailwind | Intermediate |
| **card.tsx** | Content layout containers | None | React, Tailwind, utils | Beginner |
| **input.tsx** | Form input fields | None | React, Tailwind | Beginner |
| **carousel.tsx** | Content scrolling | None | Embla, React | Intermediate |
| **hero-carousel.tsx** | Custom image carousel | None | React, carousel.tsx | Intermediate |
| **alert.tsx**, **dialog.tsx** | Notifications and modals | None | Radix UI, Tailwind | Intermediate |
| **package.json** | Project dependencies and scripts | None | npm, Next.js, Tailwind | Beginner |
| **tailwind.config.js** | Tailwind configuration | None | Tailwind CSS | Beginner |
| **components.json** | shadcn/ui config | None | shadcn/ui | Beginner |
| **tsconfig.json**, **next.config.ts** | TypeScript/Next.js configs | None | TypeScript, Next.js | Beginner |
| **postcss.config.mjs**, **eslint.config.mjs** | CSS processing and linting | None | PostCSS, ESLint | Beginner |
| **globals.css** | Global styles and themes | None | Tailwind CSS | Beginner |
| **src/app/page.tsx** | Main homepage with nav and hero | None | React, Next.js, Tailwind | Intermediate |
| **Placeholder Pages** (e.g., story/page.tsx) | Static page placeholders | None | React, Next.js | Beginner |
| **rsvp.html** | Standalone HTML file | None | None | Beginner |

*Last Updated: September 22, 2025*