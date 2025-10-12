# Design Guidelines - Passarei Landing Page

## Design Approach
**Reference-Based Approach**: Drawing inspiration from high-converting SaaS and EdTech landing pages (Duolingo freemium model, WhatsApp-centric UX). The design prioritizes conversion optimization with clear CTAs, trust signals, and a structured narrative that guides visitors from problem awareness to action.

## Core Design Principles
1. **Conversion-First**: Every section drives toward lead capture with strategic CTA placement
2. **Trust & Credibility**: Heavy use of social proof, numbers, and testimonials
3. **Mobile-Centric**: WhatsApp-based product requires mobile-first thinking
4. **Clarity Over Cleverness**: Direct copy, no jargon, immediate value communication
5. **Visual Hierarchy**: Guide the eye from headline → benefit → CTA

## Color Palette

### Primary Colors
- **Brand Green**: 162 84% 51% - Primary CTAs, success states, brand identity
- **Trust Blue**: 221 83% 40% - Secondary elements, trust indicators
- **Dark Text**: 217 19% 18% - All body text and headings

### Supporting Colors
- **Light Green BG**: 156 73% 91% - Section backgrounds, highlights
- **Light Blue BG**: 214 95% 93% - Alternate section backgrounds
- **White**: Full white for cards and primary sections
- **Success Green**: 142 71% 45% - Form success, checkmarks
- **Error Red**: 0 84% 60% - Form validation errors

## Typography
- **Font Family**: Inter (via Google Fonts CDN)
- **H1 Hero**: text-5xl md:text-6xl font-bold leading-tight
- **H2 Sections**: text-4xl font-bold mb-4
- **H3 Cards**: text-2xl font-semibold
- **Body**: text-base md:text-lg leading-relaxed
- **CTA Buttons**: text-lg font-semibold

## Layout System
**Spacing Primitives**: Use Tailwind units of 2, 4, 8, 12, 16, 20, 24, 32
- Section padding: py-16 md:py-24 lg:py-32
- Container: max-w-7xl mx-auto px-4 md:px-6
- Card spacing: p-6 md:p-8
- Element gaps: gap-8 md:gap-12

## Component Library

### Navigation
- Sticky header with logo (PASSAREI ↗️), menu links, CTA button
- Mobile: Hamburger menu, full-screen overlay
- Desktop: Horizontal menu with smooth scroll to sections

### Hero Section
- **Layout**: Two-column (60/40 split on desktop), stacked on mobile
- **Left**: Headline, subheadline, dual CTAs (primary green button, secondary text link)
- **Right**: WhatsApp mockup showing conversation interface
- **Bottom**: Trust badges (star rating, user count, approvals)
- **Background**: Subtle gradient from white to light-green-50

### Form Component (Critical)
- Fields: Name, Email, WhatsApp (masked input), Exam Type (select), State (select), Checkbox
- Validation: Real-time with Zod, visual error states
- Submit button: Large green gradient with loading state
- Success: Redirect to /obrigado page
- Style: White card with shadow-xl, rounded-2xl

### Cards (Features, Benefits, Testimonials)
- White background with border border-gray-100
- Shadow: shadow-md hover:shadow-xl transition
- Rounded: rounded-2xl
- Padding: p-8
- Icon/emoji at top, title, description
- Hover: Subtle scale (hover:scale-105)

### Pricing Cards
- Three cards: Free (outline), Calouro (primary - gradient border), Veterano (gold accent)
- Most popular badge on Calouro plan
- Price: Large bold numbers, period text smaller
- Feature list: Checkmarks (green) and X marks (gray)
- CTA button per card matching plan tier

### Comparison Table
- Sticky header row
- Three columns: PASSAREI (green checkmarks), CURSINHOS (red X), LIVROS/PDFs (mixed)
- Legend: ✅ Tem completo | ⚠️ Tem limitado | ❌ Não tem
- Mobile: Horizontal scroll or accordion

### FAQ Accordion
- 8 questions, expand/collapse animation
- Chevron icon rotation on expand
- Border between items
- Active state: Light green background

### CTA Buttons
**Primary (Green Gradient)**:
```
bg-gradient-to-r from-green-500 to-green-600
text-white px-8 py-4 rounded-lg
font-semibold text-lg shadow-lg
hover:shadow-xl hover:scale-105 transition-all
```

**Secondary (Outline)**:
```
border-2 border-blue-600 text-blue-600
px-8 py-4 rounded-lg font-semibold
hover:bg-blue-50 transition-all
```

### Footer
- Four-column grid (desktop), stacked (mobile)
- Sections: Product links, Legal, Social media, Newsletter signup
- Dark background (bg-gray-900), white text
- Social icons with hover effects

## Animations
**Framer Motion Guidelines**:
- Fade in sections on scroll: `initial={{ opacity: 0, y: 20 }}` → `whileInView={{ opacity: 1, y: 0 }}`
- Viewport trigger: `viewport={{ once: true }}`
- Transition duration: 0.5-0.8s
- Button hover: scale-105
- Card hover: shadow and subtle lift
- **Use sparingly** - only for section reveals and micro-interactions

## Images
### Hero Section WhatsApp Mockup
- **Description**: iPhone mockup showing WhatsApp chat interface with "PASSAREI" contact name at top. Conversation shows: "📚 Bom dia! Vamos estudar?", followed by short educational text about legal principles, interactive buttons ("👍 Sim | ❓ Dúvida"), and a multiple-choice question with user response and feedback.
- **Placement**: Right side of hero (40% width desktop), below headline on mobile
- **Style**: Realistic device frame with slight shadow, angled 15° for depth

### Section Icons/Emojis
- Use Lucide React icons or Unicode emojis (📱 🤖 🔄 🎯 📊 ⚡) instead of images
- Large size (w-12 h-12 or text-4xl for emojis)
- Color: Brand green or blue

### Testimonials
- Small circular avatars (w-16 h-16) - use placeholder initials in colored circles
- No photos needed - focus on quote and credentials

## Responsive Behavior
- **Mobile (< 768px)**: Single column, stacked sections, full-width CTAs, larger touch targets
- **Tablet (768-1024px)**: Two-column grids where appropriate
- **Desktop (> 1024px)**: Multi-column layouts, side-by-side content

## Accessibility
- All forms: Clear labels, error messages, ARIA attributes
- Color contrast: Minimum 4.5:1 for text
- Focus states: Visible outline on all interactive elements
- Semantic HTML: Proper heading hierarchy

## Performance Targets
- Lighthouse Score: 90+ all metrics
- Use next/image for all imagery
- Lazy load below-fold sections
- Minimize animation JavaScript
- Code splitting: Dynamic imports for heavy components