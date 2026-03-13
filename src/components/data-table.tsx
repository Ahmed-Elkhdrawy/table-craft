'use client'

import * as React from 'react'

const EMPTY_DATA: never[] = []
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'

import type {
  DataTableFilterableColumn,
  DataTableQuerySearchable,
  DataTableSearchableColumn,
} from '../types/table'
import { FilterOptions } from '../types/filter-options'
import { useDebounce } from '../hooks/use-debounce'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import { DataTablePagination } from './data-table-pagination'
import { DataTableToolbar, ViewMode } from './data-table-toolbar'
import { DataTableCardView } from './data-table-card-view'
import { DataTableAdvancedToolbar } from './advanced/data-table-advanced-toolbar'

import { CustomButtonProps } from './table-actions-row'
import { DataTableMobileToolbar } from './data-table-mobile-toolbar'
import { useTableTranslations } from '../hooks/use-table-translations'
import { useResolvedTableConfig } from '../config'
import type { TableConfigInput } from '../types/table-config'
import { Card, CardContent } from './ui/card'
import { Pagination, CursorPaginationData } from '../types/pagination'
import { SearchX, RotateCcw } from 'lucide-react'
import { Button } from './ui/button'
import { ResolvedTableConfigContext } from '../config/context'
import { Skeleton } from './ui/skeleton'

type BaseProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount?: number
  pageSize?: number
  filterableColumns?: DataTableFilterableColumn<TData>[]
  showFilter?: boolean
  showPagination?: boolean
  floatingBar?: boolean
  addItemPagePath?: {
    url: string
    text?: string
  }
  deleteRowsAction?: React.MouseEventHandler<HTMLButtonElement>
  isShowExportButtons?: {
    isShow: boolean
    ignoredCols?: string[]
    fileName?: string
  }
  customButtons?: CustomButtonProps[] | React.ReactElement
  isLoading?: boolean
  customCss?: string
  isShowAdvancedFilter?: boolean
  config?: TableConfigInput
}

type QueryFilterProps<TData, TValue> = {
  isQueryFilter: true
  handleFilterChange: (key: keyof FilterOptions, value: string | number | undefined) => void
  filterableQuery: DataTableFilterableColumn<TData>[]
  filterableColumns?: never
  currentFilters?: FilterOptions
  onClearFilters?: () => void
}

type LocalFilterProps<TData, TValue> = {
  isQueryFilter?: false
  handleFilterChange?: never
  filterableQuery?: never
  filterableColumns?: DataTableFilterableColumn<TData>[]
  currentFilters?: never
  onClearFilters?: never
}

type QuerySearchProps<TData, TValue> = {
  isQuerySearch: true
  searchableQuery: DataTableQuerySearchable<TData>[]
  searchableColumns?: never
}

type LocalSearchProps<TData, TValue> = {
  isQuerySearch?: false
  searchableQuery?: never
  searchableColumns?: DataTableSearchableColumn<TData>[]
}

type QueryPaginationProps<TData, TValue> = {
  isQueryPagination: true
  paginationData: {
    paginationResponse: Pagination
    onPageChange: (page: number) => void
    onPageSizeChange: (size: number) => void
  }
  isCursorPagination?: never
  cursorPaginationData?: never
}
type LocalPaginationProps<TData, TValue> = {
  isQueryPagination?: false
  paginationData?: never
  isCursorPagination?: never
  cursorPaginationData?: never
}
type CursorPaginationProps<TData, TValue> = {
  isCursorPagination: true
  cursorPaginationData: CursorPaginationData
  isQueryPagination?: never
  paginationData?: never
}

