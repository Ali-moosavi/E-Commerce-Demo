'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { getPaginatedItems, Item } from '@/lib/api'
import { TruncatedPagination } from '@/components/category/TruncatedPagination'

function PaginatedListContent() {
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get('page')) || 1

  const [items, setItems] = useState<Item[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const limit = 10

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await getPaginatedItems(currentPage, limit)
        setItems(response.data)
        setTotalPages(response.totalPages)
      } catch (reason) {
        console.error('Failed to fetch data:', reason)
        setError('Unable to load this page. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [currentPage])

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 p-4">
      <div
        className="min-h-[300px] rounded-lg border bg-background p-4 shadow-sm"
        aria-busy={isLoading}
      >
        {isLoading ? (
          <ul className="divide-y" aria-label={`Loading page ${currentPage}`}>
            {Array.from({ length: limit }).map((_, index) => (
              <li key={index} className="flex items-center justify-between gap-4 py-4">
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-10 animate-pulse rounded bg-gray-100" />
              </li>
            ))}
          </ul>
        ) : error ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 text-center">
            <p className="text-sm text-destructive">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-md border px-4 py-2 text-sm transition hover:bg-muted"
            >
              Try again
            </button>
          </div>
        ) : (
          <ul className="divide-y">
            {items.map((item) => (
              <li key={item.id} className="py-3 text-sm font-medium">
                {item.title}
              </li>
            ))}
          </ul>
        )}
      </div>

      <TruncatedPagination totalPages={totalPages} />
    </div>
  )
}

export default function PaginatedList() {
  return (
    <Suspense fallback={<p className="text-center py-10">Loading pagination...</p>}>
      <PaginatedListContent />
    </Suspense>
  )
}
