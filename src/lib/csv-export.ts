import { Table } from '@tanstack/react-table'
import { download, generateCsv, mkConfig } from 'export-to-csv'

interface CsvExportOptions {
  fileName?: string
  ignoredCols?: string[]
}

const DEFAULT_IGNORED_COLUMNS = ['actions', 'select']

export function createCsvConfig(options: CsvExportOptions = {}) {
  return mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
    filename: options.fileName || 'table-export',
  })
}

export function exportSelectedRowsCsv<TData>(
  table: Table<TData>,
  options: CsvExportOptions = {}
) {
  const selectedRows = table.getSelectedRowModel().rows
  if (selectedRows.length === 0) {
    return
  }

  const ignoredColumns = [
    ...DEFAULT_IGNORED_COLUMNS,
    ...(options.ignoredCols || []),
  ]
  const csvConfig = createCsvConfig(options)

  try {
    const tableData = selectedRows.map((row) => {
      return row._getAllVisibleCells().reduce(
        (acc, cell) => {
          if (!ignoredColumns.includes(cell.column.id)) {
            const rawValue = cell.getValue()
            const original = cell.row.original as Record<string, unknown>
            const value = rawValue ?? original[cell.column.id]
            if (value !== undefined && value !== null && value !== '') {
              const headerKey =
                typeof cell.column.columnDef.header === 'string'
                  ? cell.column.columnDef.header
                  : cell.column.id
              acc[headerKey] = String(value)
            }
          }
          return acc
        },
        {} as Record<string, string>
      )
    })

    if (tableData.length === 0) {
      return
    }

    const csv = generateCsv(csvConfig)(tableData)
    download(csvConfig)(csv)
  } catch (error) {
    console.error('CSV export failed:', error)
  }
}
