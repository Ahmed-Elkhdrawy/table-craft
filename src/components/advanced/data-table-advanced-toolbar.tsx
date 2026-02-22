'use client'

import * as React from 'react'
import type { Table } from '@tanstack/react-table'
import { ListFilter, Plus, RotateCcw, Search, X } from 'lucide-react'
import { useTableTranslations } from '../../hooks/use-table-translations'
import { useTableConfig } from '../../config'

import type {
  DataTableFilterableColumn,
  DataTableFilterOption,
  DataTableSearchableColumn,
} from '../../types/table'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

import { DataTableViewOptions } from '../data-table-view-options'
import { DataTableAdvancedFilter } from './data-table-advanced-filter'
import { DataTableAdvancedFilterItem } from './data-table-advanced-filter-item'
import { DataTableMultiFilter } from './data-table-multi-filter'

interface DataTableAdvancedToolbarProps<TData> {
  table: Table<TData>
  searchableColumns?: DataTableSearchableColumn<TData>[]
  filterableColumns?: DataTableFilterableColumn<TData>[]
  addItemPagePath?: string
}

export function DataTableAdvancedToolbar<TData>({
  table,
  filterableColumns = [],
  searchableColumns = [],
  addItemPagePath,
}: DataTableAdvancedToolbarProps<TData>) {
  const [selectedOptions, setSelectedOptions] = React.useState<
    DataTableFilterOption<TData>[]
  >([])
  const [open, setOpen] = React.useState(false)
  const t = useTableTranslations()
  const config = useTableConfig()
  const router = config.router

  React.useEffect(() => {
    if (selectedOptions.length > 0) {
      setOpen(true)
    }
  }, [selectedOptions])

  const options: DataTableFilterOption<TData>[] = React.useMemo(() => {
    const searchableOptions = searchableColumns.map((column) => ({
      id: crypto.randomUUID(),
      label: column.title ?? String(column.id),
      value: column.id,
      items: [],
    }))
    const filterableOptions = filterableColumns.map((column) => ({
      id: crypto.randomUUID(),
      label: column.title,
      value: column.id,
      items: column.options,
    }))

    return [...searchableOptions, ...filterableOptions]
  }, [filterableColumns, searchableColumns])

  const goAddItemPage = () => {
    if (addItemPagePath && router) {
      router.push(addItemPagePath)
    }
  }

  const handleClearAll = () => {
    setSelectedOptions([])
    setOpen(false)
    for (const col of searchableColumns) {
      table.getColumn(String(col.id))?.setFilterValue('')
    }
    for (const col of filterableColumns) {
      table.getColumn(String(col.id))?.setFilterValue(undefined)
    }
  }

  const hasActiveFilters = selectedOptions.length > 0 ||
    searchableColumns.some(
      (col) => !!(table.getColumn(String(col.id))?.getFilterValue() as string)
    )

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-3">
          {searchableColumns.length > 0 &&
            searchableColumns.map(
              (column) =>
                table.getColumn(column.id ? String(column.id) : '') && (
                  <div className="relative flex-1 max-w-sm" key={String(column.id)}>
                    <Search className="absolute start-3 top-2.5 size-4 text-muted-foreground" />
                    <Input
                      placeholder={`${t('Filter')} ${column.title ?? String(column.id)}...`}
                      value={
                        (table
                          .getColumn(String(column.id))
                          ?.getFilterValue() as string) ?? ''
                      }
                      onChange={(event) =>
                        table
                          .getColumn(String(column.id))
                          ?.setFilterValue(event.target.value)
                      }
                      className="ps-9"
                    />
                  </div>
                )
            )}
        </div>

        <div className="flex items-center gap-2">
          {selectedOptions.length > 0 ? (
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1.5"
              onClick={() => setOpen((prev) => !prev)}
            >
              <ListFilter className="size-4" />
              {t('Filter')}
              <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {selectedOptions.length}
              </span>
            </Button>
          ) : (
            <DataTableAdvancedFilter
              options={options.filter(
                (option) =>
                  !selectedOptions.some(
                    (selectedOption) => selectedOption.value === option.value
                  )
              )}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
            />
          )}
          <DataTableViewOptions table={table} />
          {addItemPagePath && (
            <Button
              onClick={goAddItemPage}
              size="sm"
              className="h-9"
            >
              <Plus className="size-4" />
              {t('add')}
            </Button>
          )}
        </div>
      </div>

      {open && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            {t('filter-by')}
          </span>

          {selectedOptions.some((option) => option.isMulti) && (
            <DataTableMultiFilter
              table={table}
              allOptions={options}
              options={selectedOptions.filter((option) => option.isMulti)}
              setSelectedOptions={setSelectedOptions}
            />
          )}

          {selectedOptions
            .filter((option) => !option.isMulti)
            .map((selectedOption) => (
              <DataTableAdvancedFilterItem
                key={String(selectedOption.value)}
                table={table}
                selectedOption={selectedOption}
                setSelectedOptions={setSelectedOptions}
              />
            ))}

          <DataTableAdvancedFilter
            options={options}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
          >
            <Button
              variant="outline"
              size="sm"
              role="combobox"
              className="h-8 gap-1.5 rounded-full border-dashed text-muted-foreground hover:text-foreground"
            >
              <Plus className="size-3.5" />
              {t('add-filter')}
            </Button>
          </DataTableAdvancedFilter>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
              onClick={handleClearAll}
            >
              <RotateCcw className="size-3.5" />
              {t('Reset')}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
