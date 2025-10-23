# Passarei - Landing Page & Lead Capture System

## Overview
Passarei is a SaaS platform designed to assist police exam candidates with AI-powered, personalized learning delivered via WhatsApp. The platform features a high-conversion React-based landing page and a PostgreSQL-backed lead capture system. Its core purpose is to provide flexible, mobile-first study solutions using scientific spaced repetition, targeting busy professionals.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript, Vite for build and development, Wouter for routing.
- **Styling**: Tailwind CSS with a custom design system, shadcn/ui components built on Radix UI primitives. Mobile-first, WhatsApp-centric UX.
- **State Management**: TanStack Query for server state, React Hook Form with Zod for form validation.
- **Design System**: Custom color palette (Primary green #18cb96), 8px grid system, responsive breakpoints, consistent button styling.
- **UI/UX**: Focus on conversion optimization, multiple CTA placements, form-first design, social proof elements.

### Backend
- **Server Framework**: Express.js with TypeScript.
- **API Design**: RESTful endpoints for lead management (`POST /api/leads`, `GET /api/leads`), error handling middleware, request/response logging.
- **Validation**: Zod schemas shared between client and server for consistent validation (e.g., Brazilian phone format, email).
- **Admin System**: Comprehensive admin panel with JWT-based authentication, role-based access control, audit logging, and routes for lead management, user statistics, and content.

### Data Storage
- **Database**: PostgreSQL via Neon serverless driver.
- **ORM**: Drizzle ORM for type-safe queries.
- **Schema**: `leads` table with UUIDs, enum types for `exam_type` and `lead_status` (NOVO, CONTATADO, QUALIFICADO, CONVERTIDO), timestamp fields.
- **Data Access**: Centralized database client, shared schema definitions (`shared/schema.ts`).
- **Admin Database Schema**: Includes tables for `admins`, `adminSessions`, `auditLogs`, `users`, `subscriptions`, `dailyMetrics`, `notifications`, and `leads` with specific enums for roles and statuses.

### Key Architectural Decisions
- **Monorepo**: Single repository for client, server, and shared code with path aliases.
- **Type Safety**: End-to-end type safety using Drizzle, Zod, and shared schemas.
- **Development Experience**: HMR via Vite, custom error overlays, automatic server restarts.
- **Production Build**: Vite for client, esbuild for server, ESM module format.
- **Security**: LGPD compliance, httpOnly cookies, session management, account lockout, password hashing, RBAC.

## External Dependencies

### Database & Infrastructure
- **Neon**: PostgreSQL serverless database.
- **Drizzle Kit**: For schema migrations.

### UI Component Libraries
- **Radix UI**: Primitives for accessible components.
- **Lucide React**: Iconography.
- **shadcn/ui**: Component library built on Radix UI.

### Form & Validation
- **React Hook Form**: Form state management.
- **Zod**: Runtime type validation.
- **@hookform/resolvers**: Zod integration for React Hook Form.

### Development Tools
- **tsx**: TypeScript execution in development.
- **esbuild**: Production server bundling.

### Third-Party Integrations
- **Google Fonts CDN**: For Inter font family.
- **Google Analytics**: For conversion tracking.
- **Meta Pixel**: For Facebook/Instagram ads tracking.