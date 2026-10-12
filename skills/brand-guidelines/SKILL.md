---
name: brand-guidelines
description: Apply a fixed brand identity — colours, typography, tone of voice, naming rules, and the things never to say — to anything produced for that brand. Use when the user says "on brand," "our brand," "brand voice," "style guide," "brand colours," "tone of voice," "house style," or asks for copy, a page, a deck, or a document for a named company. Also use before producing any customer-facing output for a brand that has a profile in this skill.
metadata:
  version: 1.0.0
---

# Brand Guidelines

A brand baseline that persists, so the user stops re-typing hex codes, fonts and tone
rules into every prompt. Everything produced for a brand in this file follows that
brand's profile without being asked.

## How to use it

1. Work out which brand applies. The user names it, the repository makes it obvious,
   or you ask — once.
2. Read that brand's profile below and apply it to everything in the reply.
3. If the brand is not in this file, run **Setting up a new brand** at the bottom and
   add it. Do not guess a brand's colours or voice. Guessed branding is worse than no
   branding, because it looks deliberate.
4. State the brand you applied in one short line at the end, so a wrong pick is caught.

When an explicit instruction conflicts with the profile, the instruction wins for that
output — and say which rule you set aside, so it is a choice rather than a slip.

---

## Brand profiles

<!-- Copy the block below for each brand. Delete the example once yours are in. -->

### Example Co.  *(placeholder — replace with your own)*

**Colours**

| Role | Hex | Use for |
|---|---|---|
| Primary | `#1F3A5F` | Headings, primary buttons, nav |
| Secondary | `#4A8DB7` | Links, secondary buttons, highlights |
| Accent | `#E07A3F` | Calls to action, one per screen |
| Ink | `#1A1A1A` | Body text |
| Paper | `#FFFFFF` | Backgrounds |
| Muted | `#6B7280` | Captions, metadata, disabled states |

Never use the accent for body text. Never put primary on secondary — the contrast
fails WCAG AA. Check every text/background pair reaches 4.5:1 for body and 3:1 for
text above 24px.

**Typography**

- Headings: Inter, semibold, tight tracking. Fallback: Helvetica, Arial, sans-serif.
- Body: Inter, regular, 16px minimum, line height 1.6. Fallback: as above.
- Numerals in tables: tabular figures.
- Never more than two weights on one page.

**Voice**

Plain, specific, warm without being chatty. Short sentences. Second person. Active
voice. British English spelling (`-ise`, `colour`, `organisation`).

- Say: "Your order ships Tuesday."
- Not: "We are pleased to inform you that your order is scheduled for dispatch."

**Naming**

- The company is "Example Co." on first mention, "Example" after. Never "ExampleCo",
  never all caps.
- Products take a capital: "the Example Dashboard", not "the example dashboard".

**Never say**

- "Revolutionary", "game-changing", "seamless", "unlock", "leverage", "best-in-class".
- Superlatives about the product that no evidence supports — "the best", "the fastest",
  "number one" — unless the user supplies a source, in which case cite it inline.
- Claims about safety, savings, compliance or guarantees that have not been checked.
  Flag these for review rather than writing them.
- Competitor names in marketing copy.

**Legal and compliance**

- Prices carry the currency and whether VAT is included.
- Any discount, guarantee or delivery promise needs the qualifying terms nearby.
- Testimonials and reviews are quoted verbatim or not at all.

---

## Applying a profile

**To written copy** — voice, naming and the never-say list. Read the draft back
against the never-say list before returning it; that is where most breaches land.

**To HTML, artifacts and UI** — define the palette once as CSS custom properties on
`:root`, give `body` an explicit background, and redefine the tokens for dark mode
rather than hard-coding colours per element.

```css
:root {
  --brand-primary: #1F3A5F;
  --brand-secondary: #4A8DB7;
  --brand-accent: #E07A3F;
  --brand-ink: #1A1A1A;
  --brand-paper: #FFFFFF;
  --brand-muted: #6B7280;
}
```

**To decks and documents** — heading font and weight, the palette for charts in the
order primary → secondary → accent → muted, and the voice rules in body copy. Never
invent a sixth chart colour; repeat with a pattern or group the tail into "other".

**To charts** — brand colours carry meaning, so do not use the accent for a routine
series. Keep sequential scales inside one hue.

---

## Setting up a new brand

Ask for these, in this order, and stop as soon as you have enough to be useful — a
profile with three colours and a never-say list already beats no profile:

1. Hex codes, with a role for each.
2. Heading and body typefaces, with web-safe fallbacks.
3. Three sentences of existing copy the user considers on-voice.
4. Spelling convention (British or US) and any naming rules.
5. Words and claims that are forbidden, and why — legal, or taste.

Then write the profile into this file in the format above, show the user the block,
and ask them to correct it. Do not infer voice from a logo, or colours from a
screenshot, without saying that is what you did.
