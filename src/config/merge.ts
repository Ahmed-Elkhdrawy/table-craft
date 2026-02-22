import type { TableConfig, DeepPartial } from '../types/table-config'

/**
 * Deep-merge two config objects.
 * - Arrays replace entirely (not concatenated).
 * - `undefined` values in overrides are skipped.
 * - Only merges 2 levels deep (sufficient for TableConfig shape).
 */
export function deepMergeConfig(
  base: TableConfig,
  overrides: DeepPartial<TableConfig>
): TableConfig {
  const result = { ...base }

  for (const key of Object.keys(overrides) as (keyof TableConfig)[]) {
    const overrideValue = overrides[key]

    if (overrideValue === undefined) continue

    if (Array.isArray(overrideValue)) {
      // Arrays replace entirely
      ;(result as Record<string, unknown>)[key] = overrideValue
    } else if (
      overrideValue !== null &&
      typeof overrideValue === 'object' &&
      !Array.isArray(base[key]) &&
      typeof base[key] === 'object' &&
      base[key] !== null
    ) {
      // Deep merge one level for plain objects
      const baseObj = base[key] as unknown as Record<string, unknown>
      const overrideObj = overrideValue as unknown as Record<string, unknown>
      const merged = { ...baseObj }

      for (const subKey of Object.keys(overrideObj)) {
        if (overrideObj[subKey] !== undefined) {
          merged[subKey] = overrideObj[subKey]
        }
      }

      ;(result as Record<string, unknown>)[key] = merged
    } else {
      ;(result as Record<string, unknown>)[key] = overrideValue
    }
  }

  return result
}
