import * as React from 'react'
import { Trash2, X } from 'lucide-react'
import type { Table } from '@tanstack/react-table'

import type { DataTableFilterOption } from '../../types/table'
import { cn } from '../../lib/utils'
import { useDebounce } from '../../hooks/use-debounce'
import { useTableConfig } from '../../config'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

import { DataTableFacetedFilter } from '../data-table-faceted-filter'

interface DataTableAdvancedFilterItemProps<TData> {
  table: Table<TData>
  selectedOption: DataTableFilterOption<TData>
  setSelectedOptions: React.Dispatch<
    React.SetStateAction<DataTableFilterOption<TData>[]>
  >
}

export function DataTableAdvancedFilterItem<TData>({
  table,
  selectedOption,
  setSelectedOptions,
}: DataTableAdvancedFilterItemProps<TData>) {
  const config = useTableConfig()
  const router = config.router
  const searchParams = router ? router.getSearchParams() : new URLSearchParams()
  const pathname = router ? router.getPathname() : ''

  const [value, setValue] = React.useState('')
  const debounceValue = useDebounce(value, 500)
  const [open, setOpen] = React.useState(true)

  const selectedValues =
    selectedOption.items.length > 0
      ? Array.from(
          new Set(
            table
              .getColumn(String(selectedOption.value))
              ?.getFilterValue() as string[]
          )
        )
      : []

  const filterVarieties =
    selectedOption.items.length > 0
      ? ['is', 'is not']
      : ['contains', 'does not contain', 'is', 'is not']

  const [filterVariety, setFilterVariety] = React.useState(filterVarieties[0])

  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString())

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key)
        } else {
          newSearchParams.set(key, String(value))
        }
      }

      return newSearchParams.toString()
    },
    [searchParams]
  )

  React.useEffect(() => {
    if (!router) return

    if (debounceValue.length > 0) {
      router.push(
        `${pathname}?${createQueryString({
          [selectedOption.value]: `${debounceValue}${
            debounceValue.length > 0 ? `.${filterVariety}` : ''
          }`,
        })}`
      )
    }

    if (debounceValue.length === 0) {
      router.push(
        `${pathname}?${createQueryString({
          [selectedOption.value]: null,
        })}`
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceValue, filterVariety, selectedOption.value])

  const handleRemove = () => {
    if (router) {
      router.push(
        `${pathname}?${createQueryString({
          [selectedOption.value]: null,
        })}`
      )
    }
    setSelectedOptions((prev) =>
      prev.filter((item) => item.value !== selectedOption.value)
    )
  }

  const hasValue = value.length > 0 || selectedValues.length > 0

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'h-8 gap-1.5 rounded-full border-dashed',
            hasValue && 'border-solid border-primary/30 bg-primary/5 text-primary hover:bg-primary/10'
          )}
        >
          <span className="font-medium capitalize">
            {selectedOption.label}
          </span>
          {hasValue && (
            <>
              <span className="text-muted-foreground">
                {filterVariety}
              </span>
              {selectedValues.length > 0 ? (
                <span className="font-semibold">
                  {selectedValues.length > 2
                    ? `${selectedValues.length} selected`
                    : selectedValues.join(', ')}
                </span>
              ) : (
                <span className="max-w-[100px] truncate font-semibold">{value}</span>
              )}
            </>
          )}
          <X
            className="size-3.5 shrink-0 opacity-50 hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation()
              handleRemove()
            }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 space-y-2 p-3 text-xs" align="start">
        <div className="flex items-center gap-1.5">
          <span className="shrink-0 text-sm font-medium capitalize">{selectedOption.label}</span>
          <Select onValueChange={(value) => setFilterVariety(value)}>
            <SelectTrigger className="h-7 w-fit shrink-0 gap-1 rounded-md border-none bg-muted/50 px-2 text-xs font-medium hover:bg-muted">
              <SelectValue placeholder={filterVarieties[0]} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {filterVarieties.map((variety) => (
                  <SelectItem key={variety} value={variety} className="text-xs">
                    {variety}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="flex-1" />
          <Button
            aria-label="Remove filter"
            variant="ghost"
            size="icon"
            className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
            onClick={handleRemove}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
        {selectedOption.items.length > 0 ? (
          table.getColumn(
            selectedOption.value ? String(selectedOption.value) : ''
          ) && (
            <DataTableFacetedFilter
              key={String(selectedOption.value)}
              column={table.getColumn(
                selectedOption.value ? String(selectedOption.value) : ''
              )}
              title={selectedOption.label}
              options={selectedOption.items}
              variant="command"
            />
          )
        ) : (
          <Input
            placeholder="Type here..."
            className="h-8 text-xs"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            autoFocus
          />
        )}
      </PopoverContent>
    </Popover>
  )
}
