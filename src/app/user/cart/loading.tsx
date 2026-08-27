
export default function CartLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="در حال بارگذاری سبد خرید"
      className="min-h-screen bg-[#f7f7f8] px-3 pb-12 pt-24 lg:px-8 lg:pt-40"
    >
      <div className="mx-auto max-w-[1280px] animate-pulse">
        <div className="mb-5 h-8 w-32 rounded bg-gray-200" />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_350px]">
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="h-56 rounded-xl border border-gray-200 bg-white"
              />
            ))}
          </div>
          <div className="hidden h-80 rounded-xl border border-gray-200 bg-white lg:block" />
        </div>
      </div>
    </main>
  )
}
