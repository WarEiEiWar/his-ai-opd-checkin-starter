# Design foundation — OPD Patient Check-in

This document records the visual foundation used by the training prototype. It separates evidence from the approved sources from patterns proposed for states that the reference image does not show.

## Sources and authority

1. `docs/requirements/US-001-opd-checkin.md` is the source of truth for behavior and acceptance criteria.
2. `docs/design/opd-check-in-reference.png` is a visual reference for hierarchy, composition, and visual tone. It is not a complete behavior specification.
3. Existing product code is reused before adding a new pattern: `src/app/globals.css`, `TrainingNotice`, `PatientSearch`, and `PatientSearchResults`.

If these sources disagree, the requirement controls behavior. The reference image must not introduce patient facts or workflow rules that are absent from the requirement and versioned mock data.

## Confirmed design

The following can be traced to the visual reference, requirement, or existing implementation.

### Foundation

- A restrained teal accent identifies the workshop label, primary action, selected treatment, and focus treatment.
- Page surfaces use a soft neutral background with white cards in light mode.
- The existing application supports a dark color scheme through `prefers-color-scheme`.
- Text uses the existing stack: Arial, `Noto Sans Thai`, sans-serif.
- The page hierarchy is: context label, page title, explanatory copy, then task content.
- Desktop composition may place search and check-in content side by side. The requirement also requires the primary flow to work without horizontal scrolling on a narrow viewport.
- Controls and cards use rounded corners, visible boundaries, and comfortable touch-sized padding.

### Existing implementation tokens

| Role | Current value or utility | Evidence |
| --- | --- | --- |
| Page background | `#f6f8f7` | `src/app/globals.css` |
| Page foreground | `#19332e` | `src/app/globals.css` |
| Dark background | `#091411` | `src/app/globals.css` |
| Dark foreground | `#e6f2ef` | `src/app/globals.css` |
| Primary action | Tailwind `teal-700` with white text | Existing OPD components and reference tone |
| Context label | `teal-700`, `teal-300` in dark mode | Existing page |
| Input boundary | `black/50`, `white/30` in dark mode | Existing patient search |
| Focus | 2px teal outline with offset | Existing patient search |
| Main content width | `max-w-5xl` | Existing OPD page |
| Page spacing | `p-6`, `md:p-12`; section gap `space-y-6` | Existing OPD page |
| Card radius | `rounded-2xl`; control radius `rounded-xl` | Existing components |

These are implementation tokens for this prototype, not a claim that the image specifies exact color or spacing values.

### Component rules supported by the sources

- **Page header:** one context label, one clear `h1`, and concise supporting copy.
- **Panel:** groups one task or one reviewable concept. Use an `h2` and keep related actions inside the panel.
- **Form control:** always has a visible label. Required fields must communicate validation clearly.
- **Primary action:** teal filled button with white, semibold text.
- **Patient result:** uses the mock record as its data source. A list must support one or multiple matches.
- **Selected patient:** only one patient may be selected at a time; selected details must show HN, full name, date of birth, and gender.
- **Responsive behavior:** stack content and actions where needed so the primary flow does not scroll horizontally.
- **Keyboard behavior:** primary controls require understandable labels, keyboard operation, and a visible focus state.

## Proposed patterns for review

The visual reference does not show Loading, Empty, Error, Validation, Focus, or Mobile states. The requirement asks for these behaviors but does not prescribe their visual treatment. The following patterns are proposals for consistent implementation and require human design review.

**Human review status:** The direction below was approved for Issue #5. These patterns remain proposals rather than confirmed requirements because the source requirement does not prescribe their visual treatment. Product copy for each state is not locked and must be reviewed again when the related component is implemented.

### State presentation

| State | Proposed presentation | Requirement link |
| --- | --- | --- |
| Loading | Short live status near the affected content; prevent duplicate submission while preserving context | AC2 |
| Empty | Neutral bordered message naming the completed search and stating that no patient was found | AC3 |
| Error | Red-tinted message with a plain-language explanation and a Retry action | AC4 |
| Validation | Red text adjacent to the invalid field plus a matching field boundary | AC8 |
| Focus | 2px teal outline with visible offset on every interactive control | AC13 |
| Mobile | One-column panels and full-width primary actions where space is limited | AC14 |

These patterns define presentation only. They do not add new workflow behavior.

### Proposed semantic colors

- Informational/loading: teal tint with the normal foreground color.
- Empty/neutral: existing foreground at reduced emphasis with a neutral boundary.
- Error/validation: red tint, red boundary, and dark red text in light mode; lighter red text in dark mode.
- Success: green tint with explicit success copy. The requirement defines the success state and queue number; the color treatment is proposed.

Color must never be the only state indicator. Each state includes text, and interactive recovery uses a labeled action.

## Human review checklist

- Approved direction: Loading, Empty, Error with Retry, Validation near its field with a non-color cue, a 2px teal focus outline with offset, and one-column narrow viewport layout.
- Review the exact state colors in the implemented component and its surrounding context.
- Review Thai copy for Loading, Empty, Error, Validation, and Success before treating it as locked product copy.
- Review the exact mobile order once the check-in form and preview are implemented.
- Review selected-patient emphasis when patient selection is implemented.
- Check light and dark themes, keyboard focus, narrow viewport reflow, and text contrast on the implemented component.

## Out of scope for this foundation

- New OPD business rules or changes to the patient search service.
- Clinic availability from the separate capstone.
- Backend, authentication, HIS/FHIR, database, and real patient data.
- A new UI framework or dependency.
