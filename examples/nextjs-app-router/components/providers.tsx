'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { TableProvider, createTableConfig } from 'react-table-craft'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const config = createTableConfig({
    router: {
      push: (url) => router.push(url),
      replace: (url) => router.replace(url),
      getSearchParams: () => new URLSearchParams(searchParams.toString()),
      getPathname: () => pathname,
    },
    features: {
      search: true,
      filter: true,
      pagination: true,
      columnVisibility: true,
      csvExport: true,
      rowSelection: true,
      sorting: true,
    },
    pagination: {
      defaultPageSize: 10,
      pageSizeOptions: [5, 10, 20, 50],
    },
  })

  return <TableProvider config={config}>{children}</TableProvider>
}
