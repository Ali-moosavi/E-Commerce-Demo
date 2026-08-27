'use client'

import Link from 'next/link'
import { useMemo, useState, useCallback, useTransition } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import Card from '@/components/category/card'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import Filter from '@/components/filter/Filter'
import type { SUCCES_PROPERTIES_TYPE, PRODUCT_TYPE } from '@/types/types'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination'

const toPersianDigits = (value: number | string): string =>
  String(value).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])

const toLatinDigits = (value: string) =>
  Number(value.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/[^\d]/g, ''))

const SORT_OPTIONS = [
  { key: 'best-seller', label: 'پرفروش‌ترین' },
  { key: 'newest', label: 'جدیدترین' },
  { key: 'cheapest', label: 'ارزان‌ترین' },
  { key: 'most-expensive', label: 'گران‌ترین' },
  { key: 'popular', label: 'پربازدیدترین' },
] as const

type SortKey = (typeof SORT_OPTIONS)[number]['key']

const ITEMS_PER_PAGE = 12

function getPaginationRange(currentPage: number, totalPages: number, siblingCount = 1) {
  const totalPageNumbers = siblingCount * 2 + 5

  if (totalPages <= totalPageNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

  const shouldShowLeftEllipsis = leftSiblingIndex > 2
  const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1

  if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
    const leftItemCount = 3 + 2 * siblingCount
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1)
    return [...leftRange, 'ellipsis', totalPages]
  }

  if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
    const rightItemCount = 3 + 2 * siblingCount
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + i + 1
    )
    return [1, 'ellipsis', ...rightRange]
  }

  if (shouldShowLeftEllipsis && shouldShowRightEllipsis) {
    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    )
    return [1, 'ellipsis', ...middleRange, 'ellipsis', totalPages]
  }

  return []
}

interface CategoryClientViewProps {
  categoryName: string
  allProducts: PRODUCT_TYPE[]
  properties: SUCCES_PROPERTIES_TYPE[]
}

