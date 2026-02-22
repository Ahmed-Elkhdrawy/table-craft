'use client'

import * as React from 'react'
import { LayoutGrid, PlusCircle, RotateCcw, TableIcon, Trash2 } from 'lucide-react'
import type { Table } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ar, enUS } from 'date-fns/locale'
import { exportSelectedRowsCsv } from '../lib/csv-export'
import { CalendarIcon, Loader2, Plus, Search, Sheet } from 'lucide-react'
import { useTableTranslations } from '../hooks/use-table-translations'

import type {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
  DataTableQuerySearchable,
} from '../types/table'
import { cn } from '../lib/utils'
import { useTableConfig } from '../config'
import { Button, buttonVariants } from './ui/button'
import { Input } from './ui/input'
import { Calendar } from './ui/calendar'
import { Checkbox } from './ui/checkbox'
import { Label } from './ui/label'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { DataTableSingleSelectFilter } from './data-table-single-select-filter'
import { DataTableViewOptions } from './data-table-view-options'
import { ButtonTooltip, CustomButtonProps } from './table-actions-row'
import { Card } from './ui/card'
import { FilterOptions } from '../types/filter-options'
import { DataTableRoleFilter } from './data-table-role-filter'

export type ViewMode = 'table' | 'cards'

type BaseProps<TData> = {
  table: Table<TData>
  viewMode?: ViewMode
  onViewModeChange?: (mode: ViewMode) => void
  newRowLink?: string
  deleteRowsAction?: React.MouseEventHandler<HTMLButtonElement>
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
  customCss?: string
}

type QueryFilterProps<TData> = {
  isQueryFilter: true
  handleFilterChange: (key: keyof FilterOptions, value: string | number | undefined) => void
  filterableQuery: DataTableFilterableColumn<TData>[]
  filterableColumns?: never
  currentFilters?: FilterOptions
  onClearFilters?: () => void
}

type LocalFilterProps<TData> = {
  isQueryFilter?: false
  handleFilterChange?: never
  filterableQuery?: never
  filterableColumns?: DataTableFilterableColumn<TData>[]
  currentFilters?: never
  onClearFilters?: never
}

type QuerySearchProps<TData> = BaseProps<TData> & {
  isQuerySearch: true
  searchableQuery: DataTableQuerySearchable<TData>[]
  searchableColumns?: never
}

type LocalQuerySearchProps<TData> = BaseProps<TData> & {
  isQuerySearch?: false
  searchableQuery?: never
  searchableColumns?: DataTableSearchableColumn<TData>[]
}

type DataTableToolbarProps<TData> = BaseProps<TData> &
  (QuerySearchProps<TData> | LocalQuerySearchProps<TData>) &
  (QueryFilterProps<TData> | LocalFilterProps<TData>)

