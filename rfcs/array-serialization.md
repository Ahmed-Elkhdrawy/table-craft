# RFC: Configurable Filter Serialization

> **Status:** Draft
> **Author:** Elsie
> **Created:** 2026-03-27
> **Issue:** https://github.com/Ahmed-Elkhdrawy/table-craft/issues/4

---

## Summary

A configurable filter serialization system inspired by nuqs's parser pattern, replacing the hard-coded `.split('.')` / `.join('.')` in `data-table.tsx` with composable, type-safe serializers that flow seamlessly through the existing 4-layer custom configuration system.

## Motivation

In the current implementation of `data-table.tsx`, filter array values are hard-coded to use a dot (`.`) as the separator. For instance:

```tsx
// Before: Hardcoded serialization and deserialization
const parsed = urlValue.split('.') // Deserialization limit
const value = col.value.join('.') // Serialization limit
```

This breaks heavily when backends expect different query parameter formats (e.g., comma-separated strings, pipe separators, or especially multi-key query strings like `?key=a&key=b`) and forces all tables and columns to conform to a single hard-coded format.

### Benefits of Custom Serialization

Providing a `FilterSerializer` interface and allowing consumers to define custom serializers brings several key developer-facing benefits:

1. **Complete Decoupling from Backend Requirements:** Consumers no longer need to write hacky middleware to mutate URL search parameters before triggering API requests. If a legacy endpoint requires an exotic URL format (e.g., `?tags=id:1|id:2` or base64 encoded strings), developers can drop in a single custom serializer without altering table-craft's core structural representations.
2. **Type Safety and Predictability:** The abstraction guarantees that components handling filter internal state consistently receive standard string arrays. Custom definitions remain strongly typed through the boundaries of the `FilterSerializer` interface.
3. **Colocation of Logic:** Serialization structures can be defined exactly where the column is declared via the local `serializer` override. Grouping the representation logic closely with the column definitions directly improves code transparency and readability.
4. **Mixed Strategies on a Single Table:** Because serializers are inherently evaluated on a per-column basis leveraging config fallbacks, users can mix parsing strategies safely safely. Standard query filters can default to a `commaSeparated` configuration across the app, while a specific complex column concurrently relies on a `multiKey` strategy on the exact same table.

## Goals

- Provide a formalized, type-safe `FilterSerializer` abstraction for handling URL parsing and serialization.
- Support standard serialization formats through built-in serializers (`dotSeparated`, `commaSeparated`, `pipeSeparated`, `multiKey`).
- Integrate correctly across table-craft's 4-layer config system (Layer 1: Defaults → Layer 2: Provider → Layer 3: Instance → Layer 4: Plugins).
- Allow granular, column-level serializer overrides directly via definition.

## Non-Goals

- Refactoring the internal filter state mechanism. This RFC focuses strictly on the bridge between URL search parameters and table filter state.
- Overhauling general pagination or sorting search parameter representations.

## API Design

The API introduces the `FilterSerializer` interface and custom type extensions, alongside direct updates to configs.

### Types

```typescript
// New or modified types in types/table.ts
interface SerializedSingleKey {
  type: 'single'
  value: string
}

interface SerializedMultiKey {
  type: 'multi'
  values: string[]
}

type SerializedResult = SerializedSingleKey | SerializedMultiKey

interface FilterSerializer {
  parse(rawValue: string | null, allValues: string[]): string[]
  serialize(values: string[]): SerializedResult
}
```

The column API is extended to accept local overrides:

```typescript
export interface DataTableFilterableColumn<TData> {
  id: keyof TData
  title: string
  options: Option[]
  isSingleSelect?: boolean
  serializer?: FilterSerializer // Per-column override (Highest priority)
}
```

### Component API

How consumers would use the new feature at the instance level:

