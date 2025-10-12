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
- Conversion-first design with primary brand green (162 84% 51%) and trust blue (221 83% 40%)
- Spacing based on Tailwind's 8px grid system
- Responsive breakpoints following mobile-first approach

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
- WhatsApp (mentioned in design but not directly integrated in codebase)
- Future: Supabase mentioned in setup docs but not currently implemented

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