export function DataTableToolbar<TData>({
  table,
  viewMode,
  onViewModeChange,
  filterableColumns = [],
  searchableColumns = [],
  newRowLink,
  addItemPagePath,
  deleteRowsAction,
  isShowExportButtons = {
    isShow: true,
    ignoredCols: [],
    fileName: '',
  },
  customButtons,
  isQuerySearch = false,
  searchableQuery,
  isQueryFilter = false,
  handleFilterChange,
  filterableQuery,
  currentFilters,
  onClearFilters,
  customCss = '',
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const isQueryFiltered = isQueryFilter && currentFilters && Object.keys(currentFilters).length > 0
  const hasActiveFilters = isFiltered || isQueryFiltered
  const [isPending, startTransition] = React.useTransition()
  const [isGoPath, setGoPath] = React.useState(false)
  const t = useTableTranslations()
  const config = useTableConfig()
  const router = config.router
  const [date, setDate] = React.useState<Date>()
  const isArabic = config.i18n.direction === 'rtl' || (config.i18n.direction === 'auto' && config.i18n.locale === 'ar')

  const goAddItemPage = () => {
    setGoPath(true)
    if (addItemPagePath && router) {
      router.push(addItemPagePath.url)
    }
  }

  const handleExportSelectedRowsCSV = () => {
    exportSelectedRowsCsv(table, {
      fileName: isShowExportButtons.fileName,
      ignoredCols: isShowExportButtons.ignoredCols,
    })
  }

  const activeFilterColumns = isQueryFilter ? (filterableQuery || []) : filterableColumns
  const hasFilters = activeFilterColumns.length > 0
  const hasSearch = isQuerySearch
    ? (searchableQuery && searchableQuery.length > 0)
    : searchableColumns.length > 0

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center gap-3">
        {config.features.viewToggle && viewMode && onViewModeChange && (
          <div className="flex items-center rounded-lg border bg-muted/30 p-0.5">
            <button
              onClick={() => onViewModeChange('table')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                viewMode === 'table'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <TableIcon className="size-4" />
              {t('tableView')}
            </button>
            <button
              onClick={() => onViewModeChange('cards')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                viewMode === 'cards'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <LayoutGrid className="size-4" />
              {t('cardView')}
            </button>
          </div>
        )}

        <div className="flex flex-1 items-center gap-3">
          {config.features.search && isQuerySearch && searchableQuery && searchableQuery.length > 0 && (
            <>
              {searchableQuery.map((column) => (
                <div className="relative flex-1 max-w-sm" key={String(column.id)}>
                  <Search className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id={String(column.id)}
                    type={column?.type || 'text'}
                    placeholder={`${t('Filter')} ${column.title}...`}
                    onChange={column.handleInputChange}
                    defaultValue={column.defaultSearch || ''}
                    className="ps-9"
                  />
                </div>
              ))}
            </>
          )}
          {config.features.search && !isQuerySearch &&
            searchableColumns.length > 0 &&
            searchableColumns.map(
              (column) =>
                table.getColumn(column.id ? String(column.id) : '') && (
                  <div className="flex-1 max-w-sm" key={String(column.id)}>
                    {column?.type === 'checkbox' ? (
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={String(column.id)}
                          checked={
                            table.getColumn(String(column.id))?.getFilterValue() === 'true'
                          }
                          onCheckedChange={(value) =>
                            table
                              .getColumn(String(column.id))
                              ?.setFilterValue(value ? 'true' : 'false')
                          }
                          aria-label={`Filter ${column.title}`}
                          className="size-4"
                        />
                        <Label className="cursor-pointer text-sm" htmlFor={String(column.id)}>
                          {column.title}
                        </Label>
                      </div>
                    ) : column?.type === 'date' ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-start font-normal',
                              !date && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="me-2 size-4" />
                            {date
                              ? (() => {
                                  const filterValue = table
                                    .getColumn(String(column.id))
                                    ?.getFilterValue()
                                  const parsedDate = filterValue
                                    ? new Date(filterValue as string)
                                    : null

                                  return parsedDate && !isNaN(parsedDate.getTime())
                                    ? format(parsedDate, 'PPP', {
                                        locale: isArabic ? ar : enUS,
                                      })
                                    : t('datePlaceholder')
                                })()
                              : t('datePlaceholder')}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            className="py-2 text-sm"
                            mode="single"
                            selected={
                              table.getColumn(String(column.id))?.getFilterValue()
                                ? new Date(
                                    table
                                      .getColumn(String(column.id))
                                      ?.getFilterValue() as string
                                  )
                                : undefined
                            }
                            onSelect={(selectedDate) => {
                              if (selectedDate && !isNaN(selectedDate.getTime())) {
                                table
                                  .getColumn(String(column.id))
                                  ?.setFilterValue(format(selectedDate, 'yyyy-MM-dd'))
                                setDate(selectedDate)
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <div className="relative">
                        <Search className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id={String(column.id)}
                          type={column?.type || 'text'}
                          key={String(column.id)}
                          placeholder={`${t('Filter')} ${column.title}...`}
                          value={
                            (table.getColumn(String(column.id))?.getFilterValue() as string) ??
                            ''
                          }
                          onChange={(event) =>
                            table
                              .getColumn(String(column.id))
                              ?.setFilterValue(event.target.value)
                          }
                          className={`ps-9 ${customCss}`}
                        />
                      </div>
                    )}
                  </div>
                )
            )}
        </div>

        <div className="flex items-center gap-2">
          {deleteRowsAction && table.getSelectedRowModel().rows.length > 0 ? (
            <Button
              aria-label="Delete selected rows"
              variant="outline"
              size="sm"
              className="h-9"
              onClick={(event) => {
                startTransition(() => {
                  table.toggleAllPageRowsSelected(false)
                  deleteRowsAction(event)
                })
              }}
              disabled={isPending}
            >
              <Trash2 className="me-2 size-4" aria-hidden="true" />
              {t('Delete')}
            </Button>
          ) : newRowLink ? (
            <a
              aria-label="Create new row"
              href={newRowLink}
              className={cn(
                buttonVariants({
                  variant: 'outline',
                  size: 'sm',
                  className: 'h-9',
                })
              )}
            >
              <PlusCircle className="me-2 size-4" aria-hidden="true" />
              {t('new')}
            </a>
          ) : null}
          {config.features.columnVisibility && <DataTableViewOptions table={table} />}
          {config.features.csvExport && isShowExportButtons.isShow && (
            <Button
              disabled={!table.getSelectedRowModel().rows.length}
              aria-label="Export CSV"
              title="Export CSV"
              variant="outline"
              size="sm"
              className="h-9 gap-1.5"
              onClick={handleExportSelectedRowsCSV}
            >
              <Sheet className="size-4" aria-hidden="true" />
              {t('export-csv')}
            </Button>
          )}
          {customButtons && Array.isArray(customButtons)
            ? customButtons
                .filter((customButton) => Object.keys(customButton).length !== 0)
                .map((customButton, index) => (
                  <Button
                    key={index}
                    onClick={customButton.function}
                    size="sm"
                    className={`${
                      customButton.className ? customButton.className : ''
                    } relative h-9 gap-1.5`}
                    {...customButton.attr}
                  >
                    {customButton.toolTip && (
                      <ButtonTooltip content={customButton.toolTip}></ButtonTooltip>
                    )}
                    {customButton.icon}
                    {customButton.text}
                    {customButton.children}
                  </Button>
                ))
            : React.isValidElement(customButtons)
              ? customButtons
              : null}
          {addItemPagePath ? (
            addItemPagePath?.url ? (
              <Button
                onClick={goAddItemPage}
                size="sm"
                className="h-9"
                disabled={isGoPath}
              >
                {isGoPath ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                {addItemPagePath.text ? addItemPagePath.text : t('add')}
              </Button>
            ) : null
          ) : null}
        </div>
      </div>

      {config.features.filter && hasFilters && (
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
            {t('filter-by')}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {!isQueryFilter && filterableColumns.length > 0 && (
              <>
                {filterableColumns.map((column) => {
                  const columnId = String(column.id)

                  if (column.isSingleSelect) {
                    return (
                      <DataTableSingleSelectFilter
                        key={columnId}
                        column={table.getColumn(columnId)}
                        title={column.title}
                        options={column.options}
                        className=""
                      />
                    )
                  }

                  return (
                    <DataTableFacetedFilter
                      key={columnId}
                      column={table.getColumn(columnId)}
                      title={column.title}
                      options={column.options}
                    />
                  )
                })}
              </>
            )}
            {isQueryFilter && filterableQuery && filterableQuery.length > 0 && (
              <>
                {filterableQuery.map((column) => {
                  if (column.isSingleSelect) {
                    return (
                      <DataTableSingleSelectFilter
                        key={String(column.id)}
                        column={column}
                        title={column.title}
                        options={column.options}
                        isQueryFilter={isQueryFilter}
                        handleFilterChange={handleFilterChange}
                        currentValue={currentFilters?.[column.id as keyof FilterOptions] as string}
                        className="w-[180px]"
                      />
                    )
                  }

                  return (
                    <DataTableFacetedFilter
                      key={String(column.id)}
                      column={column}
                      title={column.title}
                      options={column.options}
                      isQueryFilter={isQueryFilter}
                      handleFilterChange={handleFilterChange}
                      currentValue={currentFilters?.[column.id as keyof FilterOptions] as string}
                    />
                  )
                })}
              </>
            )}
            {hasActiveFilters && (
              <Button
                aria-label="Reset filters"
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  if (isQueryFilter && onClearFilters) {
                    onClearFilters()
                  } else {
                    table.resetColumnFilters()
                  }
                }}
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
                {t('Reset')}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