export default function CategoryClientView({
  categoryName,
  allProducts,
  properties,
}: CategoryClientViewProps) {
  const router = useRouter()
  const [isNavigatingBack, startNavigation] = useTransition()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Read current page on client to preserve static HTML ISR on server
  const currentPage = Math.max(1, Number(searchParams.get('page')) || 1)

  const [selectedPropertyIds, setSelectedPropertyIds] = useState<number[]>([])
  const [sort, setSort] = useState<SortKey>('best-seller')
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)

  const sortedAndFilteredProducts = useMemo(() => {
    const filtered = selectedPropertyIds.length
      ? allProducts.filter((product) => {
          const productPropertyIds = (product.propertyIds ?? []).map((id) => Number(id))
          return selectedPropertyIds.some((filterId) => productPropertyIds.includes(filterId))
        })
      : allProducts

    const sorted = [...filtered]
    switch (sort) {
      case 'cheapest':
        sorted.sort((a, b) => toLatinDigits(a.price) - toLatinDigits(b.price))
        break
      case 'most-expensive':
        sorted.sort((a, b) => toLatinDigits(b.price) - toLatinDigits(a.price))
        break
      case 'newest':
        sorted.sort((a, b) => b.id - a.id)
        break
      case 'popular':
      case 'best-seller':
      default:
        sorted.sort((a, b) => Number(b.rate) - Number(a.rate))
    }
    return sorted
  }, [allProducts, selectedPropertyIds, sort])

  const totalPages = Math.ceil(sortedAndFilteredProducts.length / ITEMS_PER_PAGE) || 1

  const visibleProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return sortedAndFilteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [sortedAndFilteredProducts, currentPage])

  const createPageURL = useCallback(
    (pageNumber: number | string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', pageNumber.toString())
      return `${pathname}?${params.toString()}`
    },
    [pathname, searchParams]
  )

  const paginationRange = getPaginationRange(currentPage, totalPages)
  const activeFilterCount = selectedPropertyIds.length

  return (
    <>
      {/* Mobile Header */}
      <header className='sticky top-0 z-40 border-b border-gray-200 bg-white px-3 py-3 lg:hidden'>
        <div className='flex items-center gap-2'>
          <button
            type='button'
            onClick={() => startNavigation(() => router.push('/category'))}
            disabled={isNavigatingBack}
            aria-label='بازگشت'
            className='flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center text-[#1f1f1f] disabled:cursor-wait disabled:opacity-50'
          >
            {isNavigatingBack ? (
              <span
                aria-hidden="true"
                className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-[#ef4056]"
              />
            ) : (
              <ArrowLeft />
            )}
          </button>
          <h1 className='shrink-0 text-sm font-[iransansBold] text-[#1f1f1f]'>
            {categoryName || 'دسته‌بندی'}
          </h1>
          <div className='relative min-w-0 flex-1'>
            <input
              type='text'
              className='w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 pr-9 text-xs text-gray-900 outline-none transition focus:border-[#19bfd3] focus:bg-white'
              placeholder='جستجو...'
            />
            <SearchRoundedIcon
              sx={{ fontSize: 18, color: '#8a8a8a' }}
              className='absolute right-3 top-1/2 -translate-y-1/2'
            />
          </div>
        </div>
      </header>

      {/* Mobile Filter & Sort Bar */}
      <div className='sticky top-13.5 z-30 border-b border-gray-200 bg-white lg:hidden'>
        <div className='flex items-center gap-2 px-3 py-2'>
          <button
            type='button'
            onClick={() => setFilterSheetOpen(true)}
            className='flex shrink-0 cursor-pointer items-center gap-1 rounded-full border border-gray-300 px-3 py-1.5 text-[11px] font-medium text-gray-700'
          >
            <TuneRoundedIcon sx={{ fontSize: 16 }} />
            فیلترها
            {activeFilterCount > 0 && (
              <span className='flex h-4 w-4 items-center justify-center rounded-full bg-[#ef4056] text-[9px] text-white'>
                {toPersianDigits(activeFilterCount)}
              </span>
            )}
          </button>
          <ul className='flex gap-2 overflow-x-auto text-[11px] whitespace-nowrap'>
            {SORT_OPTIONS.map((option) => (
              <li key={option.key}>
                <button
                  type='button'
                  onClick={() => setSort(option.key)}
                  className={`cursor-pointer rounded-full px-3 py-1.5 transition ${
                    sort === option.key
                      ? 'bg-[#f0f0f1] font-[iransansBold] text-[#23254e]'
                      : 'text-[#62666d]'
                  }`}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      {filterSheetOpen && (
        <div className='fixed inset-0 z-50 lg:hidden' role='dialog' aria-modal='true'>
          <button
            type='button'
            aria-label='بستن'
            className='absolute inset-0 h-full w-full cursor-default bg-black/40'
            onClick={() => setFilterSheetOpen(false)}
          />
          <div className='absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-white pb-20'>
            <div className='sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3'>
              <h2 className='text-sm font-[iransansBold] text-[#23254e]'>فیلترها</h2>
              <button
                type='button'
                onClick={() => setFilterSheetOpen(false)}
                aria-label='بستن'
                className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-600'
              >
                <CloseRoundedIcon sx={{ fontSize: 18 }} />
              </button>
            </div>
            <div className='px-4 py-3'>
              <Filter properties={properties} onFilterChange={setSelectedPropertyIds} />
            </div>
            <div className='sticky bottom-0 flex gap-3 border-t border-gray-200 bg-white px-4 py-3'>
              <button
                type='button'
                onClick={() => {
                  setSelectedPropertyIds([])
                  setFilterSheetOpen(false)
                }}
                className='h-11 flex-1 cursor-pointer rounded-lg border border-gray-300 text-xs font-medium text-gray-700'
              >
                حذف فیلترها
              </button>
              <button
                type='button'
                onClick={() => setFilterSheetOpen(false)}
                className='h-11 flex-1 cursor-pointer rounded-lg bg-[#ef4056] text-xs font-[iransansBold] text-white'
              >
                مشاهده نتایج
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className='px-4 pt-4 sm:px-6 lg:mt-40 lg:px-8'>
        <header className='mr-77  mt-8 hidden lg:block'>
          <ul className='flex items-stretch gap-2 text-sm whitespace-nowrap text-gray-600 xl:gap-3'>
            <li className='shrink-0 font-semibold'>مرتب سازی:</li>
            {SORT_OPTIONS.map((option) => (
              <li key={option.key}>
                <button
                  type='button'
                  onClick={() => setSort(option.key)}
                  className={`cursor-pointer transition hover:text-red-600 hover:opacity-100 ${
                    sort === option.key ? 'font-semibold text-red-600 opacity-100' : 'opacity-60'
                  }`}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </header>

        <main className='grid gap-4 lg:grid-cols-[18rem_minmax(0,1fr)] lg:pt-5'>
          <aside className='order-1 hidden h-fit rounded-xl border border-gray-200 bg-white p-4 shadow-sm lg:sticky lg:top-50 lg:block'>
            <Filter properties={properties} onFilterChange={setSelectedPropertyIds} />
          </aside>

          <div className='order-3 flex flex-col justify-between gap-8 lg:order-2'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 '>
              {visibleProducts.map((mobile) => (
                <Link key={mobile.id} href={`/category/${mobile.Categoryid}/${mobile.id}`}>
                  <Card
                    name={mobile.name}
                    rate={mobile.rate}
                    price={mobile.price}
                    describtion={mobile.describtion}
                    image={mobile.image}
                    badge={mobile.badge}
                  />
                </Link>
              ))}

              {visibleProducts.length === 0 && (
                <p className='col-span-full py-16 text-center text-sm text-gray-500'>
                  محصولی در این دسته‌بندی پیدا نشد.
                </p>
              )}
            </div>

            {/* Left-to-Right Persian Pagination */}
            {totalPages > 1 && (
              <div className='my-8 flex justify-center' dir='ltr'>
                <Pagination>
                  <PaginationContent>
                    {/* Previous Button on Left */}
                    <PaginationItem>
                      <PaginationLink
                        href={currentPage > 1 ? createPageURL(currentPage - 1) : '#'}
                        aria-label='صفحه قبلی'
                        size='default'
                        className={`gap-1 pl-2.5 ${
                          currentPage <= 1 ? 'pointer-events-none opacity-50' : ''
                        }`}
                      >
                        <ChevronLeft className='h-4 w-4' />
                        <span>قبلی</span>
                      </PaginationLink>
                    </PaginationItem>

                    {/* Page Numbers (1 -> N from Left to Right) */}
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
                            {toPersianDigits(page)}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    })}

                    {/* Next Button on Right */}
                    <PaginationItem>
                      <PaginationLink
                        href={currentPage < totalPages ? createPageURL(currentPage + 1) : '#'}
                        aria-label='صفحه بعدی'
                        size='default'
                        className={`gap-1 pr-2.5 ${
                          currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''
                        }`}
                      >
                        <span>بعدی</span>
                        <ChevronRight className='h-4 w-4' />
                      </PaginationLink>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  )
}
