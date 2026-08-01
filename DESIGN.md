---
name: ViuPace
description: A YouTube performance diagnosis tool that reads like an air-safety investigation docket.
colors:
  paper: "#ffffff"
  panel: "#f4f5f7"
  field: "#fafbfc"
  plate: "#14181c"
  plate-grid: "#232a31"
  plate-ink: "#f7f8f9"
  plate-ink-muted: "#b3bcc4"
  ink: "#14181c"
  ink-secondary: "#566069"
  ink-muted: "#6b757e"
  rule: "#e2e5e9"
  rule-strong: "#cdd2d8"
  signal: "#a5228c"
  signal-field: "#fbf2f8"
  drop: "#c0362c"
  rewatch: "#0f7a45"
  caution: "#9a6400"
typography:
  headline:
    fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  title:
    fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.01em"
  body:
    fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  readout:
    fontFamily: "var(--font-geist-mono), ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.02em"
  stamp:
    fontFamily: "var(--font-geist-mono), ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.08em"
rounded:
  sm: "6px"
  md: "10px"
  lg: "12px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "0 10px"
    height: "32px"
  button-primary-hover:
    backgroundColor: "#2b3238"
    textColor: "{colors.paper}"
  finding-plate:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.plate-ink}"
    rounded: "{rounded.lg}"
    padding: "16px"
  recommendation-field:
    backgroundColor: "{colors.signal-field}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "16px"
---

# Design System: ViuPace

## Overview

**Creative North Star: "The Investigation Docket"**

ViuPace is an accident investigation for a video that failed. The visual world is
the air-safety docket: a flight-data recorder trace read on a dark instrument
plate, a timestamped voice-recorder transcript aligned to the exact second the
trace broke, and a report that closes on numbered findings and recommendations.
The structure is borrowed because it is already the product's structure —
retention curve cross-referenced against transcript, ending in a concrete fix.

The register is calm, high-contrast, and evidentiary. A creator arrives worried
and needs to be told what happened without being sold to. Nothing pulses, nothing
celebrates, nothing gamifies. Authority comes from precision: exact timecodes,
named thresholds, stated confidence, and a visible distinction between what the
data shows and what ViuPace advises.

The one thing this system refuses is the analytics-dashboard default — a grid of
equal metric cards with sparklines and green percentage deltas, which reports
everything and diagnoses nothing.

**Key Characteristics:**
- White paper ground; a single dark instrument plate per finding carries the trace
- Evidence and advice are different materials, never the same card
- Monospace is reserved for measurement: timecodes, channel IDs, thresholds
- Status is never carried by color alone
- One accent, used for reference traces and recommendations only

## Colors

A white documentary ground with one cool neutral for panels, one dark plate for
instrument traces, and a single magenta signal ink that never encodes status.

### Primary
- **Signal Magenta** (`#a5228c`): The investigator's marker ink. Reference/benchmark
  traces, the recommendation field, current selection, and focus rings. Never used
  for a status and never for decoration. 6.55:1 on paper.

### Neutral
- **Paper** (`#ffffff`): The report ground. Every reading surface.
- **Panel** (`#f4f5f7`): Sidebar, queue rail, and toolbars — the cooler second
  neutral that separates chrome from content.
- **Field** (`#fafbfc`): Inset wells inside a paper card (transcript rows, tables).
- **Plate** (`#14181c`) with **Plate Grid** (`#232a31`): The instrument plate a
  retention trace is read on, and its hairline lattice.
- **Ink** (`#14181c`): Primary text and primary buttons.
- **Ink Secondary** (`#566069`, 6.42:1): Supporting prose and labels.
- **Ink Muted** (`#6b757e`, 4.70:1): Axis ticks, metadata, captions. This is the
  lightest legal text gray; `#737d86` fails at 4.19:1.
- **Rule** (`#e2e5e9`) / **Rule Strong** (`#cdd2d8`): Hairline dividers; input strokes.

