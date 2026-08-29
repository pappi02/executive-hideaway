---
name: executive
description: Brief description of what this Skill does and when to use it
---

---

name: executive
description: Master project skill for building and maintaining the Executive Hideaway Barber and Spa website. Use this Skill for all design, UI/UX, frontend implementation, content, responsiveness, debugging, and feature decisions related to the project.
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Executive Hideaway Barber and Spa

## Instructions

You are working on the official website for **Executive Hideaway Barber and Spa**.

Treat this Skill as the project's primary source of direction. Follow these instructions consistently when designing, implementing, modifying, or debugging the website.

### 1. Official Brand Name

The official business name is:

**Executive Hideaway Barber and Spa**

Always use this exact name.

Do not replace it with alternative names such as:

* Executive Hideaway Barber & Wellness Centre
* Executive Hideaway Spa
* Executive Hideaway Barber
* Executive Hideaway

unless the user explicitly instructs you to do so.

---

### 2. Design Philosophy

The website should communicate a:

* Premium
* Elegant
* Modern
* Sophisticated
* Calm
* Masculine
* Comfortable
* High-end grooming and wellness

experience.

The design should feel like a premium physical destination rather than a generic business website.

Prioritize:

* Strong visual hierarchy
* High-quality imagery
* Elegant typography
* Excellent spacing
* Refined layouts
* Sophisticated contrast
* Subtle animations
* Smooth interactions
* Clear calls to action
* Premium visual details

Avoid:

* Generic templates
* Excessive gradients
* Excessive glassmorphism
* Excessive rounded cards
* Overly colorful interfaces
* Unnecessary animations
* Cartoon-like visuals
* Cluttered layouts
* Cheap-looking UI patterns
* Excessive text

Do not add visual effects simply because they are technically possible.

Every design decision must support the brand.

---

### 3. Mobile-First Development

The entire website must be implemented **mobile-first**.

Always design and test the smallest practical viewport first.

Then progressively enhance the layout for:

1. Mobile
2. Tablet
3. Desktop
4. Large desktop screens

Pay particular attention to:

* Touch targets
* Navigation
* Button sizing
* Typography
* Image cropping
* Section spacing
* Horizontal overflow
* Scroll behavior
* Mobile performance
* Readability
* Interaction usability

Never build a desktop layout and simply shrink it for mobile.

---

### 4. Homepage

The homepage is the primary marketing experience.

The homepage should communicate the brand quickly and visually.

Current homepage sections include the project's existing sections such as:

* Hero
* Experience
* Gallery
* Calls to action
* Other sections already implemented in the codebase

Before modifying the homepage:

1. Inspect the existing implementation.
2. Understand the current component structure.
3. Preserve working functionality.
4. Identify the specific issue being addressed.
5. Make the smallest appropriate change.
6. Verify that previously working interactions still work.

Do not unnecessarily rewrite the entire homepage when fixing a localized problem.

---

### 5. Existing Homepage Scroll Issue

There is a known unresolved issue:

When visiting or refreshing `/`, the homepage may load around the **Gallery section instead of the Hero/top of the page**.

A previous `ScrollToTop` implementation was tested and disabled, but the problem persisted.

Therefore:

* Do NOT assume `ScrollToTop` is the cause.
* Do NOT automatically reintroduce `ScrollToTop`.
* Investigate the actual cause.
* Check browser restoration behavior.
* Check routing/navigation behavior.
* Check hash fragments.
* Check automatic focus/scroll behavior.
* Check component effects.
* Check image/media loading behavior.
* Check layout shifts.
* Check whether navigation is triggering an unintended scroll.
* Preserve Gallery and Experience interactions while debugging.

Do not declare the issue fixed until the actual behavior has been verified.

---

### 6. Component Architecture

Prefer reusable components over duplicated markup.

Before creating a new component:

1. Check whether an existing component already performs the same role.
2. Reuse it if appropriate.
3. Extend it only when necessary.
4. Create a new component when the responsibility is genuinely different.

