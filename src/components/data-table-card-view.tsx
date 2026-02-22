'use client'

import * as React from 'react'
import { flexRender, Table } from '@tanstack/react-table'
import { Card, CardContent } from './ui/card'
import { Checkbox } from './ui/checkbox'
import { useTableTranslations } from '../hooks/use-table-translations'
import { SearchX, RotateCcw } from 'lucide-react'
import { Button } from './ui/button'

interface DataTableCardViewProps<TData> {
  table: Table<TData>
}

export function DataTableCardView<TData>({ table }: DataTableCardViewProps<TData>) {
  const t = useTableTranslations()
  const rows = table.getRowModel().rows

  if (!rows.length) {
    return (
      <Card className="mt-3">
        <CardContent className="py-16">
          <div className="flex flex-col items-center gap-3">
            <SearchX className="size-10 text-muted-foreground/50" aria-hidden="true" />
            <div className="space-y-1 text-center">
              <p className="font-semibold">{t('no-records-found')}</p>
              <p className="text-sm text-muted-foreground">{t('no-records-hint')}</p>
            </div>
            {table.getState().columnFilters.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="mt-1 gap-1.5"
                onClick={() => table.resetColumnFilters()}
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
                {t('reset-filters')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((row) => {
        const visibleCells = row.getVisibleCells()
        return (
          <Card
            key={row.id}
            data-state={row.getIsSelected() && 'selected'}
            className="transition-colors data-[state=selected]:border-primary/50 data-[state=selected]:bg-primary/5"
          >
            <CardContent className="p-4">
              <div className="mb-3 flex items-center gap-2">
                <Checkbox
                  checked={row.getIsSelected()}
                  onCheckedChange={(value) => row.toggleSelected(!!value)}
                  aria-label={t('select')}
                  className="size-4"
                />
                <span className="text-xs text-muted-foreground">
                  #{row.index + 1}
                </span>
              </div>
              <div className="space-y-2">
                {visibleCells.map((cell) => {
                  if (cell.column.id === 'select') return null
                  const header = cell.column.columnDef.header
                  const headerLabel =
                    typeof header === 'string' ? header : cell.column.id
                  return (
                    <div key={cell.id} className="flex items-start justify-between gap-2">
                      <span className="text-xs font-medium text-muted-foreground capitalize shrink-0">
                        {headerLabel}
                      </span>
                      <span className="text-sm text-end">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
