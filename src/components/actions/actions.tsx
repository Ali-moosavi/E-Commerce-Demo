"use server"

import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { createUserSchema } from "@/lib/user-schema"
import type { CreateUserInput } from "@/lib/user-schema"
import { redirect } from "next/navigation"
import { getDb, ready } from "@/lib/db"
import { randomUUID } from "node:crypto"
import type { PRODUCT_TYPE } from "@/types/types"
import type { CartProduct, UserCart } from "@/types/cart"

type AuthResult =
  | {
      success: true
      user: {
        id: string
        email: string
        name: string
      }
    }
  | {
      success: false
      error: string
    }

function getAuthErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message
  }

  return "Authentication failed. Please try again."
}

export async function userExist({ identifier }: { identifier: string }) {
  const email = identifier.trim().toLowerCase()

  if (!email) return false

  try {
    await ready()
    const context = await auth.$context
    const userRecord = await context.internalAdapter.findUserByEmail(email)
    return Boolean(userRecord?.user)
  } catch {
    return false
  }
}

export async function signUpUser(data: CreateUserInput): Promise<AuthResult> {
  const parsed = createUserSchema.safeParse(data)

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid form data.",
    }
  }

  try {
    await ready()
    const response = await auth.api.signUpEmail({
      body: {
        email: parsed.data.identifier.trim().toLowerCase(),
        password: parsed.data.password,
        name: parsed.data.fullname.trim(),
      },
    })

    return {
      success: true,
      user: {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
      },
    }
  } catch (error) {
    console.error('[auth] signUpEmail failed:', error)
    return {
      success: false,
      error: getAuthErrorMessage(error),
    }
  }
}

export async function signInUser({
  identifier,
  password,
}: {
  identifier: string
  password: string
}): Promise<AuthResult> {
  try {
    await ready()
    const response = await auth.api.signInEmail({
      body: {
        email: identifier.trim().toLowerCase(),
        password,
      },
    })

    return {
      success: true,
      user: {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
      },
    }
  } catch (error) {
    console.error('[auth] signInEmail failed:', error)
    return {
      success: false,
      error: getAuthErrorMessage(error),
    }
  }
}

export async function signOutAction() {
  await auth.api.signOut({
    headers: await headers(),
  })
  redirect("/")
}

export async function createUserCart(userId: string, products: PRODUCT_TYPE) {
  await ready()
  const pool = getDb()
  const id = randomUUID()
  const now = new Date().toISOString()
  const addedProducts: CartProduct[] = [
    {
      productId: products.id,
      categoryId: products.Categoryid,
      name: products.name,
      price: products.price,
      images: products.image,
      describtion: products.describtion,
      badge: products.badge,
      quantity: 1,
    },
  ]

  await pool.query(
    `INSERT INTO "carts" ("id", "userId", "addedProducts", "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, $5)`,
    [id, userId, JSON.stringify(addedProducts), now, now],
  )

  return normalizeCart({
    id: userId,
    userId,
    storageId: id,
    addedProducts,
  })
}

function normalizeCart(cart: UserCart): UserCart {
  return {
    ...cart,
    addedProducts: (cart.addedProducts ?? []).map((item) => ({
      ...item,
      quantity: Math.max(1, Number(item.quantity) || 1),
    })),
  }
}

export async function getUserCart(
  userId: string,
): Promise<UserCart | null> {
  if (!userId) return null

  await ready()
  const pool = getDb()
  const { rows } = await pool.query(
    'SELECT * FROM "carts" WHERE "userId" = $1',
    [userId],
  )

  const row = rows[0] as
    | { id: string; userId: string; addedProducts: string }
    | undefined

  if (!row) return null

  return normalizeCart({
    id: userId,
    userId,
    storageId: row.id,
    addedProducts: JSON.parse(row.addedProducts) as CartProduct[],
  })
}

function toCartProduct(product: PRODUCT_TYPE): CartProduct {
  return {
    productId: product.id,
    categoryId: product.Categoryid,
    name: product.name,
    price: product.price,
    images: product.image,
    describtion: product.describtion,
    badge: product.badge,
    quantity: 1,
  }
}

function isSameCartProduct(item: CartProduct, productKey: string) {
  return String(item.productId ?? item.name) === productKey
}

export async function addProductsToCart(
  userId: string,
  products: PRODUCT_TYPE,
) {
  if (!userId) {
    throw new Error("A user must be signed in to use the cart")
  }

  const cart = await getUserCart(userId)

  if (!cart) {
    await createUserCart(userId, products)
    return
  }

  const productKey = String(products.id)
  const productIndex = cart.addedProducts.findIndex(
    (item) =>
      isSameCartProduct(item, productKey) ||
      (!item.productId && item.name === products.name),
  )
  const addedProducts = [...cart.addedProducts]

  if (productIndex >= 0) {
    const item = addedProducts[productIndex]
    addedProducts[productIndex] = {
      ...item,
      quantity: (item.quantity ?? 1) + 1,
    }
  } else {
    addedProducts.push(toCartProduct(products))
  }

  await ready()
  const pool = getDb()
  const now = new Date().toISOString()
  await pool.query(
    'UPDATE "carts" SET "addedProducts" = $1, "updatedAt" = $2 WHERE "id" = $3',
    [JSON.stringify(addedProducts), now, cart.storageId ?? cart.id],
  )
}

export async function updateCartItemQuantity(
  userId: string,
  productKey: string,
  quantity: number,
) {
  const cart = await getUserCart(userId)
  if (!cart) return

  const addedProducts = cart.addedProducts
    .map((item) =>
      isSameCartProduct(item, productKey)
        ? { ...item, quantity: Math.max(0, Math.floor(quantity)) }
        : item,
    )
    .filter((item) => (item.quantity ?? 0) > 0)

  await ready()
  const pool = getDb()
  const now = new Date().toISOString()
  await pool.query(
    'UPDATE "carts" SET "addedProducts" = $1, "updatedAt" = $2 WHERE "id" = $3',
    [JSON.stringify(addedProducts), now, cart.storageId ?? cart.id],
  )
}

export async function removeCartProduct(
  userId: string,
  productKey: string,
) {
  const cart = await getUserCart(userId)
  if (!cart) return

  const addedProducts = cart.addedProducts.filter(
    (item) => !isSameCartProduct(item, productKey),
  )

  await ready()
  const pool = getDb()
  const now = new Date().toISOString()
  await pool.query(
    'UPDATE "carts" SET "addedProducts" = $1, "updatedAt" = $2 WHERE "id" = $3',
    [JSON.stringify(addedProducts), now, cart.storageId ?? cart.id],
  )
}
