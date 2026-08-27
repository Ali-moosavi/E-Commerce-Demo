'use client'

import Slider from '@/components/slider/Slider'
import TopProducts from '@/components/home/TopProducts'
import type { PRODUCT_TYPE } from '@/types/types'

export default function HomeContent({ products }: { products: PRODUCT_TYPE[] }) {
  return (
    <main>
      <Slider />
      <TopProducts products={products} />
    </main>
  )
}
