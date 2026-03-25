'use client'

import { ClientSideTable } from 'react-table-craft'
import { columns } from './columns'
import type { User } from './data'

export function UsersTable({ data }: { data: User[] }) {
  return (
    <ClientSideTable
      columns={columns}
      data={data}
      searchableColumns={[
        { id: 'name', title: 'Name' },
        { id: 'email', title: 'Email' },
      ]}
      filterableColumns={[
        {
          id: 'role',
          title: 'Role',
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Editor', value: 'editor' },
            { label: 'Viewer', value: 'viewer' },
          ],
        },
        {
          id: 'status',
          title: 'Status',
          options: [
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
          ],
        },
        {
          id: 'department',
          title: 'Department',
          options: [
            { label: 'Engineering', value: 'Engineering' },
            { label: 'Marketing', value: 'Marketing' },
            { label: 'Sales', value: 'Sales' },
            { label: 'HR', value: 'HR' },
            { label: 'Design', value: 'Design' },
          ],
        },
      ]}
    />
  )
}
