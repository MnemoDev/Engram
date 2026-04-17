# Retention Policy

Engram mixes hot retrieval, deduplication, and pruning. The storage policy should stay easy to reason about so memory quality does not drift over time.

## Hot tier

- Keep recent facts that are still likely to affect the next agent decision.
- Prefer concise entries with clear timestamps and sources.
- Rewrite duplicates into one stronger entry instead of stacking near-copies.

## Warm tier

- Move items here when they still matter for context but no longer need first-page retrieval.
- Keep relationship pointers so the retrieval layer can promote them again if they become relevant.

## Cold or expired

- Demote notes that have not been referenced and no longer change behavior.
- Drop low-signal fragments that fail both retrieval usefulness and audit value.

## Operator rule

A memory item should survive only if it changes what the agent would do next or explains why a past decision happened.