type DataTableProps<TData, TValue> = BaseProps<TData, TValue> &
  (QuerySearchProps<TData, TValue> | LocalSearchProps<TData, TValue>) &
  (QueryPaginationProps<TData, TValue> | LocalPaginationProps<TData, TValue> | CursorPaginationProps<TData, TValue>) &
  (QueryFilterProps<TData, TValue> | LocalFilterProps<TData, TValue>)

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pageSize: defaultPageSize,
  filterableColumns = [],
  searchableColumns = [],
  showFilter,
  showPagination,
  floatingBar,
  deleteRowsAction,
  addItemPagePath,
  isShowExportButtons = {
    isShow: true,
    ignoredCols: [],
    fileName: '',
  },
  customButtons,
  isQueryPagination = false,
  paginationData,
  isCursorPagination,
  cursorPaginationData,
  isQuerySearch = false,
  searchableQuery = [],
  isLoading,
  isQueryFilter = false,
  handleFilterChange,
  filterableQuery,
  currentFilters,
  onClearFilters,
  customCss,
  isShowAdvancedFilter,
  config: instanceConfig,
}: DataTableProps<TData, TValue>) {
  const t = useTableTranslations()
  const resolvedConfig = useResolvedTableConfig(instanceConfig)
  const router = resolvedConfig.router


  // Resolve prop vs config
  const shouldShowFilter = showFilter ?? resolvedConfig.features.filter
  const shouldShowPagination = showPagination ?? resolvedConfig.features.pagination
  const shouldShowFloatingBar = floatingBar ?? resolvedConfig.features.floatingBar
  const shouldShowAdvancedFilter = isShowAdvancedFilter ?? resolvedConfig.features.advancedFilter
  const resolvedPageSize = defaultPageSize ?? resolvedConfig.pagination.defaultPageSize

  const isManualFiltering = isQuerySearch || isQueryFilter
  const isManualPagination = isQueryPagination || isCursorPagination
  const isManualSorting = isQueryPagination || isCursorPagination || isQuerySearch || isQueryFilter

  // Read URL params via router adapter (or use defaults)
  const searchParams = router ? router.getSearchParams() : new URLSearchParams()
  const pathname = router ? router.getPathname() : ''

  const page = searchParams.get('page') ?? '1'
  const pageAsNumber = Number(page)
  const fallbackPage = isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber
  const per_page = searchParams.get('per_page') ?? '10'
  const perPageAsNumber = Number(per_page)
  const fallbackPerPage = isNaN(perPageAsNumber) ? resolvedPageSize : perPageAsNumber
  const sort = searchParams.get('sort')
  const [column, order] = sort?.split('.') ?? []

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

  const [viewMode, setViewMode] = React.useState<ViewMode>('table')
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const initializeColumnFilters = React.useCallback((): ColumnFiltersState => {
    const filters: ColumnFiltersState = []
    if (!isQuerySearch && searchableColumns.length > 0) {
      for (const col of searchableColumns) {
        const urlValue = searchParams.get(String(col.id))
        if (urlValue) {
          filters.push({ id: String(col.id), value: urlValue })
        }
      }
    }
    if (!isQueryFilter && filterableColumns.length > 0) {
      for (const col of filterableColumns) {
        const urlValue = searchParams.get(String(col.id))
        if (urlValue) {
          filters.push({ id: String(col.id), value: urlValue.split('.') })
        }
      }
    }
    return filters
  }, [searchParams, searchableColumns, filterableColumns, isQuerySearch, isQueryFilter])

  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>(initializeColumnFilters)

  React.useEffect(() => {
    const urlFilters = initializeColumnFilters()
    setColumnFilters((prevFilters) => {
      const urlFilterString = JSON.stringify(urlFilters)
      const prevFilterString = JSON.stringify(prevFilters)
      if (urlFilterString !== prevFilterString) {
        return urlFilters
      }
      return prevFilters
    })
  }, [initializeColumnFilters])

  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: fallbackPage - 1,
    pageSize: fallbackPerPage,
  })

  const pagination = React.useMemo(
    () => ({ pageIndex, pageSize }),
    [pageIndex, pageSize]
  )

  React.useEffect(() => {
    setPagination({
      pageIndex: fallbackPage - 1,
      pageSize: fallbackPerPage,
    })
  }, [fallbackPage, fallbackPerPage])

  // Sync pagination to URL via router adapter
  const paginationMountRef = React.useRef(true)
  React.useEffect(() => {
    if (isQueryPagination || isCursorPagination || !router) return
    if (paginationMountRef.current) {
      paginationMountRef.current = false
      return
    }
    const replaceUrl = router.replace || router.push
    replaceUrl(`${pathname}?${createQueryString({ page: pageIndex + 1, per_page: pageSize })}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize, isQueryPagination, isCursorPagination])

  const [sorting, setSorting] = React.useState<SortingState>(
    column ? [{ id: column, desc: order === 'desc' }] : []
  )

  const sortingMountRef = React.useRef(true)
  React.useEffect(() => {
    if (!router) return
    if (sortingMountRef.current) {
      sortingMountRef.current = false
      return
    }
    const replaceUrl = router.replace || router.push
    replaceUrl(
      `${pathname}?${createQueryString({
        page,
        sort: sorting[0]?.id ? `${sorting[0]?.id}.${sorting[0]?.desc ? 'desc' : 'asc'}` : null,
      })}`
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting])

  const searchableColumnFilters = React.useMemo(
    () => columnFilters.filter((filter) => searchableColumns.find((col) => col.id === filter.id)),
    [columnFilters, searchableColumns]
  )

  const debouncedSearchableColumnFilters = useDebounce(searchableColumnFilters, resolvedConfig.search.debounceMs)

  const filterableColumnFilters = React.useMemo(
    () => columnFilters.filter((filter) => filterableColumns.find((col) => col.id === filter.id)),
    [columnFilters, filterableColumns]
  )

  const debouncedSearchableString = JSON.stringify(debouncedSearchableColumnFilters)
  const filterableString = JSON.stringify(filterableColumnFilters)

  // Sync searchable filters to URL
  React.useEffect(() => {
    if (isQuerySearch || !router) return

    const currentDebouncedFilters = JSON.parse(debouncedSearchableString) as ColumnFiltersState
    const updates: Record<string, string | number | null> = {}
    let hasChanges = false

    for (const col of currentDebouncedFilters) {
      if (typeof col.value === 'string' && col.value.trim()) {
        const newValue = col.value.trim()
        updates[col.id] = newValue
        if (searchParams.get(String(col.id)) !== newValue) {
          hasChanges = true
        }
      }
    }

    for (const key of Array.from(searchParams.keys())) {
      if (
        searchableColumns.find((col) => String(col.id) === key) &&
        !currentDebouncedFilters.find((col) => col.id === key)
      ) {
        updates[key] = null
        hasChanges = true
      }
    }

    if (hasChanges) {
      updates.page = 1
    }

    const newQueryString = createQueryString(updates)
    const currentQueryString = searchParams.toString() || ''

    if (newQueryString !== currentQueryString && hasChanges) {
      const replaceUrl = router.replace || router.push
      replaceUrl(`${pathname}?${newQueryString}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchableString, isQuerySearch])

  // Sync filterable filters to URL
  React.useEffect(() => {
    if (isQueryFilter || !router) return

    const currentFilterableFilters = JSON.parse(filterableString) as ColumnFiltersState
    const updates: Record<string, string | number | null> = {}
    let hasChanges = false

    for (const col of currentFilterableFilters) {
      if (
        typeof col.value === 'object' &&
        Array.isArray(col.value) &&
        col.value.length > 0
      ) {
        const newValue = col.value.join('.')
        updates[col.id] = newValue
        if (searchParams.get(String(col.id)) !== newValue) {
          hasChanges = true
        }
      }
    }

    for (const key of Array.from(searchParams.keys())) {
      if (
        filterableColumns.find((col) => String(col.id) === key) &&
        !currentFilterableFilters.find((col) => col.id === key)
      ) {
        updates[key] = null
        hasChanges = true
      }
    }

    if (hasChanges) {
      updates.page = 1
    }

    const newQueryString = createQueryString(updates)
    const currentQueryString = searchParams.toString() || ''

    if (newQueryString !== currentQueryString && hasChanges) {
      const replaceUrl = router.replace || router.push
      replaceUrl(`${pathname}?${newQueryString}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterableString, isQueryFilter])

  const table = useReactTable({
    data: data ?? EMPTY_DATA,
    columns,
    pageCount: pageCount ?? -1,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: resolvedConfig.features.rowSelection,
    enableSorting: resolvedConfig.features.sorting,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: isManualPagination,
    manualSorting: isManualSorting,
    manualFiltering: isManualFiltering,
  })

  return (
    <ResolvedTableConfigContext.Provider value={resolvedConfig}>
      {shouldShowFilter ? (
        <>
          <div className="max-md:hidden">
            {shouldShowAdvancedFilter && !isQuerySearch && !isQueryFilter ? (
              <DataTableAdvancedToolbar
                table={table}
                searchableColumns={searchableColumns}
                filterableColumns={filterableColumns}
                addItemPagePath={addItemPagePath?.url}
              />
            ) : (
              <DataTableToolbar
                table={table}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                addItemPagePath={addItemPagePath}
                isShowExportButtons={isShowExportButtons}
                customButtons={customButtons}
                customCss={customCss}
                {...(isQuerySearch === true
                  ? {
                      isQuerySearch: isQuerySearch,
                      searchableQuery: searchableQuery,
                    }
                  : {
                      isQuerySearch: isQuerySearch,
                      searchableColumns: searchableColumns,
                    })}
                {...(isQueryFilter && handleFilterChange
                  ? {
                      isQueryFilter: true as const,
                      handleFilterChange,
                      filterableQuery: filterableQuery || [],
                      currentFilters: currentFilters,
                      onClearFilters: onClearFilters,
                    }
                  : {
                      isQueryFilter: false,
                      filterableColumns: filterableColumns,
                    })}
              />
            )}
          </div>
          <div className="flex items-center justify-between md:hidden">
            <DataTableMobileToolbar
              table={table}
              filterableColumns={filterableColumns}
              searchableColumns={searchableColumns}
              addItemPagePath={addItemPagePath}
              isShowExportButtons={isShowExportButtons}
              customButtons={customButtons}
              isShowAdvancedFilter={shouldShowAdvancedFilter && !isQuerySearch && !isQueryFilter}
            />
          </div>
        </>
      ) : null}
      {viewMode === 'cards' ? (
        <>
          {isLoading ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: pageSize }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="space-y-3 p-4">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <DataTableCardView table={table} />
          )}
          {shouldShowPagination ? (
            <Card className="mt-3 overflow-hidden">
              <div className="space-y-2.5">
                {isCursorPagination && cursorPaginationData ? (
                  <DataTablePagination
                    table={table}
                    isCursorPagination={true}
                    cursorPaginationData={cursorPaginationData}
                  />
                ) : isQueryPagination && paginationData ? (
                  <DataTablePagination
                    table={table}
                    isQueryPagination={true}
                    paginationData={paginationData}
                  />
                ) : (
                  <DataTablePagination table={table} isQueryPagination={false} />
                )}
              </div>
            </Card>
          ) : null}
        </>
      ) : (
        <Card className="mt-3 overflow-hidden">
          <CardContent className="overflow-x-auto p-0">
            <Table>
              <TableHeader className="bg-muted/50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const sortDirection = header.column.getIsSorted()
                      return (
                        <TableHead
                          className="text-nowrap"
                          key={header.id}
                          aria-sort={
                            sortDirection === 'asc'
                              ? 'ascending'
                              : sortDirection === 'desc'
                                ? 'descending'
                                : undefined
                          }
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: pageSize }).map((_, i) => (
                    <TableRow key={i} className="hover:bg-transparent">
                      {Array.from({ length: columns.length }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-6 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : table.getRowModel()?.rows?.length ? (
                  table.getRowModel()?.rows.map((row, rowIndex) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      aria-rowindex={pageIndex * pageSize + rowIndex + 2}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell className="max-w-60 text-ellipsis text-nowrap" key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3 px-4">
                        <SearchX className="size-10 text-muted-foreground/50" aria-hidden="true" />
                        <div className="space-y-1">
                          <p className="font-semibold">{t('no-records-found')}</p>
                          <p className="text-balance text-sm text-muted-foreground">{t('no-records-hint')}</p>
                        </div>
                        {(table.getState().columnFilters.length > 0 || (isQueryFilter && currentFilters && Object.keys(currentFilters).length > 0)) && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-1 gap-1.5"
                            onClick={() => {
                              if (isQueryFilter && onClearFilters) {
                                onClearFilters()
                              } else {
                                table.resetColumnFilters()
                              }
                            }}
                          >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell className="max-w-60 text-ellipsis text-nowrap" key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={columns.length} className="py-16 text-center">
                            <div className="flex flex-col items-center gap-3 px-4">
                              <SearchX className="size-10 text-muted-foreground/50" aria-hidden="true" />
                              <div className="space-y-1">
                                <p className="font-semibold">{t('no-records-found')}</p>
                                <p className="text-balance text-sm text-muted-foreground">{t('no-records-hint')}</p>
                              </div>
                              {(table.getState().columnFilters.length > 0 || (isQueryFilter && currentFilters && Object.keys(currentFilters).length > 0)) && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-1 gap-1.5"
                                  onClick={() => {
                                    if (isQueryFilter && onClearFilters) {
                                      onClearFilters()
                                    } else {
                                      table.resetColumnFilters()
                                    }
                                  }}
                                >
                                  <RotateCcw className="size-3.5" aria-hidden="true" />
                                  {t('reset-filters')}
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                }
              </TableBody>
            </Table>
          </CardContent>
          {shouldShowPagination ? (
            <div className="space-y-2.5">
              {isCursorPagination && cursorPaginationData ? (
                <DataTablePagination
                  table={table}
                  isCursorPagination={true}
                  cursorPaginationData={cursorPaginationData}
                />
              ) : isQueryPagination && paginationData ? (
                <DataTablePagination
                  table={table}
                  isQueryPagination={true}
                  paginationData={paginationData}
                />
              ) : (
                <DataTablePagination table={table} isQueryPagination={false} />
              )}
            </div>
          ) : null}
        </Card>
      )}
    </ResolvedTableConfigContext.Provider>
  )
}