### Status
Reserved meanings, distinct from the accent, each verified for text contrast on paper.
- **Drop Red** (`#c0362c`, 5.52:1): Retention drop-off, flagged video.
- **Rewatch Green** (`#0f7a45`, 5.40:1): Rewatch spike, healthy video.
- **Caution Amber** (`#9a6400`, 5.00:1): Underperforming, threshold near-miss.

### Named Rules
**The Two Materials Rule.** Evidence is dark plate or neutral paper; advice is the
magenta signal field. A finding and its fix never share one surface, so a creator
can tell diagnosis from instruction without reading a word.

**The Status Is Never Alone Rule.** Red, green, and amber are a colorblind-unsafe
triad by construction — no ordering of them passes an adjacent CVD gate. Every
status therefore ships a glyph and a text label; removing the color must not
remove the meaning.

**The Reserved Ink Rule.** Signal Magenta never means good or bad. If a mark
encodes performance it wears a status color; if it encodes a reference or an
action it wears magenta.

## Typography

**Body & Display Font:** Geist Sans (with `ui-sans-serif`, `system-ui`)
**Readout Font:** Geist Mono (with `ui-monospace`)

**Character:** One workhorse grotesque carries every role — this is an Operate
surface, so a display face would be costume. Geist Mono appears only where the
docket would use a machine readout, which is also the only place monospace is
honest: timecodes, durations, percentages under a threshold, and record IDs.

### Hierarchy
- **Headline** (600, 1.375rem, 1.25, -0.02em): The probable-cause verdict. One per report.
- **Title** (600, 0.9375rem, 1.4, -0.01em): Finding section titles, card titles.
- **Body** (400, 0.875rem, 1.6): Prose, transcript excerpts, recommendation copy. 65–75ch.
- **Readout** (500, 0.75rem mono, 0.02em): Timecodes, metric values, axis ticks.
- **Stamp** (500, 0.6875rem mono, 0.08em, uppercase): Record numbers, section
  designators (`FINDING 01`, `REC 01`), content-type marks.

### Named Rules
**The Measurement-Only Mono Rule.** Monospace is for values that are read against a
scale — times, counts, rates, IDs. Never for prose, buttons, headings, or flavor.

**The One Stamp Per Block Rule.** A section carries at most one uppercase mono
designator, and it carries information (a finding number, a content type). Tracked
uppercase as a decorative eyebrow over every heading is not part of this system.

## Layout

A fixed left docket rail (`16rem`, Panel) beside a scrolling report column. The
report column caps at `72rem` and holds a single content spine — findings stack
vertically in fixed order and are never placed side by side, because the order
is the argument.

Spacing rhythm runs on a 4px base using the 4/8/16/24/40 steps, with more space
above a heading than below it (`40px` above a finding title, `16px` below). Within a
finding: plate, then evidence rows, then the recommendation field, in that order.

Responsive behavior is structural, not fluid. Below `lg` the rail collapses to a
horizontal top bar and the video queue becomes a horizontally scrolling filmstrip;
type sizes do not scale with the viewport. Dumbbell and comparison rows reflow from
two columns to stacked full-width rows. Charts keep their aspect via `viewBox`,
and containers grow to include the axis band rather than fixing a height that clips it.

## Elevation & Depth

Tonal layering, not shadows. Depth comes from the four-step neutral stack
(Panel → Paper → Field → Plate) and hairline rules. Cards declare elevation
once, with a `1px` rule or a `ring-1`, never both under a soft shadow.

The only shadow in the system is on transient overlays (tooltips, popovers), which
must read as floating above the plate.

### Shadow Vocabulary
- **Overlay** (`box-shadow: 0 4px 16px rgb(20 24 28 / 0.16)`): Chart tooltips and
  popovers only. Carries a real offset and a soft blur.

### Named Rules
**The Flat Evidence Rule.** No shadow on any surface that holds data. A drop
shadow under a chart card makes the data look like an object; it should look like
a printed record.

## Shapes

Rectilinear and squared-off, in keeping with a printed docket. Radii: `6px` on
small controls and chips, `10px` on buttons and inputs, `12px` on cards and plates.
Nothing is fully pill-shaped except small status chips, and nothing is a circle
except data markers and avatars.

