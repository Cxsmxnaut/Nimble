# Design System Specification: Kinetic Intelligence

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The High-Velocity Sanctuary."** 

Most study platforms feel like digital filing cabinets—static, rigid, and dry. This system rejects the "template" look in favor of a bespoke editorial experience. We combine the playful, tactile friendliness of a high-end mobile app with the sophisticated depth of a premium dark-mode dashboard. By utilizing intentional asymmetry, oversized typography, and deep tonal layering, we create an environment that feels both intellectually authoritative and physically responsive.

The design breaks the traditional grid by treating the UI as a living stack of physical objects. We use extreme corner radii and high-contrast color pops to guide the eye through "The Learning Flow," ensuring the interface never feels cluttered, even when the data is complex.

---

## 2. Colors & Surface Philosophy
We utilize a sophisticated Material 3-inspired palette that leans heavily into deep navy and electric indigo to maintain a "Focused-Flow" state.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section content. Boundaries must be defined solely through background color shifts. For example, a `surface_container_low` card sits on a `surface` background to define its edges. Lines create visual noise; tonal shifts create elegance.

### Surface Hierarchy & Nesting
Treat the UI as a series of nested physical layers. 
- **Base Layer:** `surface` (#0b1326) — The canvas.
- **Section Layer:** `surface_container_low` (#131b2e) — For broad content areas.
- **Object Layer:** `surface_container` (#171f33) — For primary interactive cards.
- **Elevated Layer:** `surface_container_high` (#222a3d) — For modals or active focus states.

### The "Glass & Gradient" Rule
To move beyond "flat" dark mode, use Glassmorphism for floating elements (like navigation bars or hovering study tips). Use `surface_bright` at 60% opacity with a `24px` backdrop-blur. 
**Signature Textures:** Apply a subtle linear gradient from `primary` (#c0c1ff) to `primary_container` (#8083ff) at a 135° angle for primary CTAs to provide a "lit-from-within" glow.

---

## 3. Typography: Editorial Authority
We utilize a dual-typeface system to balance personality with high-utility readability.

*   **Display & Headlines:** *Plus Jakarta Sans*. This font provides a modern, geometric flair with a slightly wider stance, making headings feel like bold editorial statements.
*   **Body & Labels:** *Inter*. The gold standard for UI legibility. It handles dense study material without fatigue.

**Hierarchy Strategy:**
- **Display-LG (3.5rem):** Used for "Big Wins" or lesson milestones.
- **Headline-MD (1.75rem):** Used for card titles. High contrast against the background is mandatory.
- **Body-LG (1rem):** The default for all study content. We prioritize generous line-height (1.6) to prevent eye strain during long sessions.

---

## 4. Elevation & Depth
Depth is achieved through **Tonal Layering**, not structural lines.

*   **The Layering Principle:** Stacking tiers (e.g., placing `surface_container_lowest` inside `surface_container_low`) creates a soft, natural lift.
*   **Ambient Shadows:** Floating cards must use a "Deep Bloom" shadow.
    *   *Shadow:* `0px 24px 48px -12px rgba(6, 14, 32, 0.5)`
    *   The shadow should never be pure black; it must be a tinted version of the background to mimic natural light dispersion.
*   **The "Ghost Border" Fallback:** If a container lacks contrast (e.g., over a complex image), use a **Ghost Border**: `outline_variant` (#464554) at 15% opacity. Never 100%.

---

## 5. Components

### Large Tactile Buttons
Buttons are the primary engine of this system. They should feel like physical objects you want to press.
*   **Primary:** `primary` background with `on_primary` text. `24px` (1.5rem) corner radius. Use a subtle bottom-heavy inset shadow to create a "3D pressed" feel.
*   **Secondary/Success:** `secondary` (#4edea3). Used exclusively for "Correct" states and "Finish" actions.

### Study Cards
*   **Radius:** Always `md` (1.5rem / 24px).
*   **Spacing:** No internal dividers. Use `1.5rem` of vertical whitespace to separate questions from answers.
*   **Interaction:** On hover, cards should scale to `1.02` and shift from `surface_container` to `surface_container_high`.

### Progress Bars
*   **Container:** `surface_container_highest`.
*   **Indicator:** A gradient from `primary` to `secondary`.
*   **Shape:** Full pill-shape (`rounded-full`).

### Input Fields
*   **Default:** `surface_container_lowest` with no border.
*   **Focus State:** A 2px "Ghost Border" using `primary` at 40% opacity and a subtle outer glow of the `primary` color.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use extreme whitespace. If a card feels crowded, double the padding.
*   **Do** use `tertiary` (#ffb95f) for "Near Miss" feedback. It provides warmth without the "scary" feeling of a red error.
*   **Do** animate transitions using a `cubic-bezier(0.34, 1.56, 0.64, 1)` (Back Out) curve to give the UI a "springy," responsive personality.

### Don't:
*   **Don't** use 1px dividers. If you feel the need for a line, use a `8px` gap instead.
*   **Don't** use pure white (#FFFFFF) for text. Use `on_surface` (#dae2fd) to reduce glare in dark mode.
*   **Don't** use sharp corners. Everything in this system is designed to feel "soft-tactile." Even selection chips must have at least an `8px` (sm) radius.
*   **Don't** use standard "Drop Shadows." Use the Ambient Shadow specifications to maintain the sophisticated "Glass" aesthetic.
