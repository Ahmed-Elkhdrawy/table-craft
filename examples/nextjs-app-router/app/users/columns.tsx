'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from 'react-table-craft'
import type { User } from './data'

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const role = row.getValue('role') as string
      return (
        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium capitalize bg-gray-100 text-gray-700">
          {role}
        </span>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const isActive = status === 'active'
      return (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium capitalize ${
            isActive
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {status}
        </span>
      )
    },
  },
  {
    accessorKey: 'department',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Department" />
    ),
  },
  {
    accessorKey: 'joinedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Joined" />
    ),
  },
]