Avoid unnecessary abstraction.

Components should have clear responsibilities.

Do not create dozens of tiny components solely for the sake of abstraction.

---

### 7. Existing Codebase

Before making significant changes:

* Inspect the relevant files.
* Understand the existing architecture.
* Identify dependencies.
* Follow the project's existing conventions.
* Reuse existing utilities and components where appropriate.

Do not replace the project's architecture with a different framework or library without explicit user approval.

Do not introduce a new dependency when the existing stack can reasonably solve the problem.

If a dependency is required, explain why before introducing unnecessary complexity.

---

### 8. Responsiveness

Every page and component must behave correctly across different screen sizes.

Check for:

* Overflow
* Broken grids
* Text wrapping problems
* Oversized headings
* Buttons extending beyond the viewport
* Incorrect image aspect ratios
* Fixed-position elements covering content
* Navigation problems
* Excessive whitespace
* Sections becoming too tall
* Poor tablet layouts

Do not use arbitrary fixed dimensions when responsive sizing is more appropriate.

---

### 9. Animations

Animations should be subtle and purposeful.

Use animation to improve:

* Visual hierarchy
* Navigation feedback
* Section transitions
* Image presentation
* Interaction feedback

Avoid:

* Excessive motion
* Constant movement
* Distracting effects
* Slow transitions
* Animations that interfere with usability

Respect reduced-motion preferences where practical.

---

### 10. Images

Images are an important part of the brand experience.

Use imagery intentionally.

Prioritize:

* Correct aspect ratios
* Good cropping
* Responsive image sizing
* Performance
* Visual consistency
* High-quality presentation

Do not use random placeholder images and present them as final business imagery.

If appropriate imagery has not yet been supplied, clearly distinguish placeholders from final assets.

---

### 11. Content Accuracy

Never invent business information.

Do not fabricate:

* Services
* Prices
* Opening hours
* Address
* Phone numbers
* Staff
* Testimonials
* Awards
* Certifications
* Customer statistics
* Facilities
* Promotions
* Business history

The detailed services and prices will be added later.

Until the user provides the actual information, use only confirmed information or clearly marked placeholders.

Never create fake prices.

---

### 12. Copywriting

Website copy should be:

* Clear
* Concise
* Confident
* Sophisticated
* Human
* Welcoming

Avoid generic AI marketing language and exaggerated claims.

Do not make unsupported claims such as:

* "Best barber in Kenya"
* "Number one spa"
* "Award-winning"
* "Thousands of happy customers"

unless the user explicitly provides evidence for the claim.

---

### 13. Accessibility

Build accessible interfaces.

Consider:

* Semantic HTML
* Keyboard navigation
* Focus states
* Sufficient contrast
* Descriptive image alt text
* Proper button/link semantics
* Form labels
* Reduced-motion preferences
* Screen-reader usability

Do not sacrifice usability for visual effects.

---

### 14. Performance

Avoid unnecessary performance costs.

Pay attention to:

* Image sizes
* Lazy loading where appropriate
* Unnecessary JavaScript
* Excessive animations
* Large dependencies
* Repeated rendering
* Unnecessary network requests

Do not optimize blindly.

Measure or identify a concrete reason before introducing complicated optimization techniques.

---

### 15. Debugging Rules

When something is broken:

1. Reproduce the problem.
2. Identify the actual cause.
3. Inspect relevant code.
4. Form a specific hypothesis.
5. Make the smallest appropriate change.
6. Test the affected behavior.
7. Check for regressions.

Do not randomly modify multiple files until the problem disappears.

Do not claim something is fixed unless it has actually been verified.

When a fix fails, revert the incorrect assumption and investigate further.

---

### 16. Preserve Existing Functionality

When implementing a new feature or fixing a bug, do not unintentionally break existing functionality.

Pay special attention to:

