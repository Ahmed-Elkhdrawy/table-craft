import Link from 'next/link'

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">
        react-table-craft
      </h1>
      <p className="mt-2 text-gray-600">
        Next.js App Router example with URL-synced pagination, sorting, and filtering.
      </p>
      <Link
        href="/users"
        className="mt-6 inline-block rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
      >
        View Users Table
      </Link>
    </main>
  )
}