Data marks follow the chart spec: `4px` rounded data-end squared at the baseline,
`2px` lines with round caps, markers at `r ≥ 4` carrying a `2px` surface ring, and a
`2px` surface gap between touching fills.

## Components

### Buttons
- **Shape:** Squared-off with a soft corner (`10px`); `32px` default height.
- **Primary:** Ink (`#14181c`) on paper text. The calm default — primary actions are
  black, not accent-colored, so the accent stays rare.
- **Hover / Focus:** Hover lifts to `#2b3238`; focus shows a `3px` Signal Magenta
  ring at 50% plus a solid border. Active translates `1px` down.
- **Outline / Ghost:** Rule stroke on paper, or transparent settling to Panel on hover.

### Chips (status)
- **Style:** `6px` radius, tinted status field at ~10%, status-colored text, and a
  leading glyph — filled wedge (flagged), hollow wedge (underperforming), dot (healthy).
- **State:** Always glyph + label + color together.

### Cards / Containers
- **Corner Style:** `12px`.
- **Background:** Paper, or Plate when the card holds an instrument trace.
- **Shadow Strategy:** None — see Elevation.
- **Border:** A single `1px` Rule stroke, or `ring-1` on the shadcn `Card`. Never both.
- **Internal Padding:** `16px`, `24px` on the report header.

### Navigation
- Docket rail on Panel. Items are `13px`/500 with a `20px` lucide glyph, `6px`
  radius, `text-ink-secondary` at rest. Hover fills Paper; the active item fills
  Paper with Ink text and a `2px` Signal Magenta left marker (the one place a
  colored edge marker is allowed, because it marks position, not severity).
- Mobile: the rail becomes a top bar; labels persist, glyphs shrink.

### Finding Section (signature)
Three fixed parts in order: a **stamp** (`FINDING 01` + content-type mark), the
**evidence** (plate trace, emphasis bars, or dumbbell rows), and one
**recommendation field**. A finding without a recommendation is incomplete.

### Recommendation Field (signature)
The system's most distinctive component and the answer to "make the fix visually
distinct from the problem." A Signal Magenta field (`#fbf2f8`) owning the full
width of its finding, stamped `REC 01`, holding one imperative sentence, the
concrete asset (rewritten title, pacing note, thumbnail concept), and a single
action. It is the only place the accent covers a region rather than a mark.

### Retention Trace (signature)
Dark plate; hairline solid lattice; `2px` retention line in Plate Ink; drop
segments overdrawn in Drop Red and rewatch segments in Rewatch Green with a
10%-opacity wash beneath; a `1.5px` Signal Magenta channel-average reference
trace; content-type-aware checkpoint bands labeled along the top. Crosshair and
tooltip on hover and on keyboard focus. A legend is always present, and a
`<details>` table view carries every checkpoint value.

## Do's and Don'ts

### Do:
- **Do** put the fix in a Signal Magenta field and the problem on plate or paper —
  the Two Materials Rule is the core of the system.
- **Do** ship a glyph and a label with every status color.
- **Do** use Geist Mono for timecodes, rates, thresholds, and record IDs, and
  nowhere else.
- **Do** state the content type and the threshold that applies to it on every
  finding, since long-form and Shorts are judged on different checkpoints.
- **Do** run `validate_palette.js` before adding or changing any chart color, and
  keep body text at or above 4.5:1 (`#6b757e` is the lightest legal gray).
- **Do** give every chart a legend at two or more series and a table-view twin.

### Don't:
- **Don't** open the report with a row of equal metric cards and green delta
  percentages — that is the incumbent analytics default this world replaces.
- **Don't** let Signal Magenta encode good or bad, or appear as a gradient.
- **Don't** put a shadow on any surface holding data.
- **Don't** use a colored left or right border thicker than `1px` to mark severity
  on a card, callout, or list item; the active-nav position marker is the sole
  `2px` exception.
- **Don't** add a second accent hue or generate chart colors past the documented set.
- **Don't** flip the surface to dark automatically with `prefers-color-scheme`;
  this is a committed white workspace, and a dark mode would need its own
  validated steps.
