import { Check, CheckIcon } from 'lucide-react'
import { Column } from '@tanstack/react-table'
import { Filter } from 'lucide-react'
import { useTableTranslations } from '../hooks/use-table-translations'
import { useEffect, useState } from 'react'
import { cn } from '../lib/utils'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from './ui/command'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Separator } from './ui/separator'
import type { DataTableFilterableColumn, Option } from '../types/table'
import { FilterOptions } from '../types/filter-options'

interface DataTableFacetedFilterBase<TData, TValue> {
  title?: string
  options: Option[]
  variant?: 'popover' | 'command'
  className?: string
}

type QueryFilterProps<TData> = {
  isQueryFilter: true
  column?: DataTableFilterableColumn<TData>
  handleFilterChange: (key: keyof FilterOptions, value: string | undefined) => void
  currentValue?: string
}

type LocalFilterProps<TData, TValue> = {
  isQueryFilter?: false
  handleFilterChange?: never
  column?: Column<TData, TValue>
  currentValue?: never
}

type DataTableFacetedFilterProps<TData, TValue> = DataTableFacetedFilterBase<TData, TValue> &
  (QueryFilterProps<TData> | LocalFilterProps<TData, TValue>)

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  variant = 'popover',
  className,
  isQueryFilter = false,
  handleFilterChange,
  currentValue,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const t = useTableTranslations()
  const [selectedValues, setSelectedValues] = useState<Set<string>>(new Set())

  useEffect(() => {
    let filterValue: string[] = []

    if (isQueryFilter) {
      filterValue = currentValue ? [currentValue] : []
    } else if (column) {
      const columnFilterValue = (column as Column<TData, TValue>)?.getFilterValue()
      filterValue = Array.isArray(columnFilterValue) ? (columnFilterValue as string[]) : []
    }

    setSelectedValues(new Set(filterValue))
  }, [currentValue, column, isQueryFilter])

  const handleValueChange = (value: string) => {
    if (isQueryFilter) {
      setSelectedValues(new Set([value]))
    } else {
      const newSelectedValues = new Set(selectedValues)
      if (newSelectedValues.has(value)) {
        newSelectedValues.delete(value)
      } else {
        newSelectedValues.add(value)
      }
      setSelectedValues(newSelectedValues)
    }

    if (isQueryFilter && handleFilterChange && column) {
      handleFilterChange(String(column.id), value)
    } else if (!isQueryFilter && column) {
      const newSelectedValues = new Set(selectedValues)
      if (newSelectedValues.has(value)) {
        newSelectedValues.delete(value)
      } else {
        newSelectedValues.add(value)
      }
      const filterValues = Array.from(newSelectedValues)
      const finalValue = filterValues.length > 0 ? filterValues : undefined
      ;(column as Column<TData, TValue>).setFilterValue(finalValue)
    }
  }

  const clearFilters = () => {
    if (isQueryFilter && handleFilterChange && column) {
      handleFilterChange(String(column.id), undefined)
    } else if (!isQueryFilter && column) {
      ;(column as Column<TData, TValue>).setFilterValue(undefined)
    }
  }

  const renderBadges = () => {
    if (selectedValues.size === 0) return null

    const filteredOptions = options.filter((option) => selectedValues.has(option.value))

    return (
      <>
        <Separator orientation="vertical" className="mx-2 h-4" />
        <div className="flex space-x-1">
          {filteredOptions.map((option) => (
            <Badge variant="secondary" key={option.value} className="rounded-sm px-1 font-normal">
              {option.label}
            </Badge>
          ))}
        </div>
      </>
    )
  }

  const renderCommandItems = () => (
    <>
      <CommandGroup>
        {options.map((option) => {
          const isSelected = selectedValues.has(option.value)
          return (
            <CommandItem key={option.value} onSelect={() => handleValueChange(option.value)}>
              <div
                className={cn(
                  'me-2 flex size-4 items-center justify-center rounded-sm border border-primary',
                  isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
                )}
              >
                <Check className={cn('size-4')} aria-hidden="true" />
              </div>
              {option.icon && (
                <option.icon className="me-2 size-4 text-muted-foreground" aria-hidden="true" />
              )}
              <span>{option.label}</span>
            </CommandItem>
          )
        })}
      </CommandGroup>
      {selectedValues.size > 0 && (
        <>
          <CommandSeparator />
          <CommandGroup>
            <CommandItem onSelect={clearFilters} className="justify-center text-center">
              {t('clear-filters')}
            </CommandItem>
          </CommandGroup>
        </>
      )}
    </>
  )

  if (variant === 'command') {
    return (
      <Command className="p-1">
        <CommandInput
          placeholder={title}
          autoFocus
          className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
        <CommandList className="mt-1">
          <CommandEmpty>{t('no-items-found')}</CommandEmpty>
          {renderCommandItems()}
        </CommandList>
      </Command>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className={`${className} h-8 border-dashed`}>
          <Filter className="me-2 size-4" />
          {title}
          {renderBadges()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>{t('no-items-found')}</CommandEmpty>
            {renderCommandItems()}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
