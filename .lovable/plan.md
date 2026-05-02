
# Redesign Homepage to Match Successful Newsletter Patterns

## The Problem

After studying Morning Brew (4M+ subscribers), The Hustle (2.5M+), and TLDR (1.6M+), your current site has several design patterns that drive bounce:

1. **Hero is too long and unfocused** -- takes 2-3 full scrolls on mobile before seeing any content. Successful newsletters get to content within 1 scroll.
2. **Too many elements competing for attention** -- floating glass panels, ember animations, methodology link, social proof bar, email signup, and CTA all fight each other above the fold.
3. **No immediate content payoff** -- Morning Brew and The Hustle show actual article headlines immediately. Your site makes people scroll past a hero, a social proof bar, a featured issue card, a trending section, AND a doctrine intro before reaching the issue grid.
4. **Dark, dense aesthetic** -- while on-brand, the heavy glassmorphism and dark theme can feel impenetrable. Top newsletters use clean, scannable layouts with strong typography hierarchy.
5. **Sticky email bar + exit popup + hero signup = 3 email CTAs before content** -- this feels aggressive and increases bounce.

## What Top Newsletters Do

- **Morning Brew**: One-line value prop + email input + immediately shows article headlines
- **The Hustle**: Bold headline + email input + featured article with image right below
- **TLDR**: Value prop + email + subscriber count social proof + content grid immediately

The pattern is clear: **Value prop + Email + Content. Nothing else.**

## Plan

### 1. Simplify the Hero (Hero.tsx)
- Remove the floating glass panels (Signal Layer, Flow Layer, Identity Layer) -- they look cool but add zero conversion value
- Remove ember particle animations -- performance cost with no conversion benefit
- Reduce hero height from `min-h-[70vh]` to a compact section (~40vh)
- Keep: Bold headline, one-sentence description, email signup, subscriber count
- Add a clear subscriber count number (like TLDR's "Join 1,600,000 readers")
- Move the "Browse Latest Briefings" scroll CTA below the email form as a text link, not a primary button

### 2. Content-First Layout (Index.tsx)
- Remove the `DoctrineIntro` section from the homepage entirely (keep it on its own page)
- Remove the separate "Featured Latest Issue" hero card -- merge it into the content grid
- Remove the `TrendingBriefings` component from the homepage (redundant with the grid)
- Move the issue grid directly below the hero with zero padding between
- Show the latest issue as a large featured card (full-width, with image + headline + excerpt), followed by a 2-column grid of the next 6 issues -- similar to Morning Brew's layout
- Remove the `FoundingMemberCampaign` section from homepage

### 3. Simplify Email Capture
- Keep only ONE email signup: in the hero
- Remove the sticky email bar from the homepage
- Remove the exit-intent popup (or at least keep it but increase the delay significantly)
- Add a second email signup at the bottom of the page, after all content (like Morning Brew does)

### 4. Clean Up the Issue Cards (IssueCard.tsx)
- Make cards simpler: image + headline + 1-line excerpt + reading time
- Remove "RESTRICTED" badges and access level indicators from the homepage (these confuse new visitors)
- Ensure all cards link directly to readable content

### 5. Improve Mobile Experience
- The current mobile layout requires 4+ scrolls to see content -- reduce to 1
- Make the hero section more compact on mobile
- Stack content immediately below

## Files Changed

- `src/components/Hero.tsx` -- simplify to value prop + email + social proof
- `src/pages/Index.tsx` -- restructure layout: hero + featured content grid, remove DoctrineIntro, TrendingBriefings, FoundingMemberCampaign from homepage
- `src/components/IssueCard.tsx` -- simplify card design
- `src/components/StickyEmailBar.tsx` -- remove from homepage (keep for issue pages)
- `src/components/ExitIntentPopup.tsx` -- increase trigger delay or remove

## What This Does NOT Change

- Individual issue pages remain the same
- The Archive page remains the same
- The Doctrine page remains the same
- The dark theme and brand identity remain -- we are simplifying layout, not rebranding
- All existing functionality (voting, auth, admin) untouched
