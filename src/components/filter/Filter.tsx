'use client'

import { useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { SUCCES_PROPERTIES_TYPE } from '@/types/types'

type FilterProps = {
  properties: SUCCES_PROPERTIES_TYPE[]
  onFilterChange?: (ids: number[]) => void
}

export default function Filter({ properties, onFilterChange }: FilterProps) {
  const [propertiesId, setPropertiesId] = useState<number[]>([])

  const changeHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    optionId: number,
  ) => {
    const checked = e.target.checked

    setPropertiesId((prev) => {
      const next = checked
        ? prev.includes(optionId)
          ? prev
          : [...prev, optionId]
        : prev.filter((id) => id !== optionId)

      return next
    })

    const nextIds = checked
      ? propertiesId.includes(optionId)
        ? propertiesId
        : [...propertiesId, optionId]
      : propertiesId.filter((id) => id !== optionId)

    onFilterChange?.(nextIds)
  }

  return (
    <div className='w-full border-b border-gray-200 pb-3'>
      <div className='mb-3 border-b border-gray-200 pb-2'>
        <h1 className='text-lg px-1 font-bold text-gray-800'>فیلترها</h1>
      </div>

      <Accordion  className=' h-fit '>
        {properties.map((property) => (
          <AccordionItem
            key={property.filterId}
            value={String(property.filterId)}
            className='border-b border-gray-200'
          >
            <AccordionTrigger className='py-3 text-right text-md font-medium text-gray-700'>
              {property.nameFa}
            </AccordionTrigger>
            <AccordionContent className='pb-3 text-md overflow-y-visible pt-1'>
              <div className='space-y-2'>
                {property.options.map((option) => (
                  <label
                    key={option.id}
                    className='flex cursor-pointer items-center gap-2 text-sm text-gray-700 hover:text-red-600'
                  >
                    <input
                      type='checkbox'
                      id={String(option.id)}
                      value={option.valueFa}
                      checked={propertiesId.includes(option.id)}
                      onChange={(e) => changeHandler(e, option.id)}
                      className='h-4 w-4 accent-red-500 cursor-pointer'
                    />
                    <span>{option.valueFa}</span>
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
