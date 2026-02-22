'use client'

import * as React from 'react'
import { Check, ChevronDown, ListFilter, Rows3, Type } from 'lucide-react'
import { useTableTranslations } from '../../hooks/use-table-translations'

import type { DataTableFilterOption } from '../../types/table'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from '../ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover'

interface DataTableAdvancedFilterProps<TData> {
  options: DataTableFilterOption<TData>[]
  selectedOptions: DataTableFilterOption<TData>[]
  setSelectedOptions: React.Dispatch<
    React.SetStateAction<DataTableFilterOption<TData>[]>
  >
  children?: React.ReactNode
}

export function DataTableAdvancedFilter<TData>({
  options,
  selectedOptions,
  setSelectedOptions,
  children,
}: DataTableAdvancedFilterProps<TData>) {
  const [value, setValue] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const [selectedOption, setSelectedOption] = React.useState<
    DataTableFilterOption<TData> | undefined
  >(options[0])
  const t = useTableTranslations()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children ?? (
          <Button
            variant="outline"
            size="sm"
            role="combobox"
            className="h-9 gap-1.5"
          >
            <ListFilter className="size-4" />
            {t('Filter')}
            <ChevronDown className="size-3.5 opacity-50" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0" align="end">
        <Command>
          <CommandInput placeholder={t('filter-by')} />
          <CommandEmpty>{t('no-items-found')}</CommandEmpty>
          <CommandGroup heading={t('Filter')}>
            {options.map((option) => {
              const isSelected = selectedOptions.some(
                (sel) => sel.value === option.value && !sel.isMulti
              )

              return (
                <CommandItem
                  key={String(option.value)}
                  className="gap-2 capitalize"
                  value={String(option.value)}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue)
                    setOpen(false)
                    setSelectedOption(option)
                    setSelectedOptions((prev) => {
                      if (isSelected) {
                        return prev.filter(
                          (item) =>
                            item.value !== option.value || item.isMulti
                        )
                      } else {
                        return [...prev, option]
                      }
                    })
                  }}
                >
                  {option.items.length > 0 ? (
                    <Rows3 className="size-4 text-muted-foreground" />
                  ) : (
                    <Type className="size-4 text-muted-foreground" />
                  )}
                  <span className="flex-1">{option.label}</span>
                  {isSelected && (
                    <Check className="size-4 text-primary" />
                  )}
                </CommandItem>
              )
            })}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup>
            <CommandItem
              className="gap-2"
              onSelect={() => {
                setOpen(false)
                setSelectedOptions([
                  ...selectedOptions,
                  {
                    id: crypto.randomUUID(),
                    label: String(selectedOption?.label),
                    value: String(selectedOption?.value),
                    items: selectedOption?.items ?? [],
                    isMulti: true,
                  },
                ])
              }}
            >
              <Rows3 className="size-4 text-muted-foreground" />
              {t('advanced-filter')}
            </CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
