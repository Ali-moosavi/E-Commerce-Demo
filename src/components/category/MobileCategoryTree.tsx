'use client'
import type{ SUCCES_PRODUCTS_TYPE } from '@/types/types'
import { useMemo, useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import Link from 'next/link'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'

export default function MobileCategoryTree({ Categories }: { Categories: SUCCES_PRODUCTS_TYPE }) {
  const [selectedCategory, setSelectedCategory] = useState<number>(Categories[0]?.categoryid ?? 1)

  const activeCategory = useMemo(
    () => Categories.find((category) => category.categoryid === selectedCategory) ?? Categories[0],
    [Categories, selectedCategory],
  )

  return (
    <div className="w-full bg-[#f0f0f0] lg:hidden">
      <div className="mx-auto max-w-300 overflow-hidden border border-[#e5e5e5] bg-white">
        <div className="flex min-h-[calc(100vh-8.5rem)] flex-row">

          <div className="w-24 shrink-0 overflow-y-auto bg-[#f3f3f3] md:border-l md:border-[#e5e5e5]">
            {Categories.map((category) => {
              const isSelected = category.categoryid === (activeCategory?.categoryid ?? 0)
              return (
                <button
                  key={category.categoryid}
                  type="button"
                  onClick={() => setSelectedCategory(category.categoryid)}
                  className={`relative flex w-full cursor-pointer items-center justify-center border-b border-[#e5e5e5] py-5 text-center text-[12px] transition-all ${
                    isSelected
                      ? 'bg-white font-[iransansBold] text-[#1f1f1f]'
                      : 'bg-[#f3f3f3] font-medium text-[#4b4b4b] hover:bg-[#ebebeb]'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute inset-y-0 right-0 w-1 rounded-r-full bg-[#ef4056]" />
                  )}
                  {category.name}
                </button>
              )
            })}
          </div>


          <div className="flex-1 overflow-y-auto bg-white pb-6">
            {activeCategory ? (
              <>
                <Link
                  href={`/category/${activeCategory.categoryid}`}
                  className="flex items-center justify-between px-4 py-3.5 text-[13px] font-[iransansBold] text-[#23254e]"
                >
                  همه کالاهای {activeCategory.name}
                  <ChevronLeftRoundedIcon sx={{ fontSize: 18, color: '#a1a3a8' }} />
                </Link>

                <div className="divide-y divide-[#f0f0f0] border-t border-[#f0f0f0]">
                  {activeCategory.children.map((childCategory) => (
                    <Accordion key={childCategory.id} dir="rtl" className="w-full">
                      <AccordionItem value={String(childCategory.id)} className="border-0 bg-white">
                        <div className="flex items-center justify-between px-4 py-3">
                          <Link
                            href={`/category/${childCategory.id}`}
                            className="flex-1 text-right text-[13px] font-medium text-[#23254e]"
                          >
                            {childCategory.name}
                          </Link>

                          {childCategory.children.length > 0 && (
                            <AccordionTrigger className="shrink-0 p-0" />
                          )}
                        </div>

                        <AccordionContent className="px-0 pb-0">
                          <div className="grid sm:grid-cols-2">
                            {childCategory.children.length > 0 ? (
                              childCategory.children.map((subchild) => (
                                <Link
                                  href={`/category/${subchild.id}`}
                                  key={subchild.id}
                                  className="flex items-center justify-between border-b border-[#f0f0f0] bg-white px-4 py-3 text-right text-sm text-[#434343] transition hover:bg-[#f7f7f7]"
                                >
                                  <span className="line-clamp-2">{subchild.name}</span>
                                  <ChevronLeftRoundedIcon
                                    sx={{ fontSize: 16, color: '#c0c2c5' }}
                                  />
                                </Link>
                              ))
                            ) : (
                              <Link
                                href={`/category/${childCategory.id}`}
                                className="flex items-center gap-1 border-b border-[#f0f0f0] bg-white px-4 py-3 text-right text-xs text-[#19bfd3]"
                              >
                                مشاهده محصولات {childCategory.name}
                                <ChevronLeftRoundedIcon sx={{ fontSize: 15 }} />
                              </Link>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
