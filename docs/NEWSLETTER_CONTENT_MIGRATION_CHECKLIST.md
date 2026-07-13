# Newsletter Content Migration Checklist

This checklist tracks the staged transition from the current split content system to a unified newsletter architecture.

## Phase 1: Types, validation, and adapters

Status: complete in `fix/homepage-issue01-visual-polish`.

- [x] Define canonical content types in `src/lib/newsletter-content.ts`.
- [x] Add validation helpers in `src/lib/newsletter-validation.ts`.
- [x] Add a repository abstraction in `src/lib/newsletter-repository.ts`.
- [x] Map existing static issues from `src/data/issues.ts` into the canonical model.
- [x] Map Supabase issue rows into the canonical model.
- [x] Preserve the current rendered output for `/`, `/issues/1`, `/issues/2`, `/issues/3`, and `/archive`.
- [x] Add parity tests for the adapter layer.

Evidence gates:

- [x] `npm run build` passes.
- [x] `npm run test` passes.
- [x] Smoke tests confirm all existing routes still load.

Completion criteria:

- [x] Canonical types exist and compile.
- [x] Adapter output matches the current runtime behavior.

## Phase 2: Issue 01 canonicalization

- [ ] Move Issue 01 into the canonical model.
- [ ] Preserve the approved Issue 01 cover and supporting media.
- [ ] Preserve the current Issue 01 article layout and TOC behavior.
- [ ] Keep all Issue 01 sections public.
- [ ] Keep the sources section rendered as a distinct section.
- [ ] Keep Issue 01 tests green.

Evidence gates:

- [ ] Issue 01 renders identically before and after the adapter switch.
- [ ] Cover rendering tests still pass.
- [ ] Markdown safety tests still pass.

Completion criteria:

- [ ] Issue 01 is readable through the canonical model.
- [ ] No visual regression in the approved Issue 01 experience.

## Phase 3: Legacy local issue compatibility adapter

- [ ] Add a compatibility adapter for issues 2-10.
- [ ] Preserve issue-number routing and existing article copy.
- [ ] Preserve existing section audience levels.
- [ ] Preserve `professional` and `restricted` compatibility behavior.
- [ ] Keep archive ordering stable.
- [ ] Keep homepage latest-issue behavior stable.

Evidence gates:

- [ ] Issues 2-10 still load and render with the same content.
- [ ] Archive cards still show the same covers, summaries, and ordering.

Completion criteria:

- [ ] The legacy local issues read through the canonical adapter without changing output.

## Phase 4: Database schema and read repository

- [ ] Add `newsletter_issues`.
- [ ] Add `newsletter_issue_sections`.
- [ ] Add `newsletter_issue_assets`.
- [ ] Add `newsletter_issue_sources`.
- [ ] Add or update RLS policies for the new tables.
- [ ] Update generated Supabase types.
- [ ] Add a Supabase-backed repository implementation.
- [ ] Seed or backfill canonical rows from the current data model.

Evidence gates:

- [ ] A published issue can be read from the new schema.
- [ ] The local fallback still works if the database layer is unavailable.

Completion criteria:

- [ ] The app can read from the new schema without breaking the old path.

## Phase 5: Incremental issue migration

- [ ] Move a small batch of issues into the canonical DB schema.
- [ ] Verify each migrated issue against the current rendered output.
- [ ] Confirm archive and homepage ordering stays correct.
- [ ] Confirm cover resolution still works for migrated and unmigrated issues.
- [ ] Update tests for each batch.

Evidence gates:

- [ ] Parity tests pass for each migrated issue.
- [ ] Route smoke tests pass after each batch.

Completion criteria:

- [ ] Each migrated issue is visually and semantically equivalent to the previous output.

## Phase 6: Editorial and admin workflow

- [ ] Route admin writes to the canonical schema.
- [ ] Update the generator function to emit canonical rows.
- [ ] Update the review function to read and revise canonical sections.
- [ ] Preserve current admin capabilities during the transition.
- [ ] Preserve `issue_votes` and `user_roles` as separate user-state tables.

Evidence gates:

- [ ] Admin can create, publish, unpublish, and delete canonical issues.
- [ ] Generated issues still appear in the app.

Completion criteria:

- [ ] Editorial write paths target the new canonical model.

## Phase 7: Remove obsolete duplicate sources

- [ ] Remove legacy duplication from `src/data/issues.ts` only after parity is proven.
- [ ] Remove obsolete summary fallbacks where the canonical model now supplies the same data.
- [ ] Remove legacy reader branches only after all migrated issues are stable.
- [ ] Retire compatibility code only when no live route depends on it.

Evidence gates:

- [ ] Full regression suite passes.
- [ ] All migrated routes match the approved output.
- [ ] No live content path depends on the removed duplicate source.

Completion criteria:

- [ ] The canonical content model is the single source of truth for migrated issues.

## Non-goals for this migration

- [ ] No homepage redesign.
- [ ] No Issue 01 visual redesign.
- [ ] No route renaming.
- [ ] No broad lint cleanup.
- [ ] No Supabase migration files in Phase 1.
- [ ] No big-bang rewrite of issues 2-36.

## Ongoing verification

- [ ] Keep `git diff --check` clean before every commit.
- [ ] Keep build and tests green after each phase.
- [ ] Run route smoke tests for `/`, `/issues/1`, `/issues/2`, `/issues/3`, and `/archive`.
- [ ] Verify issue numbering stays stable.
- [ ] Verify covers resolve through the shared asset layer.
- [ ] Verify restricted content remains gated by policy, not by accidental rendering.
