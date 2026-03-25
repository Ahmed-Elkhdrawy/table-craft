import { UsersTable } from './users-table'
import { users } from './data'

export default function UsersPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-sm text-gray-500">
          Manage your team members. Try sorting, filtering, and pagination.
        </p>
      </div>
      <UsersTable data={users} />
    </main>
  )
}
