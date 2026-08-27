'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import type { PRODUCT_TYPE } from '@/types/types'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import StarRoundedIcon from '@mui/icons-material/StarRounded'



export default function TopProducts({ products }: { products: PRODUCT_TYPE[] }) {
  const trackRef = useRef<HTMLDivElement>(null)

  const scrollByAmount = (direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: 'smooth' })
  }

  return (
    <section className="relative mx-auto max-w-[1676px] px-4 pb-4  pt-6 sm:px-6 lg:px-8 lg:pt-12">
      <div className="rounded-2xl bg-[#ef4056] p-4  sm:p-5 lg:p-6 ">
        <div className="group/row relative ">
          <button
            type="button"
            aria-label="قبلی"
            onClick={() => scrollByAmount(1)}
            className="absolute right-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 opacity-0 shadow-md transition hover:text-[#ef4056] group-hover/row:opacity-100 lg:flex"
          >
            <ChevronRightRoundedIcon sx={{ fontSize: 22 }} />
          </button>
          <button
            type="button"
            aria-label="بعدی"
            onClick={() => scrollByAmount(-1)}
            className="absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 opacity-0 shadow-md transition hover:text-[#ef4056] group-hover/row:opacity-100 lg:flex"
          >
            <ChevronLeftRoundedIcon sx={{ fontSize: 22 }} />
          </button>

          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory overflow-x-auto lg:overflow-hidden rounded-xl   bg-white divide-x divide-gray-200   z-50 "
          >

            <div className="flex w-40 shrink-0 snap-start flex-col items-center justify-center  bg-[#ef4056] px-4 py-6 sm:w-44 lg:w-48 gap-5">
              <img
                src="/amazings.svg"
                alt="Digikala logo"
                className="h-auto w-24 object-contain sm:w-28"
              />
              <h2 className="text-center text-lg font-[iransansBold] text-white lg:text-xl">
                پرفروش‌ترین‌ها
              </h2>
              <Link
                href="/category/1"
                className="mt-2 flex items-center text-xs text-white/90 transition hover:text-white lg:text-sm"
              >
                مشاهده همه
                <ChevronLeftRoundedIcon sx={{ fontSize: 18 }} />
              </Link>
            </div>


            {products.map((product) => (
              <Link
                key={product.id}
                href={`/category/${product.Categoryid}/${product.id}`}
                className="group w-40 shrink-0 snap-start sm:w-44 lg:w-48"
              >
                <article className="flex h-full flex-col p-2.5 transition-colors duration-200 hover:bg-gray-50">
                  <div className="relative mb-2 aspect-square w-full">
                    <Image
                      src={`/${product.image[0]}`}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 160px, (max-width: 1024px) 176px, 192px"
                      className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                    />
                    {product.badge && (
                      <span className="absolute left-1 top-1 rounded bg-[#ef4056] px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="line-clamp-2 min-h-10 text-[11px] leading-5 text-[#3f4064] lg:text-xs">
                    {product.name}
                  </h3>

                  {product.rate ? (
                    <div className="mt-1 flex items-center gap-0.5">
                      <StarRoundedIcon sx={{ fontSize: 14, color: '#f5a623' }} />
                      <span className="text-[10px] text-[#81858b]">{product.rate}</span>
                    </div>
                  ) : null}

                  <div className="mt-auto pt-2">
                    <p className="flex justify-end items-baseline gap-1 text-[#3f4064] text">
                      <span className="text-xs font-[iransansBold] lg:text-sm">{product.price}</span>
                      <span className="text-[10px] text-[#81858b]">تومان</span>
                    </p>
                  </div>
                </article>
              </Link>
            ))}


            <Link
              href="/category/1"
              className="flex w-40 shrink-0 snap-start flex-col items-center justify-center gap-2 p-2.5 text-[#3f4064] transition-colors hover:bg-gray-50 hover:text-[#ef4056] sm:w-44 lg:w-48"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-current">
                <ChevronLeftRoundedIcon sx={{ fontSize: 22 }} />
              </span>
              <span className="text-xs lg:text-sm">مشاهده همه</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}