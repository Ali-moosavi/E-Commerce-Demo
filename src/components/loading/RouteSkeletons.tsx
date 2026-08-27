import { Skeleton } from "../ui/skeleton"

const ITEMS_PER_PAGE = 12
const SORT_OPTIONS_COUNT = 5

export default function CategoryLoading() {
  return (
    <>
      {/* Mobile Header Skeleton */}
      <header className='sticky top-0 z-40 border-b border-gray-200 bg-white px-3 py-3 lg:hidden'>
        <div className='flex items-center gap-2'>
          <Skeleton className='h-9 w-9 shrink-0 rounded-full' />
          <Skeleton className='h-4 w-20 shrink-0' />
          <Skeleton className='h-9 flex-1 rounded-full' />
        </div>
      </header>

      {/* Mobile Filter & Sort Bar Skeleton */}
      <div className='sticky top-13.5 z-30 border-b border-gray-200 bg-white lg:hidden'>
        <div className='flex items-center gap-2 px-3 py-2'>
          <Skeleton className='h-7 w-20 shrink-0 rounded-full' />
          <ul className='flex gap-2 overflow-x-auto'>
            {Array.from({ length: SORT_OPTIONS_COUNT }).map((_, i) => (
              <li key={i}>
                <Skeleton className='h-7 w-16 rounded-full' />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className='px-4 pt-4 sm:px-6 lg:mt-40 lg:px-8'>
        {/* Desktop Sort Header Skeleton */}
        <header className='mr-77 mt-8 hidden items-stretch gap-2 lg:flex xl:gap-3'>
          <Skeleton className='h-4 w-16 shrink-0' />
          {Array.from({ length: SORT_OPTIONS_COUNT }).map((_, i) => (
            <Skeleton key={i} className='h-4 w-14 shrink-0' />
          ))}
        </header>

        <main className='grid gap-4 lg:grid-cols-[18rem_minmax(0,1fr)] lg:pt-5'>
          {/* Desktop Filter Sidebar Skeleton */}
          <aside className='order-1 hidden h-fit rounded-xl border border-gray-200 bg-white p-4 shadow-sm lg:sticky lg:top-50 lg:block'>
            <div className='space-y-6'>
              {Array.from({ length: 4 }).map((_, groupIdx) => (
                <div key={groupIdx} className='space-y-3'>
                  <Skeleton className='h-4 w-24' />
                  {Array.from({ length: 4 }).map((_, itemIdx) => (
                    <div key={itemIdx} className='flex items-center gap-2'>
                      <Skeleton className='h-4 w-4 rounded' />
                      <Skeleton className='h-3 w-28' />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </aside>

          {/* Product Grid Skeleton */}
          <div className='order-3 flex flex-col justify-between gap-8 lg:order-2'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <div key={i} className='flex flex-col gap-2 p-2'>
                  <Skeleton className='aspect-square w-full rounded-lg' />
                  <Skeleton className='h-4 w-3/4' />
                  <Skeleton className='h-3 w-1/2' />
                  <div className='flex items-center justify-between'>
                    <Skeleton className='h-4 w-16' />
                    <Skeleton className='h-4 w-10' />
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Skeleton */}
            <div className='my-8 flex justify-center gap-2' dir='ltr'>
              <Skeleton className='h-9 w-20 rounded-md' />
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className='h-9 w-9 rounded-md' />
              ))}
              <Skeleton className='h-9 w-20 rounded-md' />
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export function ProductDetailsLoadingSkeleton() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading product"
      className="min-h-screen bg-white px-2 pb-28 pt-28 text-[#23254e] lg:pb-0 lg:pt-44"
    >
      <div className="mx-auto w-full max-w-[1676px]">
        <Skeleton className="mb-6 h-4 w-72" />

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(330px,2.6fr)_minmax(390px,3.7fr)_minmax(300px,2.55fr)]">
          <div>
            <Skeleton className="mx-auto aspect-square w-full max-w-105 rounded-2xl" />
            <div className="mt-4 flex justify-center gap-2 lg:justify-start">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-[72px] w-[72px] rounded-lg" />
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-8 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="mt-8 h-5 w-20" />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-20 rounded-lg" />
              ))}
            </div>
          </div>

          <aside className="hidden h-105 rounded-xl border border-gray-200 bg-gray-50 p-5 lg:block">
            <Skeleton className="mb-6 h-6 w-28" />
            <Skeleton className="mb-4 h-16 w-full" />
            <Skeleton className="mb-4 h-12 w-full" />
            <Skeleton className="mb-8 h-12 w-full" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </aside>
        </section>

        <div className="mt-8 space-y-4 border-t border-gray-200 pt-8">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-full max-w-5xl" />
          <Skeleton className="h-5 w-4/5 max-w-5xl" />
          <Skeleton className="h-5 w-2/3 max-w-5xl" />
        </div>
      </div>
    </main>
  )
}

export function RegistrationLoadingSkeleton() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading registration"
      className="min-h-screen bg-muted/40 px-4 py-6 sm:px-6 sm:py-10"
    >
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col justify-between gap-10">
        <div className="flex items-center justify-between">
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="h-8 w-36" />
          <div className="size-10" />
        </div>

        <section className="grid flex-1 items-center gap-8 lg:grid-cols-[1fr_28rem]">
          <Skeleton className="hidden min-h-120 rounded-2xl lg:block" />
          <div className="rounded-2xl border border-border/80 bg-background p-5 shadow-sm sm:p-8">
            <Skeleton className="mb-5 h-11 w-11 rounded-xl lg:hidden" />
            <Skeleton className="h-7 w-40" />
            <Skeleton className="mt-3 h-5 w-64" />
            <Skeleton className="mt-8 h-11 w-full rounded-lg" />
            <Skeleton className="mt-5 h-5 w-full" />
            <Skeleton className="mt-8 h-12 w-full rounded-lg" />
          </div>
        </section>

        <Skeleton className="mx-auto h-4 w-72" />
      </div>
    </main>
  )
}

