'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import {
  Check,
  ChevronLeft,
  Clock3,
  CreditCard,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Trash2,
  Truck,
} from 'lucide-react'
import type { CartProduct, UserCart } from '@/types/cart'
import {
  removeCartProduct,
  updateCartItemQuantity,
} from '@/components/actions/actions'

function toLatinDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))
}

function priceToNumber(price: string) {
  return Number(toLatinDigits(price).replace(/[^\d]/g, '')) || 0
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('fa-IR').format(price)
}

function getProductKey(product: CartProduct) {
  return String(product.productId ?? product.name)
}

function getQuantity(product: CartProduct) {
  return Math.max(1, Number(product.quantity) || 1)
}

type CartClientProps = {
  userId: string
  initialCart: UserCart | null
}

export default function CartClient({
  userId,
  initialCart,
}: CartClientProps) {
  const [items, setItems] = useState<CartProduct[]>(
    initialCart?.addedProducts ?? [],
  )
  const [pendingKey, setPendingKey] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const totalItems = items.reduce((sum, item) => sum + getQuantity(item), 0)
  const subtotal = items.reduce(
    (sum, item) => sum + priceToNumber(item.price) * getQuantity(item),
    0,
  )
  const deliveryCost = subtotal > 0 ? 0 : 0

  const updateQuantity = async (item: CartProduct, quantity: number) => {
    const key = getProductKey(item)
    if (pendingKey) return

    setError(null)
    setPendingKey(key)
    try {
      await updateCartItemQuantity(userId, key, quantity)
      if (quantity <= 0) {
        setItems((current) => current.filter((entry) => getProductKey(entry) !== key))
      } else {
        setItems((current) =>
          current.map((entry) =>
            getProductKey(entry) === key ? { ...entry, quantity } : entry,
          ),
        )
      }
    } catch {
      setError('تغییر سبد خرید انجام نشد. دوباره تلاش کنید.')
    } finally {
      setPendingKey(null)
    }
  }

  const removeItem = async (item: CartProduct) => {
    const key = getProductKey(item)
    if (pendingKey) return

    setError(null)
    setPendingKey(key)
    try {
      await removeCartProduct(userId, key)
      setItems((current) => current.filter((entry) => getProductKey(entry) !== key))
    } catch {
      setError('حذف کالا انجام نشد. دوباره تلاش کنید.')
    } finally {
      setPendingKey(null)
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f7f8] pb-28 pt-24 text-[#3f4064] lg:pb-12 lg:pt-40">
      <div className="mx-auto max-w-[1280px] px-3 sm:px-5 lg:px-8">
        <nav className="mb-4 flex items-center gap-1 text-[11px] text-[#81858b] sm:text-xs">
          <Link href="/" className="hover:text-[#19bfd3]">
            خانه
          </Link>
          <ChevronLeft className="size-4" />
          <span className="text-[#3f4064]">سبد خرید</span>
        </nav>

        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-[iransansBold] text-[#23254e] sm:text-2xl">
              سبد خرید
            </h1>
            {items.length > 0 && (
              <p className="mt-2 text-xs text-[#81858b]">
                {formatPrice(totalItems)} کالا در سبد خرید شما
              </p>
            )}
          </div>
          <Link
            href="/"
            className="hidden items-center gap-1 text-xs text-[#19bfd3] sm:flex"
          >
            ادامه خرید
            <ChevronLeft className="size-4" />
          </Link>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-[#ffd5da] bg-[#fff5f6] px-4 py-3 text-xs text-[#c92f45]"
          >
            {error}
          </div>
        )}

        {items.length === 0 ? (
          <section className="rounded-xl border border-[#e6e6e8] bg-white px-5 py-20 text-center shadow-[0_1px_2px_rgb(0_0_0/2%)]">
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-[#fff0f1] text-[#ef4056]">
              <ShoppingCart className="size-9" />
            </div>
            <h2 className="mt-5 text-base font-[iransansBold] text-[#23254e]">
              سبد خرید شما خالی است
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-[#81858b]">
              می‌توانید با مشاهده محصولات و افزودن آن‌ها به سبد خرید، سفارش خود
              را ثبت کنید.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#ef4056] px-7 py-3 text-xs font-[iransansBold] text-white transition hover:bg-[#d9364d]"
            >
              مشاهده محصولات
              <ChevronLeft className="size-4" />
            </Link>
          </section>
        ) : (
          <>
            <div className="mb-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_350px]">
              <section className="min-w-0 space-y-3">
                <div className="rounded-xl border border-[#e6e6e8] bg-white px-4 py-4 sm:px-5">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-full bg-[#eefaff] text-[#19bfd3]">
                      <Truck className="size-5" />
                    </span>
                    <div>
                      <p className="text-xs font-[iransansBold] text-[#23254e]">
                        ارسال به سراسر ایران
                      </p>
                      <p className="mt-1 text-[11px] text-[#81858b]">
                        زمان ارسال پس از ثبت سفارش مشخص می‌شود.
                      </p>
                    </div>
                    <Check className="mr-auto size-5 text-[#00a049]" />
                  </div>
                </div>

                {items.map((item) => {
                  const key = getProductKey(item)
                  const quantity = getQuantity(item)
                  const isPending = pendingKey === key

                  return (
                    <article
                      key={key}
                      className="rounded-xl border border-[#e6e6e8] bg-white p-4 shadow-[0_1px_2px_rgb(0_0_0/2%)] sm:p-5"
                    >
                      <div className="flex gap-4 sm:gap-5">
                        <div className="relative size-28 shrink-0 rounded-lg bg-white sm:size-36">
                          <Image
                            src={`/${item.images[0] ?? 's25fe.webp'}`}
                            alt={item.name}
                            fill
                            sizes="144px"
                            className="object-contain p-2"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start gap-2">
                            <div className="min-w-0 flex-1">
                              <h2 className="line-clamp-2 text-sm font-[iransansBold] leading-6 text-[#23254e] sm:text-base">
                                {item.name}
                              </h2>
                              {item.badge && (
                                <span className="mt-2 inline-flex rounded bg-[#fff2f3] px-2 py-1 text-[10px] text-[#ef4056]">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item)}
                              disabled={Boolean(pendingKey)}
                              aria-label="حذف کالا"
                              className="flex size-8 shrink-0 items-center justify-center rounded-full text-[#a1a3a8] transition hover:bg-[#fff0f1] hover:text-[#ef4056] disabled:opacity-40"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>

                          <p className="mt-3 line-clamp-1 text-[11px] text-[#81858b]">
                            {item.describtion}
                          </p>

                          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[#62666d]">
                            <span className="flex items-center gap-1">
                              <ShieldCheck className="size-4 text-[#00a049]" />
                              ضمانت اصالت و سلامت فیزیکی کالا
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock3 className="size-4 text-[#19bfd3]" />
                              آماده ارسال
                            </span>
                          </div>

                          <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item, quantity + 1)}
                                disabled={Boolean(pendingKey)}
                                aria-label="افزایش تعداد"
                                className="flex size-8 items-center justify-center rounded border border-[#ef4056] text-[#ef4056] hover:bg-[#fff0f1] disabled:opacity-40"
                              >
                                <Plus className="size-4" />
                              </button>
                              <span
                                aria-live="polite"
                                className="min-w-7 text-center text-sm font-[iransansBold] text-[#23254e]"
                              >
                                {isPending ? '...' : formatPrice(quantity)}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item, quantity - 1)}
                                disabled={Boolean(pendingKey)}
                                aria-label={
                                  quantity === 1 ? 'حذف کالا' : 'کاهش تعداد'
                                }
                                className="flex size-8 items-center justify-center rounded border border-[#d9d9dc] text-[#62666d] hover:bg-[#f7f7f8] disabled:opacity-40"
                              >
                                {quantity === 1 ? (
                                  <Trash2 className="size-3.5" />
                                ) : (
                                  <Minus className="size-4" />
                                )}
                              </button>
                            </div>
                            <div className="text-left">
                              <strong className="text-base font-[iransansBold] text-[#23254e] sm:text-lg">
                                {formatPrice(priceToNumber(item.price) * quantity)}
                              </strong>
                              <span className="mr-1 text-[10px] text-[#81858b]">
                                تومان
                              </span>
                              {quantity > 1 && (
                                <p className="mt-1 text-[10px] text-[#81858b]">
                                  هر عدد {formatPrice(priceToNumber(item.price))}{' '}
                                  تومان
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </section>

              <aside className="hidden h-fit lg:block">
                <OrderSummary
                  totalItems={totalItems}
                  subtotal={subtotal}
                  deliveryCost={deliveryCost}
                />
              </aside>
            </div>

            <div className="hidden rounded-xl border border-[#e6e6e8] bg-white p-5 sm:grid sm:grid-cols-3 sm:gap-4">
              <TrustItem
                icon={<ShieldCheck className="size-6" />}
                title="ضمانت اصالت کالا"
                description="کالای اصل و سالم"
              />
              <TrustItem
                icon={<Truck className="size-6" />}
                title="ارسال سریع"
                description="تحویل در کوتاه‌ترین زمان"
              />
              <TrustItem
                icon={<CreditCard className="size-6" />}
                title="پرداخت امن"
                description="پرداخت با خیال راحت"
              />
            </div>
          </>
        )}
      </div>

      {items.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e6e6e8] bg-white p-3 shadow-[0_-5px_20px_rgb(0_0_0/8%)] lg:hidden">
          <div className="mx-auto flex max-w-xl items-center gap-3">
            <Link
              href="/"
              className="flex h-12 flex-1 items-center justify-center rounded-lg border border-[#d9d9dc] text-xs text-[#3f4064]"
            >
              ادامه خرید
            </Link>
            <div className="text-left">
              <p className="text-[10px] text-[#81858b]">مبلغ قابل پرداخت</p>
              <strong className="text-sm font-[iransansBold] text-[#23254e]">
                {formatPrice(subtotal + deliveryCost)} تومان
              </strong>
            </div>
            <button
              type="button"
              className="h-12 flex-1 rounded-lg bg-[#ef4056] text-xs font-[iransansBold] text-white"
            >
              ادامه فرایند خرید
            </button>
          </div>
        </div>
      )}
    </main>
  )
}

function OrderSummary({
  totalItems,
  subtotal,
  deliveryCost,
}: {
  totalItems: number
  subtotal: number
  deliveryCost: number
}) {
  return (
    <div className="sticky top-36 rounded-xl border border-[#e6e6e8] bg-white p-5 shadow-[0_1px_2px_rgb(0_0_0/2%)]">
      <h2 className="mb-5 text-sm font-[iransansBold] text-[#23254e]">
        خلاصه سفارش
      </h2>
      <div className="space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[#62666d]">قیمت کالاها ({formatPrice(totalItems)})</span>
          <span className="text-[#3f4064]">{formatPrice(subtotal)} تومان</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#62666d]">هزینه ارسال</span>
          <span className="text-[#00a049]">
            {deliveryCost === 0 ? 'رایگان' : `${formatPrice(deliveryCost)} تومان`}
          </span>
        </div>
        <div className="border-t border-dashed border-[#e0e0e2] pt-4">
          <div className="flex items-center justify-between">
            <span className="font-[iransansBold] text-[#3f4064]">مبلغ قابل پرداخت</span>
            <span className="text-left">
              <strong className="text-lg font-[iransansBold] text-[#23254e]">
                {formatPrice(subtotal + deliveryCost)}
              </strong>
              <span className="mr-1 text-[10px] text-[#81858b]">تومان</span>
            </span>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#ef4056] text-xs font-[iransansBold] text-white transition hover:bg-[#d9364d]"
      >
        <MapPin className="size-4" />
        ادامه فرایند خرید
      </button>
      <p className="mt-3 text-center text-[10px] leading-5 text-[#81858b]">
        هزینه ارسال در مرحله بعد بر اساس آدرس شما محاسبه می‌شود.
      </p>
    </div>
  )
}

function TrustItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex items-center gap-3 text-[#19bfd3]">
      {icon}
      <div>
        <p className="text-xs font-[iransansBold] text-[#3f4064]">{title}</p>
        <p className="mt-1 text-[10px] text-[#81858b]">{description}</p>
      </div>
    </div>
  )
}
