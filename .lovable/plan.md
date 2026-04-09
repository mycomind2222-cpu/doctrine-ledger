

## Problem: Site Is Broken — Build Failure Causing 96% Bounce Rate

The **entire site is down** due to a syntax error in `src/data/issues.ts`. When investor briefing sections were added to issues 1–10, commas were omitted between objects in the `sections` arrays. This means the site cannot build or deploy, so visitors see a broken/error page and immediately bounce.

There are **9 missing commas** at these lines: 244, 309, 374, 436, 501, 559, 624, 690.

## Fix

Add a comma after the closing `}` on each of these lines in `src/data/issues.ts`:

- Line 244: `}` → `},`
- Line 309: `}` → `},`
- Line 374: `}` → `},`
- Line 436: `}` → `},`
- Line 501: `}` → `},`
- Line 559: `}` → `},`
- Line 624: `}` → `},`
- Line 690: `}` → `},`

This is a one-file fix. Once applied, the build will succeed and the site will be live again, which should immediately resolve the bounce rate spike.