export function ProfileLoadingSkeleton() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading profile"
      className="profile-page min-h-screen px-3 pb-14 pt-20 sm:px-6 lg:px-8 lg:pb-12 lg:pt-28"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-5 flex items-center justify-between gap-4 lg:mb-6">
          <div>
            <Skeleton className="mb-3 h-3 w-28" />
            <Skeleton className="h-7 w-44" />
          </div>
          <Skeleton className="hidden h-9 w-36 rounded-lg sm:block" />
        </div>

        <div className="mb-4 flex gap-2 overflow-hidden lg:hidden">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-28 shrink-0 rounded-full" />
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-6">
          <aside className="hidden rounded-2xl border border-[#f0f0f1] bg-white p-5 lg:block">
            <div className="mb-6 flex items-center gap-3">
              <Skeleton className="size-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
            {Array.from({ length: 7 }).map((_, index) => (
              <Skeleton key={index} className="mb-3 h-11 w-full rounded-lg" />
            ))}
          </aside>

          <section className="space-y-4">
            <div className="rounded-2xl border border-[#f0f0f1] bg-white p-5 sm:p-7">
              <div className="mb-7 flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="hidden size-9 rounded-full sm:block" />
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-12 w-full rounded-lg" />
                  </div>
                ))}
              </div>
              <div className="mt-7 flex justify-end gap-2 border-t border-[#f0f0f1] pt-5">
                <Skeleton className="h-9 w-24 rounded-lg" />
                <Skeleton className="h-9 w-32 rounded-lg" />
              </div>
            </div>
            <div className="rounded-2xl border border-[#f0f0f1] bg-white p-5 sm:p-7">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="mt-3 h-4 w-64" />
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 rounded-lg" />
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
