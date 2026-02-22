import * as React from 'react'
import {
  Copy,
  GripVertical,
  MoreHorizontal,
  Trash2,
} from 'lucide-react'
import type { Table } from '@tanstack/react-table'
import { useTableTranslations } from '../../hooks/use-table-translations'
import { useTableConfig } from '../../config'

import type { DataTableFilterOption } from '../../types/table'
import { useDebounce } from '../../hooks/use-debounce'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Input } from '../ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Separator } from '../ui/separator'

import { DataTableFacetedFilter } from '../data-table-faceted-filter'

const operators = [
  { label: 'And', value: 'and' },
  { label: 'Or', value: 'or' },
]

interface DataTableMultiFilterProps<TData> {
  table: Table<TData>
  allOptions: DataTableFilterOption<TData>[]
  options: DataTableFilterOption<TData>[]
  setSelectedOptions: React.Dispatch<
    React.SetStateAction<DataTableFilterOption<TData>[]>
  >
}

export function DataTableMultiFilter<TData>({
  table,
  allOptions,
  options,
  setSelectedOptions,
}: DataTableMultiFilterProps<TData>) {
  const [open, setOpen] = React.useState(true)
  const [operator, setOperator] = React.useState(operators[0])
  const t = useTableTranslations()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 rounded-full border-dashed"
        >
          <GripVertical className="size-3.5 text-muted-foreground" />
          <span className="font-medium">
            {options.length} {options.length === 1 ? 'rule' : 'rules'}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit min-w-[420px] p-0" align="start">
        <div className="space-y-2 p-4">
          {options.map((option, i) => (
            <MultiFilterRow
              key={option.id ?? i}
              i={i}
              option={option}
              table={table}
              allOptions={allOptions}
              options={options}
              setSelectedOptions={setSelectedOptions}
              operator={operator}
              setOperator={setOperator}
            />
          ))}
        </div>
        <Separator />
        <div className="p-2">
          <Button
            aria-label="Delete filter"
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
            onClick={() => {
              setSelectedOptions((prev) => prev.filter((item) => !item.isMulti))
            }}
          >
            <Trash2 className="size-3.5" />
            {t('delete')}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface MultiFilterRowProps<TData> extends DataTableMultiFilterProps<TData> {
  i: number
  option: DataTableFilterOption<TData>
  operator?: (typeof operators)[number]
  setOperator: React.Dispatch<React.SetStateAction<(typeof operators)[number]>>
}

export function MultiFilterRow<TData>({
  i,
  table,
  option,
  allOptions,
  options,
  setSelectedOptions,
  operator,
  setOperator,
}: MultiFilterRowProps<TData>) {
  const config = useTableConfig()
  const router = config.router
  const searchParams = router ? router.getSearchParams() : new URLSearchParams()
  const pathname = router ? router.getPathname() : ''

  const [value, setValue] = React.useState('')
  const debounceValue = useDebounce(value, 500)

  const [selectedOption, setSelectedOption] = React.useState<
    DataTableFilterOption<TData> | undefined
  >(options[0])

  const filterVarieties = selectedOption?.items.length
    ? ['is', 'is not']
    : ['contains', 'does not contain', 'is', 'is not']

  const [filterVariety, setFilterVariety] = React.useState(filterVarieties[0])

  React.useEffect(() => {
    if (selectedOption?.items.length) {
      setFilterVariety('is')
    }
  }, [selectedOption?.items.length])

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

  React.useEffect(() => {
    if (!router) return

    if (debounceValue.length > 0) {
      router.push(
        `${pathname}?${createQueryString({
          [selectedOption?.value ?? '']: `${debounceValue}${
            debounceValue.length > 0 ? `.${filterVariety}` : ''
          }`,
        })}`
      )
    }

    if (debounceValue.length === 0) {
      router.push(
        `${pathname}?${createQueryString({
          [selectedOption?.value ?? '']: null,
        })}`
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceValue, filterVariety, selectedOption?.value])

  React.useEffect(() => {
    if (!router) return
    if (operator?.value) {
      router.push(
        `${pathname}?${createQueryString({
          operator: operator.value,
        })}`
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operator?.value])

  return (
    <div className="flex items-center gap-2">
      <div className="w-[60px] shrink-0">
        {i === 0 ? (
          <span className="text-xs font-medium text-muted-foreground">Where</span>
        ) : i === 1 ? (
          <Select
            value={operator?.value}
            onValueChange={(value) => {
              const found = operators.find((o) => o.value === value)
              if (found) setOperator(found)
            }}
          >
            <SelectTrigger className="h-8 w-[60px] text-xs">
              <SelectValue placeholder={operator?.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {operators.map((op) => (
                  <SelectItem
                    key={op.value}
                    value={op.value}
                    className="text-xs"
                  >
                    {op.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        ) : (
          <span className="text-xs font-medium text-muted-foreground" key={operator?.value}>
            {operator?.label}
          </span>
        )}
      </div>

      <Select
        value={String(selectedOption?.value)}
        onValueChange={(value) => {
          setSelectedOption(allOptions.find((option) => option.value === value))
          setSelectedOptions((prev) =>
            prev.map((item) => {
              if (item.id === option.id) {
                return { ...item, value }
              } else {
                return item
              }
            })
          )
        }}
      >
        <SelectTrigger className="h-8 w-[120px] text-xs capitalize">
          <SelectValue placeholder={selectedOption?.label} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {allOptions.map((opt) => (
              <SelectItem
                key={String(opt.value)}
                value={String(opt.value)}
                className="text-xs capitalize"
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        value={filterVariety}
        onValueChange={(value) => setFilterVariety(value)}
      >
        <SelectTrigger className="h-8 w-[140px] text-xs">
          <SelectValue placeholder={filterVarieties[0]} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {filterVarieties.map((variety) => (
              <SelectItem key={variety} value={variety} className="text-xs">
                {variety}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {selectedOption?.items.length ? (
        table.getColumn(selectedOption.value ? String(option.value) : '') && (
          <DataTableFacetedFilter
            key={selectedOption.id}
            column={table.getColumn(
              selectedOption.value ? String(selectedOption.value) : ''
            )}
            title={selectedOption.label}
            options={selectedOption.items}
          />
        )
      ) : (
        <Input
          placeholder="Type here..."
          className="h-8 min-w-[120px] text-xs"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          autoFocus
        />
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8 shrink-0">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="gap-2 text-destructive focus:text-destructive"
            onClick={() => {
              setSelectedOptions((prev) =>
                prev.filter((item) => item.id !== option.id)
              )
            }}
          >
            <Trash2 className="size-3.5" />
            Remove
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-2"
            onClick={() => {
              setSelectedOptions((prev) => [
                ...prev,
                {
                  id: crypto.randomUUID(),
                  label: String(selectedOption?.label),
                  value: String(selectedOption?.value),
                  isMulti: true,
                  items: selectedOption?.items ?? [],
                },
              ])
            }}
          >
            <Copy className="size-3.5" />
            Duplicate
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
