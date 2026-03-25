# PR Review Guidelines

How maintainers and contributors should review pull requests.

## Review Priorities (in order)

### 1. Architecture Alignment

- Does the change respect the 4-layer config system (defaults → provider → instance → plugins)?
- Does it use `useTableConfig()` instead of prop drilling?
- Are new features gated behind `TableFeatureFlags`?
- Does it follow the named-export convention?

### 2. Type Safety

- No `any` in public APIs
- Generic types preserved (e.g., `DataTable<TData>` stays generic)
- Exported types are intentional — don't leak internal types
- Config types extend properly through `TableConfigInput`

### 3. API Clarity

- Is the API obvious to someone reading the README?
- Does the prop name match existing conventions?
- Could this be done with existing config instead of a new prop?
- Is the feature flag name consistent with others (e.g., `enableX`)?

### 4. Performance

- No unnecessary re-renders (check memo boundaries)
- No heavy computation in render paths
- New dependencies must be justified — check bundle impact
- Tree-shaking preserved (`sideEffects: false` contract)

### 5. Backward Compatibility

- Does this break existing consumers?
- If yes — was it discussed in an issue/RFC?
- Can it be adopted incrementally?

## Review Workflow

1. **Read the PR description first** — understand the problem before reading code
2. **Check the diff against the architecture rules** — most issues are structural
3. **Run `npm run typecheck`** on the branch if types look risky
4. **Test the change** if it touches rendering or user interaction
5. **Approve, request changes, or comment** — don't leave PRs in limbo

## Tone

- Be specific: "This should use `useTableConfig()` instead of accepting config as a prop" > "This doesn't follow the architecture"
- Suggest, don't demand: "Consider using X" > "Use X"
- Acknowledge good work — contributors remember encouragement
- If blocking, explain why clearly
