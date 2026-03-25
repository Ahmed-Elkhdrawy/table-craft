# RFC: [Title]

> **Status:** Draft | Under Review | Accepted | Rejected | Implemented
> **Author:** [Your name / GitHub handle]
> **Created:** YYYY-MM-DD
> **Issue:** #[link to tracking issue]

---

## Summary

A one-paragraph explanation of the proposed change. What is it, and what does it do?

## Motivation

Why should this change be made? What problem does it solve? Include concrete examples of the pain point or limitation.

```tsx
// Before: Show how things work today (if applicable)
```

## Goals

- What this RFC aims to achieve

## Non-Goals

- What this RFC explicitly does NOT aim to do (scope boundaries)

## API Design

Show the proposed public API with TypeScript examples. Be specific about types, props, and hooks.

### Types

```typescript
// New or modified types
interface ProposedType {
  // ...
}
```

### Component API

```tsx
// How consumers would use the new feature
<DataTable
  newProp={value}
/>
```

### Hook API (if applicable)

```typescript
// New hooks or modifications to existing hooks
const result = useProposedHook(options)
```

## Architecture Integration

Explain how this change fits into react-table-craft's existing systems.

### Config System

How does this interact with the 4-layer config (defaults → provider → instance → plugins)?

```typescript
const config = createTableConfig({
  // Where does the new config live?
})
```

### Feature Flags

Does this require a new feature flag in `TableFeatureFlags`?

```typescript
features: {
  enableNewFeature: boolean
}
```

### Components

Which existing components are affected? Are new components needed?

## Alternatives

What other approaches were considered? Why were they rejected?

| Approach | Pros | Cons |
|----------|------|------|
| This proposal | ... | ... |
| Alternative A | ... | ... |

## Trade-offs

What are the costs of this change?

- **Bundle size:** Does this add significant weight?
- **Complexity:** Does this make the API harder to learn?
- **Performance:** Any runtime cost?

## Backward Compatibility

- Does this break any existing API?
- Can this be adopted incrementally?
- What is the migration path for existing users?

## Open Questions

- [ ] Unresolved design decisions
- [ ] Things that need community input

## Adoption Plan

1. **Phase 1:** Implementation behind feature flag
2. **Phase 2:** Documentation and examples
3. **Phase 3:** Enable by default (if applicable)

---

### How to submit this RFC

1. Copy this template to `rfcs/NNNN-your-feature-name.md`
2. Fill in the sections above
3. Open a PR titled `rfc: [short title]`
4. Label the PR with `rfc`
5. Share in the tracking issue for discussion
