'use client'

import { TrashIcon, X } from 'lucide-react'
import { type Table } from '@tanstack/react-table'

import { cn } from '../lib/utils'
import { Button } from './ui/button'
import { useTableTranslations } from '../hooks/use-table-translations'

interface DataTableFloatingBarProps<TData> extends React.HTMLAttributes<HTMLElement> {
  table: Table<TData>
  deleteRowsAction?: React.MouseEventHandler<HTMLButtonElement>
}

export function DataTableFloatingBar<TData>({
  table,
  deleteRowsAction,
  className,
  ...props
}: DataTableFloatingBarProps<TData>) {
  const t = useTableTranslations()
  if (table.getFilteredSelectedRowModel().rows.length <= 0) return null

  return (
    <div
      className={cn(
        'mx-auto flex w-fit items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-white',
        className
      )}
      {...props}
    >
      <Button
        aria-label={t('clear-selection')}
        title={t('clear-selection')}
        className="h-auto bg-transparent p-1 text-white hover:bg-zinc-700"
        onClick={() => table.toggleAllRowsSelected(false)}
      >
        <X className="size-4" aria-hidden="true" />
      </Button>
      <span>
        {table.getFilteredSelectedRowModel().rows.length} {t('row(s) selected')}
      </span>
      {deleteRowsAction && (
        <Button
          aria-label={t('delete-selected')}
          title={t('delete')}
          className="h-auto bg-transparent p-1 text-white hover:bg-zinc-700"
          onClick={(event) => {
            table.toggleAllPageRowsSelected(false)
            deleteRowsAction(event)
          }}
        >
          <TrashIcon className="size-4" aria-hidden="true" />
        </Button>
      )}
    </div>
  )
}
