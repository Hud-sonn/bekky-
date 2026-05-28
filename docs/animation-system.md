# Animation System

## Overview

All animations use **GSAP** (GreenSock Animation Platform) with the **ScrollTrigger** plugin for scroll-driven animations. Smooth scrolling is powered by **Lenis**.

**GSAP version:** 3.x (registered in `src/App.tsx:15`)
**Plugins:** `ScrollTrigger` only
**Smooth scroll:** `lenis` with `lerp: 0.1`

---

## Animation Inventory

### 1. `Intro.tsx` — Katana Video & Transition

| Ref name | Element | Type | Trigger | What it does |
|---|---|---|---|---|
| `containerRef` | Fullscreen overlay | Timeline | Video reaches 4.2s | **Light flash**: bg from `#000` → `#e0e8f0` (0.2s, `power2.out`) |
| `slashRef` | Diagonal wipe overlay | Timeline | (chained) | **Slash**: clip-path from collapsed center `polygon(50% 50%, …)` → full frame `polygon(-10% -10%, …)` (0.5s, `power2.inOut`) |
| `slashRef` | (same element) | Timeline | (chained) | **Glow**: boxShadow `0 0 60px 30px rgba(0,180,216,0.4)` (0.3s, `power2.out`) |
| `containerRef` | Entire intro | Timeline | (chained) | **Fade out**: `opacity: 0` (0.5s, `power2.inOut`), calls `onComplete` |

**Flow:** Video plays → at 4.2s pause → flash 0.2s → slash 0.5s → glow 0.3s → fade 0.5s → `onComplete`.

---

### 2. `Hero.tsx` — Parallax & Entrance

| Ref name | Element | Type | Trigger | What it does |
|---|---|---|---|---|
| `badgeRef` | "Available" badge | Timeline (delay 0.15s) | On mount | `opacity: 0→1, y: 30→0, scale: 0.9→1` (1s, `power3.out`) |
| `subtitleRef` | Tagline paragraph | Timeline (`-=0.5`) | (chained) | `opacity: 0→1, y: 40→0` (1s, `power3.out`) |
| `ctaRef` | Button group | Timeline (`-=0.5`) | (chained) | `opacity: 0→1, y: 30→0` (1s, `power3.out`) |
| `bgRef` | Background image | ScrollTrigger | `#hero`: top→bottom scrub | **Parallax**: `yPercent: 0→20` (scrub) |
| `contentRef` | Text overlay | ScrollTrigger | `#hero`: top→60% scrub | **Fade out**: `opacity: 1→0, yPercent: 0→-15` (scrub) |

---

### 3. `About.tsx` — Diagonal Reveal + Content

| Ref name / selector | Element | Type | Trigger | What it does |
|---|---|---|---|---|
| `sectionRef` | Section itself | ScrollTrigger | top 85% → 30% (play/reverse) | **Diagonal clip**: `polygon(0 0, 0 0, 0 100%, 0 100%)` → `polygon(0 0, 100% 0, 100% 100%, 0 100%)` (1.2s, `power3.out`) |
| `imageRef` | BG image div | ScrollTrigger | section: bottom→top scrub | **Parallax**: `yPercent: 0→-15` (scrub) |
| `titleRef` | "About Me" h2 | ScrollTrigger | section top 60% (play/reverse) | `opacity: 0→1, x: 60→0` (1s, `power3.out`) |
| `textRef` | Text wrapper | ScrollTrigger | section top 60% (play/reverse) | `opacity: 0→1, x: 40→0` (1s, `power3.out`, delay 0.2) |
| `.about-logo` | Avatar video div | ScrollTrigger | section top 60% (play/reverse) | `opacity: 0→1, scale: 0.8→1, rotateY: -30→0` (1.2s, `power3.out`) |

---

### 4. `Projects.tsx` — Scale Reveal + Card Animations

| Ref name / selector | Element | Type | Trigger | What it does |
|---|---|---|---|---|
| `sectionRef` | Section itself | ScrollTrigger (scrub: 1) | top 85% → 30% scrub | **Scale/fade**: `opacity: 0.85→1, scale: 0.97→1` (1.2s, `power3.out`) |
| `titleRef` | "Projects" h2 | ScrollTrigger | section top 70% (play/reverse) | `opacity: 0→1, y: 50→0` (1s, `power3.out`) |
| `.project-card` | Each card | ScrollTrigger (staggered) | card top 85% (play/reverse) | `opacity: 0→1, y: 80→0, scale: 0.95→1` (0.8s, `power3.out`, delay `i * 0.1`) |
| `.project-card-left` | Left column cards | ScrollTrigger scrub | section: bottom→top | **Parallax**: `yPercent: 0→-8` (scrub) |
| `.project-card-right` | Right column cards | ScrollTrigger scrub | section: bottom→top | **Parallax**: `yPercent: 0→-15` (scrub) |

**Card hover (CSS/React state):** `scale(1)→scale(1.02)` with `cubic-bezier(0.16,1,0.3,1)` and `brightness` dimming for non-hovered cards. Image zooms to `scale(1.05)`. "View Project" fades/slides up.

