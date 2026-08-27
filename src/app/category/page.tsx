
import React from 'react'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { SUCCES_PRODUCTS_TYPE } from '@/types/types'
import MobileCategoryTree from '@/components/category/MobileCategoryTree'
import Link from 'next/link'
import ArrowRight from '@mui/icons-material/ArrowBackIosRounded'
import { getCategoryTree } from '@/lib/data'

async function Category() {
 
   const Categories = getCategoryTree() as unknown as SUCCES_PRODUCTS_TYPE

  return (
    <div className="min-h-screen bg-[#f2f2f2]">
      <header className="sticky top-0 z-40 border-b border-[#e5e5e5] bg-white px-3 py-3 md:px-6">
        <div className="mx-auto flex max-w-300 items-center gap-3">
          <Link
            href={`/`}
            className="flex h-10 w-10 shrink-0 items-center justify-center bg-white text-[#1f1f1f]"
            aria-label="بازگشت"
          >
            <ArrowRight sx={{ fontSize: 18 }} />
          </Link>

          <h1 className="shrink-0 text-sm font-[iransansBold] text-[#1f1f1f]">دسته‌بندی‌ها</h1>

          <div className="relative flex-1">
            <input
              type="text"
              placeholder="جستجو در دسته‌بندی‌ها"
              className="w-full border border-[#e5e5e5] bg-[#f7f7f7] px-4 py-2.5 pr-10 text-sm text-[#1f1f1f] outline-none transition rounded-full placeholder:text-[#8a8a8a] focus:border-[#19bfd3] focus:bg-white"
            />
            <SearchRoundedIcon
              sx={{ fontSize: 20, color: '#8a8a8a' }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            />
          </div>
        </div>
      </header>

      <MobileCategoryTree Categories={Categories} />
    </div>
  )
}

export default Category
