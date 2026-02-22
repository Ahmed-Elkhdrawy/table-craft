import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Table } from '@tanstack/react-table'

import { cn } from '../lib/utils'
import { Button } from './ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { useTableTranslations } from '../hooks/use-table-translations'
import { useTableConfig } from '../config'
import { Pagination } from '../types/pagination'

type BaseProps<TData> = {
  table: Table<TData>
  pageSizeOptions?: number[]
}

type QueryPaginationProps<TData> = BaseProps<TData> & {
  isQueryPagination: true
  paginationData: {
    paginationResponse: Pagination
    onPageChange: (page: number) => void
    onPageSizeChange: (size: number) => void
  }
}

type LocalPaginationProps<TData> = BaseProps<TData> & {
  isQueryPagination?: false
  paginationData?: never | undefined
}

type DataTablePaginationProps<TData> = QueryPaginationProps<TData> | LocalPaginationProps<TData>

function getVisiblePages(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages: (number | 'ellipsis')[] = []

  if (currentPage <= 3) {
    pages.push(1, 2, 3, 4, 'ellipsis', totalPages)
  } else if (currentPage >= totalPages - 2) {
    pages.push(1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
  } else {
    pages.push(1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages)
  }

  return pages
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions,
  isQueryPagination = false,
  paginationData,
}: DataTablePaginationProps<TData>) {
  const t = useTableTranslations()
  const config = useTableConfig()
  const isArabic = config.i18n.direction === 'rtl' || (config.i18n.direction === 'auto' && config.i18n.locale === 'ar')
  const resolvedPageSizeOptions = pageSizeOptions ?? config.pagination.pageSizeOptions

  const currentPage = isQueryPagination
    ? (paginationData?.paginationResponse?.meta?.current_page ?? 1)
    : table.getState().pagination.pageIndex + 1
  const totalPages = isQueryPagination
    ? (paginationData?.paginationResponse?.meta?.last_page ?? 1)
    : table.getPageCount()
  const pageSize = isQueryPagination
    ? (paginationData?.paginationResponse?.meta?.per_page ?? 10)
    : table.getState().pagination.pageSize
  const totalItems = isQueryPagination
    ? (paginationData?.paginationResponse?.meta?.total ?? 0)
    : table.getFilteredRowModel().rows.length

  const from = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const to = Math.min(currentPage * pageSize, totalItems)

  const goToPage = (page: number) => {
    if (isQueryPagination && paginationData) {
      paginationData.onPageChange(page)
    } else {
      table.setPageIndex(page - 1)
    }
  }

  const visiblePages = getVisiblePages(currentPage, totalPages)

  return (
    <nav role="navigation" aria-label={t('pagination')} className="flex w-full flex-col gap-4 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-4">
        <p className="text-sm text-muted-foreground">
          {t('showing')}{' '}
          <span className="font-semibold text-foreground">{from}-{to}</span>{' '}
          {t('of')}{' '}
          <span className="font-semibold text-foreground">{totalItems}</span>{' '}
          {t('records')}
        </p>
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">{t('Rows Per Page')}</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              const newSize = Number(value)
              if (isQueryPagination && paginationData) {
                paginationData.onPageSizeChange(newSize)
              } else {
                table.setPageSize(newSize)
              }
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {resolvedPageSizeOptions.map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {totalPages > 0 && (
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 px-3 text-sm"
            onClick={(e) => {
              e.preventDefault()
              goToPage(currentPage - 1)
            }}
            disabled={currentPage === 1}
          >
            <ChevronLeft className={cn('size-4', isArabic && 'rotate-180')} />
            {t('previous')}
          </Button>

          <div className="hidden items-center gap-1 sm:flex">
            {visiblePages.map((page, idx) =>
              page === 'ellipsis' ? (
                <span key={`ellipsis-${idx}`} className="px-1 text-sm text-muted-foreground">
                  ...
                </span>
              ) : (
                <Button
                  key={page}
                  variant={page === currentPage ? 'default' : 'ghost'}
                  size="sm"
                  className={cn(
                    'size-8 p-0 text-sm',
                    page === currentPage && 'bg-brand text-brand-foreground hover:bg-brand/90'
                  )}
                  onClick={(e) => {
                    e.preventDefault()
                    goToPage(page)
                  }}
                  {...(page === currentPage ? { 'aria-current': 'page' } : {})}
                >
                  {page}
                </Button>
              )
            )}
          </div>

          <span className="text-sm text-muted-foreground sm:hidden">
            {currentPage} / {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 px-3 text-sm"
            onClick={(e) => {
              e.preventDefault()
              goToPage(currentPage + 1)
            }}
            disabled={currentPage === totalPages}
          >
            {t('next')}
            <ChevronRight className={cn('size-4', isArabic && 'rotate-180')} />
          </Button>
        </div>
      )}
    </nav>
  )
}
