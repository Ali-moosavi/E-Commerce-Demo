'use client'

import { useCallback } from 'react'
import { useSearchParams, usePathname } from 'next/navigation'
import { getPaginationRange } from '@/lib/pagination'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface TruncatedPaginationProps {
  totalPages: number
  siblingCount?: number
}

export function TruncatedPagination({
  totalPages,
  siblingCount = 1,
}: TruncatedPaginationProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const currentPage = Number(searchParams.get('page')) || 1

  const createPageURL = useCallback(
    (pageNumber: number | string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', pageNumber.toString())
      return `${pathname}?${params.toString()}`
    },
    [pathname, searchParams]
  )

  const paginationRange = getPaginationRange(currentPage, totalPages, siblingCount)

  if (totalPages <= 1) return null

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={currentPage > 1 ? createPageURL(currentPage - 1) : '#'}
            className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>

        {paginationRange.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            )
          }

          return (
            <PaginationItem key={page}>
              <PaginationLink
                href={createPageURL(page)}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        <PaginationItem>
          <PaginationNext
            href={currentPage < totalPages ? createPageURL(currentPage + 1) : '#'}
            className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}