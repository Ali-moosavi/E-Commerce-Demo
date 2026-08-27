'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
export type CardVariant = 'smalllist' | 'largelist'

export interface CardProps {
  name: string
  describtion?: string
  price: string
  rate: string
  image: string[]
  badge?: string
}

const Card = ({ name, describtion, price, rate, image, badge }: CardProps) => {
  const displayName = name.length > 92 ? `${name.slice(0, 92)}...` : name
  
  const [size, setSize] = useState<CardVariant>('smalllist')
  useEffect(() => {
    const updateSize = () => {
      setSize(window.innerWidth < 640 ? 'smalllist' : 'largelist')
    }

    updateSize()
    window.addEventListener('resize', updateSize)

    return () => window.removeEventListener('resize', updateSize)
  }, [])

  return (
    <article
      dir="rtl"
      className={`group box-border flex w-full max-w-full h-full overflow-hidden border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        size === 'smalllist' ? 'flex-row gap-3 p-3 items-center' : 'flex-col gap-3 p-4'
      } mx-auto`}
    >
      <div
        className={`relative overflow-hidden rounded-xl flex ${
          size === 'smalllist' ? 'min-w-25 max-w-30 shrink-0' : 'w-full'
        }`}
      >
        <Image
          src={`/${image[0]}`}
          alt={displayName}
          width={200}
          height={200}
          className={`object-contain object-center transition-transform duration-300 group-hover:scale-105 mx-auto ${
            size === 'smalllist' ? 'aspect-square' : 'aspect-square'
          }`}
        />
      </div>

      <div className={`flex flex-1 flex-col justify-between ${size === 'smalllist' ? 'py-1' : 'pt-3'}`}>
        {badge ? (
          <span className="mb-2 w-fit rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-medium text-red-600">
            {badge}
          </span>
        ) : (<span className='mb-6 w-fit px-2.5 py-1 '>
          
        </span>)}

        <h2 className="text-xs font-semibold leading-7 text-[#474c4d] sm:text-[15px]">
          {displayName}
        </h2>

        <div className="mt-3 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[#474c4d] text-xs  font-semibold justify-end">
            <span>{rate}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4 text-yellow-500"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.539 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.049 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
            </svg>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button className="shrink-0 rounded-full border border-gray-300 px-3 py-1.5 text-[12px] font-medium text-gray-700 transition hover:border-red-500 hover:text-red-500">
              مشاهده
            </button>
            <p className="min-w-0 text-[#474c4d] font-bold text-sm sm:text-base truncate">{price} تومان</p>
          </div>
        </div>
      </div>
    </article>
  )
}

export default Card