'use client'

import { ChevronLeft, Heart, MapPin, Package, UserRound } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

type AccountHoverMenuProps = {
  isAuthenticated: boolean
}

export default function AccountHoverMenu({ isAuthenticated }: AccountHoverMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const accountHref = isAuthenticated ? '/user/profile' : '/user/registeration'

  return (
    <div
      className="relative hidden lg:block"
      onMouseEnter={() => setMenuOpen(true)}
      onMouseLeave={() => setMenuOpen(false)}
    >
      <Link
        href={accountHref}
        aria-label={isAuthenticated ? 'حساب کاربری' : 'ورود و ثبت نام'}
        className={`${isAuthenticated ? '' : 'border border-gray-200'} flex min-h-10 items-center gap-2 rounded-lg px-4 py-2 text-xs font-[iransansBold] whitespace-nowrap transition-colors hover:border-[#ef4056] hover:text-[#ef4056]`}
      >
        <UserRound className="size-5" />
        {isAuthenticated ? (
          <>
            <span>حساب کاربری</span>
            <ChevronLeft className="size-4 -rotate-90" />
          </>
        ) : (
          'ورود | ثبت نام'
        )}
      </Link>

      {menuOpen && (
        <div className="absolute -left-16 top-full z-110 w-72 pt-2">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white text-[#3f4064] shadow-[0_18px_45px_rgba(0,0,0,0.14)]">
            {isAuthenticated ? (
              <>
                <div className="border-b border-[#f0f0f1] px-5 py-4">
                  <p className="text-sm font-[iransansBold] text-[#23254e]">حساب کاربری شما</p>
                  <p className="mt-1 text-[11px] text-[#81858b]">مدیریت سفارش‌ها و اطلاعات حساب</p>
                </div>
                <div className="py-2">
                  <AccountLink href="/user/profile" icon={UserRound}>خلاصه فعالیت‌ها</AccountLink>
                  <AccountLink href="/user/profile/orders" icon={Package}>سفارش‌های من</AccountLink>
                  <AccountLink href="/user/profile/my-lists" icon={Heart}>لیست‌های من</AccountLink>
                  <AccountLink href="/user/profile/personal-info" icon={MapPin}>اطلاعات حساب کاربری</AccountLink>
                </div>
              </>
            ) : (
              <div className="p-5">
                <p className="text-sm font-[iransansBold] text-[#23254e]">وارد حساب کاربری شوید</p>
                <p className="mt-2 text-xs leading-6 text-[#81858b]">برای دیدن سفارش‌ها و لیست‌های خود وارد شوید.</p>
                <Link
                  href="/user/registeration"
                  className="mt-4 flex items-center justify-center rounded-lg bg-[#ef4056] px-4 py-3 text-xs font-[iransansBold] text-white transition-colors hover:bg-[#d9364d]"
                >
                  ورود | ثبت نام
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function AccountLink({
  href,
  icon: Icon,
  children,
}: {
  href: string
  icon: typeof UserRound
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-5 py-3 text-xs text-[#62666d] transition-colors hover:bg-[#f7f7f8] hover:text-[#ef4056]"
    >
      <Icon className="size-4" />
      <span>{children}</span>
      <ChevronLeft className="mr-auto size-4" />
    </Link>
  )
}