```tsx
// Example: Per-column serializer override
<DataTable
  filterableColumns={[
    {
      id: 'status',
      title: 'Status',
      options: statusOptions,
      serializer: commaSeparated, // this column uses comma
    },
    {
      id: 'tags',
      title: 'Tags',
      options: tagOptions,
      serializer: multiKey, // this column uses repeated keys (?tags=1&tags=2)
    },
    {
      id: 'priority',
      title: 'Priority',
      options: priorityOptions,
      // no serializer -> automatically flows back to the resolvedConfig.filter.defaultSerializer
    },
  ]}
/>

// Example: Global instance configuration (Layer 3)
<DataTable
  config={{ filter: { defaultSerializer: commaSeparated } }}
  filterableColumns={[...]}
/>
```

## Architecture Integration

The serializer implementation follows the established `resolvedConfig` pipeline.

### Config System

We adapt the `TableConfig` to introduce a sub-level `filter` key, respecting `deepMergeConfig`. This allows atomic replacement over all four layers.

```typescript
export interface TableFilterConfig {
  defaultSerializer: FilterSerializer
}

export interface TableConfig {
  // ... existing configuration properties
  filter: TableFilterConfig // NEW
}
```

In `config/defaults.ts` (Layer 1):

```typescript
export const DEFAULT_TABLE_CONFIG: Readonly<TableConfig> = Object.freeze({
  filter: Object.freeze({
    defaultSerializer: dotSeparated
  })
})
```

### Components

`data-table.tsx` will no longer hard-code the deserialization via string literals but instead run a standalone evaluation:

```typescript
function resolveSerializer(column: DataTableFilterableColumn<any>, config: TableConfig): FilterSerializer {
  return column.serializer ?? config.filter.defaultSerializer
}
```

And `createQueryString` will be updated to handle multi-key search parameters gracefully in case `result.type === 'multi'` is evaluated.

## Alternatives

| Approach                                                          | Pros                          | Cons                                                                                                            |
| ----------------------------------------------------------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Hardcoding more specific delimited checks (`split(',')`, `split(' | ')`)                          | Removes the need for abstraction or configuration integration                                                   | Extremely brittle. Fails completely with backend multi-key arrays. Fails to conform to the 4-layer config structure natively. |
| Global Serializer Only                                            | Easier implementation surface | Lacks granularity. Consumers could not use commas for `status` but multi-key for `tags` on the identical table. |

## Trade-offs

- **Bundle size:** Negligible. A single new interface definition and a small utility file for built-in serializers (`filter-serializers.ts`).
- **Complexity:** Small jump in learning curve for users configuring custom arrays format, but invisible to consumers leveraging defaults.
- **Performance:** Almost zero runtime cost; lookups evaluate via constant-time fallbacks.

## Backward Compatibility

- **Does this break any existing API?** No. Utilizing `dotSeparated` at Layer 1 assures previous query strings format `key=a.b.c` remain actively parsed verbatim.
- **Can this be adopted incrementally?** Yes. Tables that don't pass a custom config will just process exactly as they do today.
- **Migration path:** None strictly needed. If `value.join('.')` was problematic, they can now supply `multiKey` or other strategies out of the box.

## Open Questions

- [ ] Should we expand `FilterSerializer` in the future to handle non-array types (like numbers, booleans, or custom Date formats) across the codebase for consistency?
- [ ] Is there a need to provide PHP/Rails-style bracketed array serializers out of the box (`?key[]=a`), or should consumers implement this logic themselves via custom `FilterSerializer` instances?

## Adoption Plan

1. **Core Abstractions:** Implement `FilterSerializer` and `SerializedResult` interfaces in `types/table.ts` and add `TableFilterConfig` to the global `TableConfig`.
2. **Built-in Implementations:** Create the `serializers/filter-serializers.ts` file containing standard strategies (`dotSeparated`, `commaSeparated`, `pipeSeparated`, `multiKey`).
3. **Layer 1 Defaults:** Introduce the default `filter` configuration using `dotSeparated` globally in `config/defaults.ts` to ensure 100% backward compatibility.
4. **Data Table Integration:** Replace the hard-coded `.split('.')` and `.join('.')` logic within `data-table.tsx` by introducing a `resolveSerializer` utility, enabling dynamically resolved parsing and serialization.
5. **Documentation:** Document the new serializers' usage and mixed-strategy capabilities.
