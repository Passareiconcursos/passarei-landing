# Passarei - Landing Page & Lead Capture System

## Overview

Passarei is a SaaS platform that helps police exam candidates study via WhatsApp using AI-powered personalized learning. The application consists of a high-conversion landing page built with React and a PostgreSQL-backed lead capture system. The platform uses scientific spaced repetition methods and delivers study content directly through WhatsApp, targeting busy professionals who need flexible, mobile-first learning solutions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type safety
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- Tailwind CSS for utility-first styling with custom design system

**Component Library**
- shadcn/ui components built on Radix UI primitives for accessible, unstyled base components
- Custom theme system with CSS variables for colors and spacing
- Design guidelines focused on conversion optimization (mobile-first, WhatsApp-centric UX)
- Inter font family via Google Fonts CDN

**State Management & Data Fetching**
- TanStack Query (React Query) for server state management
- React Hook Form with Zod for form validation
- No global state management - component-local state and server state only

**Design System**
- Color palette defined in CSS variables (HSL format)
- Updated brand colors: Primary green #18cb96 (HSL: 160° 80% 45%), Secondary blue #1E40AF (HSL: 221° 83% 40%)
- Spacing based on Tailwind's 8px grid system
- Responsive breakpoints following mobile-first approach
- Consistent button styling with gradient effects and hover animations

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for the API layer
- Custom Vite integration for HMR in development
- Single-page application (SPA) serving with SSR-like template handling

**API Design**
- RESTful endpoints for lead management
- POST /api/leads - Create new lead with validation
- GET /api/leads - Retrieve all leads (admin functionality)
- Error handling middleware with structured error responses
- Request/response logging middleware for debugging

**Validation Layer**
- Zod schemas shared between client and server via `@shared` directory
- Custom validation for Brazilian phone format: (99) 99999-9999
- Email validation using Zod's built-in email validator
- Enum validation for exam types and states

### Data Storage

**Database**
- PostgreSQL via Neon serverless driver
- Drizzle ORM for type-safe database queries
- Schema-first approach with migrations in `/migrations` directory

**Schema Design**
- `leads` table with UUID primary keys
- Enum types for exam_type (PM, PC, PRF, PF, OUTRO) and lead_status (NOVO, CONTATADO, QUALIFICADO, CONVERTIDO)
- Timestamp fields for created_at and updated_at with automatic defaults
- WhatsApp opt-in tracking with acceptedWhatsApp boolean

**Data Access Pattern**
- Centralized database client in `db/index.ts`
- Shared schema definitions in `shared/schema.ts` for client/server consistency
- In-memory storage fallback (MemStorage) for development/testing

### External Dependencies

**Database & Infrastructure**
- Neon PostgreSQL serverless database
- WebSocket support via `ws` package for Neon connection pooling
- Drizzle Kit for schema migrations and database push operations

**UI Component Libraries**
- Radix UI primitives (30+ component packages) for accessibility
- Lucide React for consistent iconography
- class-variance-authority (CVA) for component variant management
- tailwind-merge and clsx for dynamic className composition

**Form & Validation**
- React Hook Form for performant form state management
- Zod for runtime type validation
- @hookform/resolvers for Zod integration with React Hook Form
- zod-validation-error for user-friendly error messages

**Development Tools**
- tsx for TypeScript execution in development
- esbuild for production server bundling
- Replit-specific plugins (@replit/vite-plugin-*) for development environment integration

**Third-Party Integrations**
- Google Fonts CDN for Inter font family
- Google Analytics for conversion tracking (via VITE_GA_MEASUREMENT_ID env var)
- Meta Pixel for Facebook/Instagram ads tracking (via VITE_META_PIXEL_ID env var)
- WhatsApp (mentioned in design but not directly integrated in codebase)
- Supabase integration configured for future use

### File Structure

```
/client          # Frontend React application
  /src
    /components  # Reusable UI components
      /sections  # Landing page sections (Hero, Pricing, FAQ, etc.)
      /ui        # shadcn/ui component library
    /pages       # Route components (landing, obrigado, not-found)
    /hooks       # Custom React hooks
    /lib         # Utilities (queryClient, utils)
/server          # Express backend
  /routes.ts     # API route definitions
  /vite.ts       # Vite dev server integration
/db              # Database layer
  /schema.ts     # Drizzle schema definitions
  /index.ts      # Database client
/shared          # Shared types and schemas
  /schema.ts     # Zod schemas for validation
/migrations      # Database migration files
```

### Key Architectural Decisions

**Monorepo Structure**
- Single repository with client/server/shared code
- Path aliases (@/, @shared/) for clean imports
- Shared TypeScript configuration with strict mode enabled

**Type Safety**
- End-to-end type safety from database to UI using Drizzle + Zod
- drizzle-zod for automatic schema-to-Zod conversion
- Shared validation schemas prevent client/server drift

