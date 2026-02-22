'use client'

import React from 'react'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Columns3 } from 'lucide-react'
import { Table } from '@tanstack/react-table'

import { cn } from '../lib/utils'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from './ui/dropdown-menu'
import { useTableTranslations } from '../hooks/use-table-translations'
import { useTableConfig } from '../config'

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

export function DataTableViewOptions<TData>({ table }: DataTableViewOptionsProps<TData>) {
  const t = useTableTranslations()
  const config = useTableConfig()
  const language = config.i18n.direction === 'rtl' || (config.i18n.direction === 'auto' && config.i18n.locale === 'ar') ? 'ar' : 'en'
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex h-9 items-center justify-center gap-2 px-4"
        >
          {t('columns')}
          <Columns3 className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-sm">
        <DropdownMenuLabel
          style={{
            direction: language === 'ar' ? 'rtl' : 'ltr',
          }}
        >
          {t('Toggle-Visibility')}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="cursor-pointer capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                style={{
                  direction: language === 'ar' ? 'rtl' : 'ltr',
                }}
              >
                {typeof column.columnDef.header === 'string'
                  ? String(column.columnDef.header)
                  : column.id}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
