'use client'

import { useState } from 'react'
import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded'
import { Minus, Plus, Trash2 } from 'lucide-react'
import type { PRODUCT_TYPE } from '@/types/types'
import {
  addProductsToCart,
  removeCartProduct,
  updateCartItemQuantity,
} from '../actions/actions'
import { authClient } from '@/lib/auth-clients'

interface AddToCartProps {
  userId?: string
  product: PRODUCT_TYPE
  initialQuantity?: number
}

export default function AddToCart({
  userId,
  product,
  initialQuantity = 0,
}: AddToCartProps) {
  const { data: clientSession } = authClient.useSession()
  const effectiveUserId = userId ?? clientSession?.user.id
  const [quantity, setQuantity] = useState(initialQuantity)
  const [isPending, setIsPending] = useState(false)
  const productKey = String(product.id)

  const runCartAction = async (
    action: () => Promise<void>,
    nextQuantity: number,
  ) => {
    if (!effectiveUserId || isPending) return

    setIsPending(true)
    try {
      await action()
      setQuantity(nextQuantity)
    } finally {
      setIsPending(false)
    }
  }

  const increase = () =>
    runCartAction(
      () => addProductsToCart(effectiveUserId as string, product),
      Math.max(1, quantity + 1),
    )

  const decrease = () => {
    if (quantity <= 1) {
      return runCartAction(
        () => removeCartProduct(effectiveUserId as string, productKey),
        0,
      )
    }

    return runCartAction(
      () =>
        updateCartItemQuantity(
          effectiveUserId as string,
          productKey,
          quantity - 1,
        ),
      quantity - 1,
    )
  }

  const remove = () =>
    runCartAction(
      () => removeCartProduct(effectiveUserId as string, productKey),
      0,
    )

  if (quantity === 0) {
    return (
      <button
        type="button"
        disabled={!effectiveUserId || isPending}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#ef4056] text-sm font-[iransansBold] text-white transition hover:bg-[#d9364d] disabled:cursor-not-allowed disabled:opacity-60"
        onClick={increase}
      >
        <AddShoppingCartRoundedIcon sx={{ fontSize: 20 }} />
        <span>افزودن به سبد خرید</span>
      </button>
    )
  }

  return (
    <div
      className="flex h-12 w-full items-center justify-between rounded-lg border border-[#ef4056] bg-white px-2 text-[#ef4056]"
      aria-label="کنترل تعداد محصول"
    >
      <button
        type="button"
        onClick={increase}
        disabled={isPending}
        aria-label="افزایش تعداد"
        className="flex size-9 items-center justify-center rounded-md hover:bg-[#fff0f1] disabled:opacity-50"
      >
        <Plus className="size-5" />
      </button>
      <span
        className="min-w-8 text-center text-sm font-[iransansBold]"
        aria-live="polite"
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={decrease}
        disabled={isPending}
        aria-label={quantity === 1 ? 'حذف محصول' : 'کاهش تعداد'}
        className="flex size-9 items-center justify-center rounded-md hover:bg-[#fff0f1] disabled:opacity-50"
      >
        {quantity === 1 ? (
          <Trash2 className="size-4" />
        ) : (
          <Minus className="size-5" />
        )}
      </button>
      <button
        type="button"
        onClick={remove}
        disabled={isPending}
        aria-label="حذف محصول از سبد خرید"
        className="mr-1 flex size-9 items-center justify-center rounded-md text-[#81858b] hover:bg-[#f7f7f8] hover:text-[#ef4056] disabled:opacity-50"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  )
}
