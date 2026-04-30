---
phase: 6
slug: frontend-migration
status: draft
shadcn_initialized: false
preset: none
created: 2026-04-30
---

# Phase 6 — UI Design Contract

> Visual and interaction contract for frontend migration phase.

---

## Migration Notice

**Current → Target:**

- `@radix-ui/themes` → Removed (use Tailwind + Radix primitives)
- Tailwind CSS → Primary styling system
- Radix UI primitives → Behavior/accessibility only

---

## Design System

| Property           | Value                                 |
| ------------------ | ------------------------------------- |
| Styling            | Tailwind CSS (single source of truth) |
| Component behavior | Radix UI primitives (unstyled)        |
| Icon library       | Material Symbols (Google Fonts)       |
| Font               | Plus Jakarta Sans                     |

---

## Semantic Color Tokens

| Token          | Value   | Usage                       |
| -------------- | ------- | --------------------------- |
| bg-primary     | #191111 | Main background             |
| bg-secondary   | #261d1d | Cards, containers           |
| bg-tertiary    | #312828 | Elevated surfaces           |
| text-primary   | #f0dfde | Body text, headings         |
| text-secondary | #bccbb9 | Muted text, labels          |
| border-subtle  | #3d4a3d | Dividers, subtle borders    |
| accent         | #53e076 | Primary actions, highlights |
| accent-hover   | #1db954 | Button hover state          |
| accent-active  | #45a049 | Button active state         |
| danger         | #ef4444 | Errors, destructive actions |
| danger-hover   | #dc2626 | Danger hover state          |

**All components MUST use semantic tokens — no raw hex values.**

---

## Spacing Scale

| Token     | Value | Usage                    |
| --------- | ----- | ------------------------ |
| space-xs  | 4px   | Icon gaps, tight spacing |
| space-sm  | 8px   | Compact element spacing  |
| space-md  | 16px  | Default element spacing  |
| space-lg  | 24px  | Section padding          |
| space-xl  | 32px  | Layout gaps              |
| space-2xl | 48px  | Major section breaks     |
| space-3xl | 64px  | Page-level spacing       |

---

## Typography Scale

| Token     | Size | Weight | Line Height | Usage              |
| --------- | ---- | ------ | ----------- | ------------------ |
| text-xs   | 12px | 400    | 1.4         | Captions, metadata |
| text-sm   | 14px | 500    | 1.4         | Labels, buttons    |
| text-base | 16px | 400    | 1.5         | Body text          |
| text-lg   | 18px | 500    | 1.4         | Subheadings        |
| text-h3   | 20px | 700    | 1.2         | Section headings   |
| text-h2   | 24px | 700    | 1.2         | Page headings      |
| text-h1   | 32px | 800    | 1.1         | Hero text          |

Font family: "Plus Jakarta Sans", system-ui, -apple-system, sans-serif

---

## Layout Rules

| Property                     | Value                          |
| ---------------------------- | ------------------------------ |
| Max content width            | 1280px (max-w-7xl)             |
| Horizontal padding (mobile)  | 16px                           |
| Horizontal padding (tablet)  | 24px                           |
| Horizontal padding (desktop) | 32px                           |
| Grid gap (mobile)            | 16px                           |
| Grid gap (tablet)            | 20px                           |
| Grid gap (desktop)           | 24px                           |
| Container behavior           | Centered, full-width on mobile |

**Breakpoints:**

- Mobile: < 640px (1 column)
- Tablet: 640px - 1024px (2 columns)
- Desktop: > 1024px (3-4 columns)

---

## Interaction States

| State    | Behavior                 | Implementation                                      |
| -------- | ------------------------ | --------------------------------------------------- |
| hover    | Opacity/background shift | `hover:opacity-90` / `hover:bg-accent-hover`        |
| active   | Scale down + darker      | `active:scale-95` / `active:bg-accent-active`       |
| focus    | Ring outline             | `focus:outline-none focus:ring-2 focus:ring-accent` |
| disabled | Reduced opacity          | `disabled:opacity-50 disabled:cursor-not-allowed`   |
| loading  | Skeleton pulse           | `animate-pulse bg-tertiary`                         |

---

## Button System

### Primary Button

```
Background: bg-accent (#53e076)
Text: text-[#003914]
Hover: bg-accent-hover (#1db954)
Active: bg-accent-active (#45a049)
Padding: px-4 py-2
Radius: rounded-full
Font: text-sm font-bold
```

### Secondary Button

```
Background: bg-tertiary
Text: text-primary
Hover: bg-secondary
Border: border-subtle
Padding: px-4 py-2
Radius: rounded-full
```

### Ghost Button

```
Background: transparent
Text: text-secondary
Hover: text-primary
Padding: px-4 py-2
Radius: rounded-md
```

---

## Form System

### Input Field

