import { Check, PlusCircle } from 'lucide-react'
import { Column } from '@tanstack/react-table'
import { useTableTranslations } from '../hooks/use-table-translations'
import { useEffect, useState } from 'react'
import { cn } from '../lib/utils'
import { Button } from './ui/button'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from './ui/command'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Separator } from './ui/separator'
import { Badge } from './ui/badge'
import type { DataTableFilterableColumn, Option } from '../types/table'
import { FilterOptions } from '../types/filter-options'

interface DataTableSingleSelectFilterBase<TData, TValue> {
  title?: string
  options: Option[]
  className?: string
  placeholder?: string
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

type DataTableSingleSelectFilterProps<TData, TValue> = DataTableSingleSelectFilterBase<
  TData,
  TValue
> &
  (QueryFilterProps<TData> | LocalFilterProps<TData, TValue>)

export function DataTableSingleSelectFilter<TData, TValue>({
  column,
  title,
  options,
  className,
  isQueryFilter = false,
  handleFilterChange,
  currentValue,
}: DataTableSingleSelectFilterProps<TData, TValue>) {
  const t = useTableTranslations()
  const [open, setOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState<string>('')

  const columnFilterValue =
    column && 'getFilterValue' in column
      ? (column as Column<TData, TValue>).getFilterValue()
      : undefined

  useEffect(() => {
    let filterValue = ''

    if (isQueryFilter) {
      filterValue = currentValue || ''
    } else if (column) {
      if (Array.isArray(columnFilterValue) && columnFilterValue.length > 0) {
        filterValue = (columnFilterValue[0] as string) || ''
      } else if (typeof columnFilterValue === 'string') {
        filterValue = columnFilterValue
      } else {
        filterValue = ''
      }
    }

    setSelectedValue(filterValue)
  }, [currentValue, column, isQueryFilter, columnFilterValue])

  const handleValueChange = (value: string) => {
    const newValue = value === selectedValue ? '' : value

    setSelectedValue(newValue)
    setOpen(false)

    if (isQueryFilter && handleFilterChange && column) {
      handleFilterChange(String(column.id), newValue || undefined)
    } else if (!isQueryFilter && column) {
      const filterValue = newValue ? [newValue] : undefined
      ;(column as Column<TData, TValue>).setFilterValue(filterValue)
    }
  }

  const selectedOptionLabel = options.find((option) => option.value === selectedValue)?.label

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn('h-8 border-dashed', className)}
        >
          <PlusCircle className="me-2 h-4 w-4" />
          {title}
          {selectedValue && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                1
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                  {selectedOptionLabel}
                </Badge>
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem onSelect={() => handleValueChange('')} className="justify-between">
                {t('all') || 'All'}
                <Check
                  className={cn('h-4 w-4', selectedValue === '' ? 'opacity-100' : 'opacity-0')}
                />
              </CommandItem>

              <CommandSeparator />

              {options.map((option) => {
                const isSelected = selectedValue === option.value
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleValueChange(option.value)}
                    className="justify-between"
                  >
                    <div className="flex items-center">
                      {option.icon && (
                        <option.icon
                          className="me-2 h-4 w-4 text-muted-foreground"
                          aria-hidden="true"
                        />
                      )}
                      <span>{option.label}</span>
                    </div>
                    <Check className={cn('h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')} />
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