* Gallery interactions
* Experience interactions
* Navigation
* Mobile menu
* Buttons
* Links
* Animations
* Responsive behavior
* Page routing
* Scroll behavior

A successful implementation must preserve previously working functionality unless the user explicitly requests a change.

---

### 17. Working Method

For every implementation task:

#### Step 1 — Understand

Determine exactly what the user wants changed.

#### Step 2 — Inspect

Inspect the relevant existing code before editing it.

#### Step 3 — Plan

Determine the smallest clean implementation.

#### Step 4 — Implement

Make the changes while following the project's existing architecture.

#### Step 5 — Verify

Check:

* Mobile
* Desktop
* Functionality
* Responsiveness
* Console errors
* Existing interactions
* Visual regressions

#### Step 6 — Report

Briefly explain:

* What changed
* Which files were affected
* Any important implementation decisions
* Anything that still requires attention

---

### 18. Do Not Guess

If an important requirement is missing, do not silently invent one.

If there are multiple technically valid approaches and the choice materially affects the project, explain the options and ask for direction.

If a fact about the business is unknown, treat it as unknown.

If you are uncertain whether an API, library, dependency, or framework feature exists, verify it before using it.

---

### 19. Priority Order

When making decisions, use this priority order:

1. User's latest explicit instruction
2. Project-specific requirements
3. Existing working functionality
4. Brand consistency
5. Mobile usability
6. Accessibility
7. Performance
8. Code maintainability
9. Visual enhancements

Do not sacrifice a higher-priority requirement for a lower-priority improvement.

---

## Examples

### Example 1 — Adding a Homepage Section

**User:**
"Add a new section below the Gallery."

**Correct approach:**

1. Inspect the current homepage structure.
2. Identify how existing sections are implemented.
3. Reuse the existing layout and styling conventions.
4. Build the section mobile-first.
5. Add responsive desktop behavior.
6. Ensure Gallery interactions remain functional.
7. Verify page scrolling and navigation.
8. Report what was changed.

Do not rebuild the homepage from scratch.

---

### Example 2 — User Requests Service Prices

**User:**
"Add the barbering prices."

**Correct approach:**

Ask for the actual prices if they have not been provided.

Do NOT invent prices such as:

> Haircut — KES 1,000
> Beard Trim — KES 500

unless those prices were explicitly provided by the user.

---

### Example 3 — Homepage Opens at Gallery

**User:**
"The homepage keeps opening at Gallery."

**Correct approach:**

Investigate:

* Browser scroll restoration
* Navigation behavior
* URL/hash state
* React effects
* Component mounting behavior
* Focus behavior
* Layout shifts
* Image/media loading
* Any code calling `scrollIntoView`, `scrollTo`, or equivalent behavior

Do not automatically add another `ScrollToTop` component.

---

### Example 4 — Mobile Layout

**User:**
"The Hero looks good on desktop but terrible on mobile."

**Correct approach:**

Treat mobile as the primary layout.

Inspect:

* Heading size
* Hero height
* Image crop
* CTA sizing
* Spacing
* Text width
* Navigation
* Touch targets

Then adjust the mobile implementation first and enhance desktop separately.

---

### Example 5 — Adding Animation

**User:**
"Make the Gallery more interactive."

**Correct approach:**

First determine what interaction is actually useful.

Prefer subtle interactions such as:

* Hover/focus states
* Smooth transitions
* Controlled image expansion
* Lightweight reveal animations

Do not add multiple competing animations simply to make the section appear more dynamic.

---

### Example 6 — Unknown Business Information

**User:**
"Add our location and opening hours."

**Correct approach:**

If those details have not been provided, ask the user for the confirmed information.

Never fabricate them.

---

## Final Rule

Build **Executive Hideaway Barber and Spa** as a real premium business website, not as a generic AI-generated template.

Every implementation should be:

**intentional, mobile-first, visually refined, technically sound, accessible, maintainable, and based on confirmed information.**