---

### 5. `Services.tsx` — RotateX + Item Highlighting

| Ref name / selector | Element | Type | Trigger | What it does |
|---|---|---|---|---|
| `containerRef` | Content wrapper | ScrollTrigger scrub | section: 25%→75% | **RotateX**: `rotateX: 45°→0°` (scrub, `ease: none`) |
| `titleRef` | "Services" h2 | ScrollTrigger scrub | section: bottom→top | **Vertical drift**: `yPercent: -50→50` (scrub) |
| Each `.service-item` | Service row | ScrollTrigger | item top 80% (play/reverse) | `opacity: 0→1, x: -60→0` (0.8s, `power3.out`, delay `index * 0.15`) |
| `.service-text`, `.service-num`, `.service-desc` | Inside each item | `ScrollTrigger.create()` with enter/leave callbacks | item 60%→40% | **Color shift**: text `#0077B6→#03045E`, num `scale: 1→1.1`, desc `opacity: 0.5→1, y: 0` (0.4s) |

---

### 6. `Contact.tsx` — Radial Reveal + Form Fields

| Ref name / selector | Element | Type | Trigger | What it does |
|---|---|---|---|---|
| `sectionRef` | Section itself | ScrollTrigger (scrub: 1) | top 85% → 30% scrub | **Radial clip**: `circle(0% at 50% 50%)` → `circle(100% at 50% 50%)` (1.4s, `power3.out`) |
| `contentRef` | Content wrapper | ScrollTrigger | section top 60% (play/reverse) | `opacity: 0→1, y: 60→0` (1s, `power3.out`) |
| `.form-field` | Form inputs | ScrollTrigger (stagger: 0.1) | form top 70% (play/reverse) | `opacity: 0→1, x: -30→0` (0.6s, `power3.out`) |
| `.quick-contact-card` | Contact cards | ScrollTrigger (stagger: 0.15) | section top 60% (play/reverse) | `opacity: 0→1, y: 30→0` (0.6s, `power3.out`) |

---

### 7. `Navigation.tsx` — Slide-in

| Ref name | Element | Type | Trigger | What it does |
|---|---|---|---|---|
| `navRef` | Nav bar | `useEffect` (no ScrollTrigger) | On mount | `y: -100→0, opacity: 0→1` (1s, `power3.out`, delay 0.3) |

**Section detection (no GSAP):** A scroll listener checks if the user is on Services or Projects (light sections) and switches nav text/glassy background colors.

---

### 8. `CustomCursor.tsx` — GSAP-Powered Cursor

| Ref name | Element | Type | Trigger | What it does |
|---|---|---|---|---|
| `cursorRef` | Outer ring (40px) | `mousemove` event | Every mouse move | **Tracks cursor** with `x, y` (0.08s lag, `power2.out`) |
| `cursorDotRef` | Inner dot (6px) | `mousemove` event | Every mouse move | **Tracks cursor** with `x, y` (0.02s lag, no ease) |
| Both | Both | `mouseenter`/`mouseleave` | Window focus | `opacity: 0→1 / 1→0` (0.3s) |
| `cursorRef` | Outer ring | Hover on `a, button, [data-cursor-expand]` | Hover start | **Expands**: `40px→60px`, bg `transparent→rgba(0,180,216,0.15)`, border lighter (0.3s, `power2.out`) |

---

### 9. `App.tsx` — ScrollTrigger Refresh

| What | Why |
|---|---|
| `gsap.registerPlugin(ScrollTrigger)` | Global plugin registration |
| `lenis.on('scroll', ScrollTrigger.update)` | Syncs Lenis scroll with ScrollTrigger |
| `ScrollTrigger.refresh()` (delayed 500ms) | Forces recalculation after content mount |

---

## Easing Reference

| Name | Used in |
|---|---|
| `power3.out` | Most entrance animations, clip reveals, card shows |
| `power2.out` | Cursor tracking, hover expand, light flash |
| `power2.inOut` | Slash wipe, fade out |
| `none` | Parallax, scroll-driven (`scrub: true`) |
| `cubic-bezier(0.16, 1, 0.3, 1)` | CSS — card hover scale |

## Section Transition Summary

| From → To | Animation | Duration |
|---|---|---|
| Intro → Hero | Fade out (0.5s) + video slash | ~1s total |
| Hero → About | **Diagonal clip-path** (left edge → full rect) | 1.2s |
| About → Projects | **Scale/fade** (0.97→1, 0.85→1) | 1.2s |
| Projects → Services | **CSS rounded-t-3xl** (curve overlap) | Instant |
| Services → Contact | **Radial clip-path** (center circle expansion) | 1.4s |

## Key Implementation Details

- All sections use `gsap.context()` with a ref scope and `ctx.revert()` on cleanup.
- `toggleActions: 'play none none reverse'` allows reverse animation on scroll up.
- `scrub: true` (or `scrub: 1`) ties animation progress directly to scroll position.
- `will-change: transform` / `will-change: backdrop-filter` set on animated elements.
- `loading="lazy"` on Hero background and all project card images.
