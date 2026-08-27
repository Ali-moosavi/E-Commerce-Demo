'use client'
import type { PRODUCT_COLOR_TYPE } from "@/types/types"
import {useState}  from 'react'

export default function ProductsColors ({colors}:{colors:PRODUCT_COLOR_TYPE[]}){


    const [selectedColor , setselectedColor] = useState<string>(colors[0]?.name ?? '')
    const colorSelectHandler = (color:PRODUCT_COLOR_TYPE)=>{
        setselectedColor(color.name)
    }

    return(
        <>
        {colors.length > 0 && (
              <div className="mt-7">
                <h3 className="mb-4 text-sm font-[iransansBold]">
                  رنگ:{' '}
                  <span className="font-normal">{selectedColor}</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {colors.map((color) => (
                    <button
                      type="button"
                      key={`${color.name}-${color.hex}`}
                      aria-label={color.name}
                      title={color.name}
                      className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 bg-white ${selectedColor == color.name
                          ? 'border-[#19bfd3]'
                          : 'border-gray-200'
                        }`}
                        onClick={()=>colorSelectHandler(color)}
                    >
                      <span
                        className="h-7 w-7 rounded-full border border-black/10"
                        style={{ backgroundColor: color.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
        </>
    )
}