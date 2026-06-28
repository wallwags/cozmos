# Cosmos 2.0 - Design Guidelines (Compacted)

## Design Foundation

**Approach:** Hybrid reference-based combining Calm/Headspace (wellness-focused) + Notion/Linear (clean hierarchy) with custom spiritual elements.

**Core Principles:** Emotional resonance through spacing, information clarity with mystical atmosphere, progressive disclosure, mobile-first design.

## Typography

### Hierarchy
- **H1 (Display):** Playfair Display, 2.5rem/3.5rem (mobile/desktop), weight: 700, letter-spacing: -0.02em
- **H2 (Section):** Playfair Display, 1.875rem/2.25rem, weight: 600
- **H3 (Subsection):** Playfair Display, 1.5rem/1.75rem, weight: 600
- **H4 (Card Titles):** Inter, 1.125rem, weight: 600, letter-spacing: -0.01em
- **Body:** Inter, 1rem/1.0625rem, weight: 400, line-height: 1.6
- **Small:** Inter, 0.875rem, weight: 400
- **Micro (labels/tags):** Inter, 0.75rem, weight: 500, letter-spacing: 0.02em

### Patterns
- Mystical quotes: Playfair italic
- Data points: Inter weight: 600
- Interactive labels: Inter weight: 500, increased letter-spacing

## Layout & Spacing

### Spacing Scale (Tailwind)
Use: 2, 3, 4, 6, 8, 12, 16, 20, 24
- **Micro:** p-2, gap-2 (8px) - tight groupings
- **Standard:** p-4, gap-4 (16px) - cards, forms
- **Section:** py-8, gap-6 (32px/24px) - major elements
- **Page:** py-12/py-20 (mobile/desktop)
- **Hero:** py-16/py-24

### Grid Systems
- **Mobile:** Single column, max-w-md centered
- **Tablet (md):** grid-cols-2, gap-6
- **Desktop (lg):** 3-col features, 2-col content+sidebar
- **Dashboard:** Masonry auto-fit minmax

### Containers
- Full-width: w-full, max-w-7xl, mx-auto, px-4
- Content: max-w-4xl (reading comfort)
- Forms: max-w-md (onboarding, signup)

## Components

### Navigation
**Top Nav:**
- Fixed with backdrop blur, h-16/h-20 (mobile/desktop)
- Layout: Logo left, nav center, user/CTA right
- Mobile: Hamburger → slide-in drawer

**Sidebar (Dashboard):**
- Desktop: Vertical icon menu, labels on hover
- Mobile: Bottom tab bar (4-5 tabs)
- Active: filled icon + highlight
- Icons: Lucide React (sun, moon, star, scroll, sparkles)

### Cards
**Standard:**
- rounded-xl, p-6, subtle shadow + border
- Hover: translateY(-2px) + shadow increase
- Structure: Icon/image → title → description → CTA

**Flip Card:**
- Front: Achievement icon + title
- Back: Description + progress
- Animation: framer-motion rotateY

**Energy Card:**
- Split: icon left, content right
- Subtle gradient background
- Pulsing glow on load

### Forms
**Input Fields:**
- rounded-lg, px-4 py-3
- Label: text-sm font-medium, mb-2
- Focus: ring-2
- Error: Small text below with icon

**Date/Time:** Custom styled with calendar icon, dropdown overlays (native pickers on mobile)

**Location:** Google Maps autocomplete, map pin icon, auto-zoom on selection

### Buttons
**Primary CTA:**
- rounded-full, px-8 py-4, Inter weight: 600
- Hover: scale-105 + brightness shift

**Secondary:**
- rounded-lg, border style, px-6 py-3

**Icon:**
- w-10 h-10 (mobile) / w-12 h-12 (desktop), p-2

### Modals
- Centered, max-w-lg/max-w-2xl, p-6/p-8
- Backdrop blur, close button top-right
- Animation: fade + scale-up (framer-motion)

**Toasts:**
- Bottom-right (desktop) / top-center (mobile)
- Auto-dismiss 4s, slide-in animation

