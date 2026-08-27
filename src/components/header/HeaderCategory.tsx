'use client'
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import Link from 'next/link';
import { useAppSelector } from '@/redux/setup/hooks';
import type { ProductCategory } from '@/types/types';

export default function HeaderCategory({ isLoading = false }: { isLoading?: boolean }) {
  const {products} = useAppSelector(state =>state.Productstate)
  const [listStats, setListStats] = useState(false);
  const [selectedCategory ,setselectedCategory ] = useState<number>(1)


    const filterdCategory = products.filter((category)=>{
      return category.categoryid == selectedCategory
    })


  return (
    <li
      onMouseEnter={() => setListStats(true)}
    
      className="relative z-20 hidden text-[16px] lg:block"
    >
      <button
        type="button"
        className="flex items-center gap-1 cursor-pointer"
        aria-busy={isLoading}
      >
        <MenuIcon fontSize="inherit" />
        <span>دسته‌بندی کالاها</span>
      </button>

      {listStats && (
        <div
          onMouseOver={() => setListStats(true)}
          onMouseLeave={() => setListStats(false)}
          className="absolute -right-1 top-full mt-2 h-[60vh] w-[70vw] overflow-hidden rounded-b-xl border border-gray-200 bg-white text-black shadow-[0_18px_45px_rgba(0,0,0,0.14)] z-110 grid grid-cols-[220px_1fr]"
        >
          <div className='col-span-1 grid bg-[#f7f7f7]'>
            {products.map((Category: ProductCategory) => (
              <Link
                key={Category.categoryid}
                href={`/category/${Category.categoryid}`}
                className={`flex items-center justify-between px-4 py-3 text-right text-sm transition-all duration-200 ${
                  selectedCategory === Category.categoryid
                    ? 'bg-white text-[#ef4056] shadow-[inset_4px_0_0_#ef4056]'
                    : 'text-gray-700 hover:bg-white hover:text-[#ef4056]'
                }`}
                onClick={() => setListStats(false)}
                onMouseOver={() => setselectedCategory(Category.categoryid)}
              >
                <span>{Category.name}</span>
                <span className={`text-lg leading-none ${selectedCategory === Category.categoryid ? 'text-[#ef4056]' : 'text-gray-400'}`}>
                  ‹
                </span>
              </Link>
            ))}
          </div>

          <div className='col-span-1 p-4'>
            {isLoading ? (
              <div className="grid grid-cols-4 gap-x-8 gap-y-5">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="space-y-3">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                    <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
                    <div className="h-3 w-2/3 animate-pulse rounded bg-gray-100" />
                  </div>
                ))}
              </div>
            ) : selectedCategory && filterdCategory[0] ? (
              <div className='grid grid-cols-4 gap-x-8 gap-y-5'>
                {filterdCategory[0].children?.map((child: ProductCategory['children'][number]) => (
                  <div key={child.id} className='min-w-0'>
                    <Link
                      href={`/category/${child.parentcategoryid}`}
                      className='mb-2 block text-sm font-bold text-gray-800 hover:text-[#ef4056]'
                      onClick={() => setListStats(false)}
                    >
                      {child.name}
                    </Link>

                    {child.children && child.children.length > 0 && (
                      <ul className='space-y-1.5 border-r border-gray-100 pr-2'>
                        {child.children.map((subChild: ProductCategory['children'][number]) => (
                          <li key={subChild.id}>
                            <Link
                              href={`/category/${subChild.id}`}
                              className='block text-xs text-gray-500 transition-colors hover:text-[#ef4056]'
                              onClick={() => setListStats(false)}
                            >
                              {subChild.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className='flex h-full items-center justify-center text-sm text-gray-400'>
                انتخاب دسته‌بندی
              </div>
            )}
          </div>
        </div>
      )}
      <div className={`absolute w-screen h-screen top-8 -right-5 bg-black/20 z-90
         ${listStats ? '' : 'hidden'}`} />
    </li>
  );
} 

