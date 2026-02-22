'use client'

import * as React from 'react'
import { Column, ColumnDef, Row, Table } from '@tanstack/react-table'
import { DataTable } from '../data-table'
import { DataTableColumnHeader } from '../data-table-column-header'
import { CustomButtonProps } from '../table-actions-row'
import { useTableTranslations } from '../../hooks/use-table-translations'
import type { TableConfigInput } from '../../types/table-config'
import { Pagination } from '../../types/pagination'
import {
  DataTableFilterableColumn,
  DataTableQuerySearchable,
  DataTableSearchableColumn,
} from '../../types/table'
import { FilterOptions } from '../../types/filter-options'

type BaseProps<TData, TValue> = {
  data: TData[]
  pageCount: number
  pageSize?: number
  columns: ColumnDef<TData, TValue>[]
  showFilter?: boolean
  showPagination?: boolean
  addItemPagePath?: {
    url: string
    text?: string
  }
  isShowExportButtons?: {
    isShow: boolean
    ignoredCols?: string[]
    fileName?: string
  }
  customButtons?: CustomButtonProps[] | React.ReactElement
  withIndex?: boolean
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
}

type LocalPaginationProps<TData, TValue> = {
  isQueryPagination?: false
  paginationData?: never
}

type TasksTableShellProps<TData, TValue> = BaseProps<TData, TValue> &
  (QuerySearchProps<TData, TValue> | LocalSearchProps<TData, TValue>) &
  (QueryPaginationProps<TData, TValue> | LocalPaginationProps<TData, TValue>) &
  (QueryFilterProps<TData, TValue> | LocalFilterProps<TData, TValue>)

export function ClientSideTable<TData, TValue>({
  data,
  pageCount,
  pageSize = 10,
  columns: initialColumns,
  searchableColumns = [],
  showFilter = true,
  showPagination = true,
  filterableColumns = [],
  addItemPagePath,
  isShowExportButtons = {
    isShow: true,
    ignoredCols: [],
    fileName: '',
  },
  customButtons,
  withIndex = true,
  isQueryPagination = false,
  paginationData,
  isLoading = false,
  isQuerySearch = false,
  searchableQuery = [],
  isQueryFilter = false,
  handleFilterChange,
  filterableQuery,
  currentFilters,
  onClearFilters,
  customCss,
  isShowAdvancedFilter = false,
  config,
}: TasksTableShellProps<TData, TValue>) {
  const t = useTableTranslations()

  const columns = React.useMemo<ColumnDef<TData, TValue>[]>(() => {
    return [
      ...(withIndex
        ? [
            {
              accessorKey: 'i',
              header: ({ column }: { column: Column<TData> }) => (
                <DataTableColumnHeader column={column} title={t('row-number')} />
              ),
              cell: ({ row, table }: { row: Row<TData>; table: Table<TData> }) => (
                <div className="w-full">
                  {table.getState().pagination.pageIndex + 1 === 1
                    ? row.index + 1
                    : table.getState().pagination.pageIndex + 1 > 1
                      ? table.getState().pagination.pageIndex *
                          table.getState().pagination.pageSize +
                        (row.index + 1)
                      : row.index + 1}
                </div>
              ),
              enableSorting: false,
              enableHiding: false,
            },
          ]
        : []),
      ...initialColumns,
    ]
  }, [initialColumns, withIndex, t])

  return (
    <DataTable
      columns={columns}
      data={data}
      pageCount={pageCount}
      pageSize={pageSize}
      showFilter={showFilter}
      showPagination={showPagination}
      addItemPagePath={addItemPagePath}
      isShowExportButtons={isShowExportButtons}
      customButtons={customButtons}
      floatingBar={true}
      isLoading={isLoading}
      customCss={customCss}
      isShowAdvancedFilter={isShowAdvancedFilter}
      config={config}
      {...(isQuerySearch
        ? { isQuerySearch: true as const, searchableQuery: searchableQuery }
        : {
            isQuerySearch: false as const,
            searchableColumns: searchableColumns,
          })}
      {...(isQueryPagination && paginationData
        ? { isQueryPagination: true as const, paginationData }
        : { isQueryPagination: false as const })}
      {...(isQueryFilter && handleFilterChange
        ? {
            isQueryFilter: true as const,
            handleFilterChange,
            filterableQuery: filterableQuery || [],
            currentFilters: currentFilters,
            onClearFilters: onClearFilters,
          }
        : {
            isQueryFilter: false as const,
            filterableColumns: filterableColumns || [],
          })}
    />
  )
}