### Charts
**Wheel (Astrological):**
- SVG/Recharts, interactive hover
- Structure: Central sun sign, outer houses (1-12), planet symbols by degree
- Responsive scaling

**Progress:**
- Circular: stroke-dasharray animation
- Linear bars: daily completion
- Constellation: SVG stars lighting up on milestones

### Gamification
**Badges:**
- grid-cols-3/grid-cols-4, gap-4/gap-6
- Locked: grayscale + opacity
- Unlocked: full vibrancy + glow

**Progress Constellation:**
- SVG with connected stars
- Active: pulsing animation
- Background: subtle nebula gradient

### Dream Journal
**Chat Layout:**
- User right, AI left
- AI avatar: mystical icon
- Input bottom with send + voice (microphone with recording animation)

**Dream Entry:**
- Date/time stamp, dream text, AI analysis (expandable accordion)
- Tags: small pills, favorite icon

## Page Layouts

### Landing
**Hero:**
- min-h-screen, max-w-4xl centered
- H1 headline + H3 subheadline + dual CTAs
- Background: Animated gradient/particles (subtle) + cosmic image (1920x1080 full-width with text overlay)

**Features:** 3-col (desktop) / 1-col (mobile), icon + title + description cards (min-h-64)

**How It Works:** Vertical timeline (mobile) / horizontal (desktop), numbered circles, connecting lines

**Social Proof:** 2-col testimonial cards, avatar + name + quote + ratings

**Final CTA:** Full-width, centered content, gradient/pattern background

### Onboarding
**Progress:** Top bar/dots, current step highlighted

**Steps:** Welcome → Birth Info → Preview → Complete

**Forms:** max-w-md single-column, large inputs, fixed bottom (mobile) / inline (desktop) buttons

**Preview:** Simplified wheel chart, animated reveal (scale + fade)

### Dashboard "Meu Dia"
**Layout (Desktop):** 2-col: Main (66%) + Sidebar (33%)

**Mobile:** Stacked single column

**Main:** Today's Energy (full-width p-8) + Advice grid (2-col tablet, 1-col mobile) + Share icons

**Sidebar:** Sun/Moon mini-cards, upcoming transits, quick actions

### Tabs (Sol & Lua, Mapa)
**Navigation:** Horizontal scroll (mobile), fixed (desktop), active underline slides

**Sol & Lua:** Split hero (desktop) / stacked (mobile), large planet icons, sign + degree, meaning cards

**Mapa Astral:** Wheel 60% (desktop) / full-width (mobile), sidebar planet list (desktop) / accordion (mobile), click to highlight

## Images

**Locations & Sizes:**
1. Landing hero: Abstract cosmic (1920x1080 background)
2. Onboarding welcome: Constellation illustration (800x600 centered)
3. Empty states: Gentle illustrations (400x300)
4. Achievement badges: Custom icons (128x128)
5. Profile avatars: Circular (128x128)

**Treatment:** Gradient overlays for text readability, subtle blur/opacity on backgrounds, rounded corners

## Interactions

**Principles:** Celestial smoothness, 200-300ms micro / 500-800ms transitions, ease-out/ease-in-out

**Key Animations:**
- Card hover: translateY(-4px) + shadow
- Button click: scale(0.98)
- Modal: fadeIn + scale(0.95→1)
- Page transition: fade + slight slide
- Achievement unlock: scale pulse + confetti (sparingly)
- Loading: gentle pulse/rotate

**Avoid:** Aggressive parallax, continuous auto-play, distracting backgrounds

## Accessibility

- Min touch target: 44x44px
- Visible labels (not placeholder-only)
- Sufficient contrast ratios
- Keyboard navigation: clear focus rings
- Semantic HTML + ARIA labels
- Respect prefers-reduced-motion

## Breakpoints
- **Mobile:** <768px (base)
- **Tablet:** 768-1024px (md:)
- **Desktop:** >1024px (lg:)
- **Wide:** >1280px (xl:)

## Icons
**Library:** Lucide React
**Common:** sun, moon, star, sparkles, scroll, compass, plus, check, x, chevron-down/right, share-2, heart, bookmark
**Astrology:** Custom zodiac SVG sprites