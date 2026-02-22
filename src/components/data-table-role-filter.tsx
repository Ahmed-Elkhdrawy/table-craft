'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Column } from '@tanstack/react-table'
import { useTableTranslations } from '../hooks/use-table-translations'
import { useTableConfig } from '../config'

import { cn } from '../lib/utils'
import { Button } from './ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from './ui/command'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Badge } from './ui/badge'

interface DataTableRoleFilterProps<TData> {
  column?: Column<TData, unknown>
  title?: string
  options: {
    label: string
    value: string
  }[]
  paramKey?: string
}

export function DataTableRoleFilter<TData>({
  column,
  title,
  options,
  paramKey,
}: DataTableRoleFilterProps<TData>) {
  const config = useTableConfig()
  const router = config.router
  const t = useTableTranslations()

  const resolvedParamKey = paramKey ?? (column ? String(column.id) : 'role')

  // Get current value from URL params via router adapter, or fall back to column filter
  const searchParams = router ? router.getSearchParams() : new URLSearchParams()
  const currentValue = router
    ? (searchParams.get(resolvedParamKey) || undefined)
    : (column?.getFilterValue() as string | undefined)

  const handleSelect = (value: string | undefined) => {
    if (router) {
      const newParams = new URLSearchParams(searchParams.toString())
      if (value) {
        newParams.set(resolvedParamKey, value)
      } else {
        newParams.delete(resolvedParamKey)
      }
      newParams.set('page', '1')
      router.push(`?${newParams.toString()}`)
    }
    column?.setFilterValue(value)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <ChevronsUpDown className="me-2 h-4 w-4 opacity-50" />
          {title}
          {currentValue && (
            <>
              <span className="mx-2 text-muted-foreground">|</span>
              <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                {options.find((opt) => opt.value === currentValue)?.label}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={`${t('Filter')} ${title}...`} />
          <CommandEmpty>{t('no-items-found')}</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            <CommandItem onSelect={() => handleSelect(undefined)} className="cursor-pointer">
              <div
                className={cn(
                  'me-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                  !currentValue
                    ? 'bg-primary text-primary-foreground'
                    : 'opacity-50 [&_svg]:invisible'
                )}
              >
                <Check className="h-4 w-4" />
              </div>
              <span>{t('all')}</span>
            </CommandItem>

            {options.map((option) => {
              const isSelected = currentValue === option.value

              return (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className="cursor-pointer"
                >
                  <div
                    className={cn(
                      'me-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'opacity-50 [&_svg]:invisible'
                    )}
                  >
                    <Check className="h-4 w-4" />
                  </div>
                  <span>{option.label}</span>
                </CommandItem>
              )
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
