export type CartProduct = {
  productId?: number
  categoryId?: number
  name: string
  price: string
  images: string[]
  describtion: string
  badge?: string
  quantity?: number
}

export type UserCart = {
  id: string
  userId?: string
  storageId?: string
  addedProducts: CartProduct[]
}
