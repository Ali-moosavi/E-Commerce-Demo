'use client'

import { ChevronLeft, ShoppingCart, ShieldCheck, Truck } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function CartHoverMenu() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div
      className="relative hidden lg:block"
      onMouseEnter={() => setMenuOpen(true)}
      onMouseLeave={() => setMenuOpen(false)}
    >
      <Link
        href="/user/cart"
        aria-label="سبد خرید"
        className="flex rounded-lg p-2 text-[28px] opacity-70 transition-colors hover:bg-[#fff5f6] hover:text-[#ef4056] hover:opacity-100"
      >
        <ShoppingCart className="size-7" />
      </Link>

      {menuOpen && (
        <div className="absolute left-0 top-full z-110 w-80 pt-2">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white text-[#3f4064] shadow-[0_18px_45px_rgba(0,0,0,0.14)]">
            <div className="flex items-center justify-between border-b border-[#f0f0f1] px-5 py-4">
              <div>
                <p className="text-sm font-[iransansBold] text-[#23254e]">سبد خرید</p>
                <p className="mt-1 text-[11px] text-[#81858b]">بررسی و تکمیل خرید شما</p>
              </div>
              <span className="flex size-10 items-center justify-center rounded-full bg-[#fff0f1] text-[#ef4056]">
                <ShoppingCart className="size-5" />
              </span>
            </div>
            <div className="px-5 py-5 text-center">
              <p className="text-xs text-[#62666d]">برای مشاهده کالاهای سبد خرید، وارد صفحه سبد شوید.</p>
              <Link
                href="/user/cart"
                className="mt-4 flex items-center justify-center gap-1 rounded-lg bg-[#ef4056] px-4 py-3 text-xs font-[iransansBold] text-white transition-colors hover:bg-[#d9364d]"
              >
                مشاهده سبد خرید
                <ChevronLeft className="size-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 border-t border-[#f0f0f1] text-[10px] text-[#81858b]">
              <div className="flex items-center justify-center gap-1 border-l border-[#f0f0f1] px-2 py-3">
                <ShieldCheck className="size-4 text-[#00a049]" />
                ضمانت اصالت کالا
              </div>
              <div className="flex items-center justify-center gap-1 px-2 py-3">
                <Truck className="size-4 text-[#19bfd3]" />
                ارسال سریع
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