**Development Experience**
- Hot module replacement (HMR) in development via Vite
- Custom error overlays for runtime errors (@replit/vite-plugin-runtime-error-modal)
- Automatic server restart on file changes using tsx

**Production Build**
- Vite builds client to `dist/public`
- esbuild bundles server to `dist/index.js`
- ESM module format throughout the stack
- Static file serving for production deployment

**Conversion Optimization**
- Multiple CTA placements throughout landing page
- Form-first design with lead capture as primary goal
- Social proof elements (approval badges, testimonials)
- Mobile-responsive with WhatsApp-centric UX patterns

## Recent Changes (October 2025)

### Brand Update
- **Primary Color**: Updated from #10B981 to #18cb96 across entire application
- All color tokens, buttons, focus states, and interactive elements now use new green
- Maintained consistency with hover/active states using darker shade #14b584

### Navigation & Header
- **Fixed Header**: Created responsive header component with:
  - Logo and brand name aligned left
  - Desktop navigation menu (Como Funciona, Depoimentos, Planos, FAQ) with smooth scroll
  - CTA buttons (Entrar, Cadastrar) aligned right
  - Mobile hamburger menu with dropdown navigation drawer
  - Sticky positioning with backdrop blur

### Form Improvements
- **Enhanced Contrast**: Updated all form inputs with dark text on light backgrounds
- Fixed placeholder colors from gray-400 to gray-500 for better readability
- Added green accent color (#18cb96) to focus rings and submit button
- Custom dropdown styling with visible dark text for better UX

### Legal Infrastructure
- **4 Legal Pages Created**:
  - `/termos` - Termos de Uso
  - `/privacidade` - Política de Privacidade (LGPD compliant)
  - `/cookies` - Política de Cookies
  - `/reembolso` - Política de Reembolso (7-day guarantee)
- Dynamic year calculation for copyright and last updated dates
- Updated Footer with working links to legal pages
- Added legal disclaimers to LeadForm component

### Analytics Integration
- **Google Analytics**: Integrated with VITE_GA_MEASUREMENT_ID environment variable
- **Meta Pixel**: Facebook/Instagram conversion tracking via VITE_META_PIXEL_ID
- Automatic page view tracking on route changes
- Form submission tracking with exam_type and state data
- Helper functions: trackGoogleEvent, trackMetaEvent, trackButtonClick, trackConversion
- Analytics component loads scripts and initializes tracking

### Content Updates
- Updated all dates from 2024 to 2025
- Hero section: "154 aprovações em 2025"
- Testimonials: Updated approval dates to 2025
- Footer: Dynamic year using new Date().getFullYear()

### Testing
- **E2E Tests Passed**: Comprehensive test coverage including:
  - Form submission and database persistence
  - Header navigation (desktop & mobile)
  - Legal page routing
  - Mobile responsive menu
  - Lead capture flow from form to /obrigado redirect

### SEO & Performance Optimization (January 2025)
- **Comprehensive Meta Tags**: Added full SEO suite in index.html
  - Open Graph tags for social media sharing (og:title, og:description, og:image, og:locale)
  - Twitter Card metadata for Twitter/X sharing
  - Keywords meta tag for search engines
  - Robots and Googlebot directives
  - Geo-location tags for Brazil/Vitória targeting
- **Structured Data**: JSON-LD schema for EducationalOrganization with:
  - Company information and logo
  - Social media profiles (5 platforms)
  - Contact details (email, phone, address)
  - Portuguese language specification
- **Sitemap & Robots**: Created sitemap.xml and robots.txt in /client/public/
  - Sitemap includes all pages with priorities and update frequencies
  - Robots.txt allows all crawlers and references sitemap
- **Image Optimization**: Added lazy loading to logo and footer images
- **Accessibility Improvements**: Enhanced ARIA attributes in Header
  - Mobile menu toggle has descriptive aria-label (changes based on state)
  - Added aria-expanded attribute to hamburger button
  - CTA button has aria-label for screen readers

### UX & Contact Updates (January 2025)
- **FAQ CTA Spacing**: Increased top margin on "Dúvidas?" button (mt-16) for better visual hierarchy
- **Social Media Expansion**: Footer now includes 5 platforms:
  - Instagram, Facebook, TikTok, YouTube, LinkedIn
  - All with correct aria-labels and external links
- **Contact Email Update**: Changed from contato@ to suporte@passarei.com.br
  - Updated across all pages: Footer, FAQ, legal pages, success page

## Environment Variables

Required for production:
- `DATABASE_URL` - PostgreSQL connection string (Neon)
- `SESSION_SECRET` - Express session secret
- `VITE_GA_MEASUREMENT_ID` - Google Analytics tracking ID (optional)
- `VITE_META_PIXEL_ID` - Meta Pixel tracking ID (optional)