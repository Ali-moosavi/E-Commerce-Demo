import CategoryClientView from '@/components/category/CategoryClientView'
import {
  getCategoryTree,
  getAllProducts,
  getAllFilters,
  findCategoryById,
  collectCategoryIds,
} from '@/lib/data'
import type { PRODUCT_TYPE, CATEGORY_TYPE } from '@/types/types'

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  const categories = getCategoryTree()

  const getAllIds = (items: CATEGORY_TYPE[]): string[] => {
    return items.flatMap((item) => {
      const id = String(item.categoryid ?? item.id)
      const childIds = item.children ? getAllIds(item.children) : []
      return [id, ...childIds]
    })
  }

  return getAllIds(categories).map((categoryid) => ({
    categoryid,
  }))
}

interface PageProps {
  params: Promise<{ categoryid: string }>
}

export default async function CategoryIdPage({ params }: PageProps) {
  const { categoryid } = await params
  const targetId = Number(categoryid)

  const properties = getAllFilters()
  const categories = getCategoryTree()
  const products = getAllProducts()

  let categoryName = ''
  let categoryProducts: PRODUCT_TYPE[] = []

  if (Number.isFinite(targetId)) {
    const targetCategory = findCategoryById(targetId, categories)
    categoryName = targetCategory?.name ?? ''
    const categoryIds = targetCategory ? collectCategoryIds(targetCategory) : [targetId]

    categoryProducts = products.filter((product) =>
      categoryIds.includes(Number(product.Categoryid)),
    )
  }

  return (
    <CategoryClientView
      categoryName={categoryName}
      allProducts={categoryProducts}
      properties={properties}
    />
  )
}
