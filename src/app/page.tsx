import HomeContent from '@/components/home/HomeContent'
import type { PRODUCT_TYPE } from '@/types/types'
import { getAllProducts } from '@/lib/data'
import Footer from '@/components/footer/Footer'

async function Home() {

  const products: PRODUCT_TYPE[] = getAllProducts()

  const topProducts = [...products]
    .sort((a, b) => Number(b.rate) - Number(a.rate))
    .slice(0, 12)

  return (
    <>
      <HomeContent products={topProducts} />
      <Footer />
    </>

  )
}

export default Home