```
Height: h-10 (40px)
Padding: px-3
Border: border border-subtle
Border focus: border-accent
Background: bg-secondary
Text: text-primary
Placeholder: text-secondary
Radius: rounded-md
```

### Textarea

```
Min height: h-24
Border: border border-subtle
Focus: ring-2 ring-accent
```

### Error State

```
Border: border-danger
Text: text-danger text-sm
```

---

## Component Contracts

### Header

```
Structure: sticky, backdrop-blur
Background: bg-primary/80
Height: py-3 (12px vertical)
Content: logo (left), nav links (right)
Z-index: z-50
```

### Media Card

```
Structure: vertical stack
Image: aspect-[2/3] object-cover
Content: title, author/director, year, rating
Hover: scale-105, shadow-lg
Grid: responsive columns
```

### Genre Filter

```
Type: horizontal scroll on mobile, grid on desktop
Item: pill-shaped button
Active: bg-accent text-primary
Inactive: bg-secondary text-secondary
```

### Rating Component

```
Type: 5-star interactive
Icon: Material Symbols star/star-outline
Filled: text-accent
Empty: text-secondary
Size: text-xl
```

### Recommendation Carousel

```
Type: horizontal scroll
Item width: w-48 (192px)
Gap: space-md
Arrow navigation: on desktop only
```

### Stats Charts

```
Type: bar/pie charts via library
Colors: accent palette
Labels: text-secondary
```

---

## Loading & Skeleton Patterns

### Skeleton Usage

```
Base: bg-tertiary with animate-pulse
Cards: rounded-md, full aspect ratio
Text: rounded, varying widths
Avoid: spinners for primary content
```

### Loading Behavior

```
Lists: show 3-4 skeleton cards
Carousels: skeleton items matching carousel count
Detail page: skeleton matching content layout
```

---

## Authentication Storage

**CURRENT (needs migration):**

- JWT stored in localStorage
- Sent in Authorization header

**TARGET (preferred):**

- httpOnly cookie for JWT storage
- Server-side token refresh

**Tradeoffs if httpOnly not possible:**

- XSS vulnerable
- localStorage acceptable for MVP only
- Must implement token expiration handling

---

## API Base URL Strategy

**Server Components:**

- Internal URL: http://backend:3000 (Docker service name)
- Fallback: NEXT_PUBLIC_API_URL env var

**Client Components:**

- NEXT_PUBLIC_API_URL (exposed to browser)
- Default: http://localhost:3000 (dev)

**Environment:**

```
# Development
NEXT_PUBLIC_API_URL=http://localhost:3000

# Production (Docker)
NEXT_PUBLIC_API_URL=http://backend:3000
```

---

## Motion Guidelines

| Pattern  | Duration | Easing      | Usage             |
| -------- | -------- | ----------- | ----------------- |
| Micro    | 150ms    | ease-out    | Buttons, toggles  |
| Standard | 200ms    | ease-in-out | Cards, modals     |
| Page     | 300ms    | ease-out    | Route transitions |

**Rules:**

- Prefer transform over position changes
- Avoid motion for state changes (loading, error)
- Respect `prefers-reduced-motion`

---

## Accessibility Requirements

| Requirement      | Implementation                                 |
| ---------------- | ---------------------------------------------- |
| Contrast (text)  | text-primary on bg-primary (minimum 4.5:1)     |
| Focus visibility | Visible ring on all interactive elements       |
| Focus order      | Logical tab order, skip links for main content |
| Icon buttons     | aria-label required                            |
| Form labels      | Always visible, htmlFor association            |
| Error messages   | aria-live for dynamic content                  |

---

## Registry Safety

| Registry           | Usage                    | Safety Gate                |
| ------------------ | ------------------------ | -------------------------- |
| Tailwind CSS       | All styling              | Not required               |
| @radix-ui/react-\* | Behavior primitives only | Required for new additions |
| Material Symbols   | Icons                    | Not required               |

---

## Migration Requirements

| ID    | Requirement                                 | Status  |
| ----- | ------------------------------------------- | ------- |
| UI-01 | Remove @radix-ui/themes dependency          | Pending |
| UI-02 | Implement semantic color tokens in Tailwind | Pending |
| UI-03 | Add interaction state system                | Pending |
| UI-04 | Expand typography scale                     | Pending |
| UI-05 | Define layout rules                         | Pending |
| UI-06 | Create component contracts                  | Pending |
| UI-07 | Migrate authentication to httpOnly cookies  | Pending |
| UI-08 | Fix API base URL for production             | Pending |
| UI-09 | Add accessibility requirements              | Pending |

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PENDING
- [ ] Dimension 2 Visuals: PENDING
- [ ] Dimension 3 Color: PENDING
- [ ] Dimension 4 Typography: PENDING
- [ ] Dimension 5 Spacing: PENDING
- [ ] Dimension 6 Registry Safety: PENDING

**Approval:** pending
