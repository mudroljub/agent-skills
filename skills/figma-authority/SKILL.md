---
name: figma-authority
description: Decide which design source wins and whether design intent is established. Use whenever work compares, implements, or reviews UI against Figma — including page or component parity, assets, tokens, and design reviews — and whenever a design value conflicts with a component library, differs between Figma frames, or looks like a question for the designer.
---

# Figma Authority

Resolve conflicting design sources and distinguish established design intent
from unresolved questions for the designer or product owner.

## Order of authority

From strongest to weakest:

1. The design system's own Figma library.
2. The code component library that implements it.
3. The product's Figma screens.
4. The product application.

When a code library component differs from the product Figma, the library
wins: that is not a finding for the application. Change the library only when
it differs from the design system's Figma library.

When the product Figma uses an instance of a library component, the product
uses that component too, never a hand-made CSS imitation. Mirror Figma's
component structure and names in code where it is logical.

When Figma cannot be inspected, ask for the reference. When Figma has no
motion data, interactive states (hover, pressed, selected) get a 0.2s linear
transition.

**Exception:** implement an element's values locally in the product when the
design context establishes a deliberate custom design. A detached instance
or a hand-drawn frame alone does not establish that intent. Check the node's
instance status, surrounding frames, design annotations, and the matching
library component before treating a difference as a custom design or a
library question.

A replacement font family wins over a legacy Figma font variable only when a
documented, approved migration maps that variable to the project's current
font token; size and line height still come from Figma. The current code token
alone is not evidence of approval.

## Clear design evidence

Figma is clear when it gives no grounds for reasonable doubt:

- the frames that show the element do not contradict each other;
- the value is not placeholder data or a leftover from a template;
- it does not conflict with the order of authority above.

## Reasonable doubt

Reasonable doubt splits into two kinds:

- **Inconsistency inside Figma** (the same element measures differently
  across frames, button widths vary, a frame keeps an empty block): resolve
  the difference using the order of authority and documented design or layout
  conventions. Consistency across states, avoiding layout jumps, and existing
  product values help assess a result but do not alone prove design intent.
  When the sources do not establish the intended value, record the difference
  as unresolved.
- **A real question of intent** (new behaviour, missing content, a state no
  frame shows, a copy decision): this belongs to the designer or the product
  owner.

## Before writing a question

Check, in this order:

1. Is the node an instance of a library component, or custom?
2. Do all frames that show it agree?
3. Is the value real or placeholder?
4. What do the library component's own variants and sample texts already say?
   (A default state labelled "Label text / Input text" covers both the
   placeholder and a filled field.)

These checks establish whether the sources settle the intended design or
leave a real question of intent.
