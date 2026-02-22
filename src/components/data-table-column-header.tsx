import { ArrowUp, ArrowDown, ArrowDownIcon, ArrowUpIcon, SortAsc, EyeOffIcon } from 'lucide-react'
import { type Column } from '@tanstack/react-table'
import { useTableTranslations } from '../hooks/use-table-translations'

import { cn } from '../lib/utils'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const t = useTableTranslations()

  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label={
              column.getIsSorted() === 'desc'
                ? t('sorted-desc')
                : column.getIsSorted() === 'asc'
                  ? t('sorted-asc')
                  : t('not-sorted')
            }
            variant="ghost"
            size="sm"
            className="-ms-3 h-8 data-[state=open]:bg-accent"
          >
            <span>{title}</span>
            {column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ms-2 size-4" aria-hidden="true" />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ms-2 size-4" aria-hidden="true" />
            ) : (
              <SortAsc className="ms-2 size-4" aria-hidden="true" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem aria-label={t('sort-ascending')} onClick={() => column.toggleSorting(false)}>
            <ArrowUpIcon className="me-2 size-3.5 text-muted-foreground/70" aria-hidden="true" />
            {t('asc')}
          </DropdownMenuItem>
          <DropdownMenuItem aria-label={t('sort-descending')} onClick={() => column.toggleSorting(true)}>
            <ArrowDownIcon className="me-2 size-3.5 text-muted-foreground/70" aria-hidden="true" />
            {t('desc')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem aria-label={t('hide-column')} onClick={() => column.toggleVisibility(false)}>
            <EyeOffIcon className="me-2 size-3.5 text-muted-foreground/70" aria-hidden="true" />
            {t('Hide')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
