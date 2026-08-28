"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useSyncExternalStore } from "react"
import {
  Bell,
  ChevronLeft,
  Clock3,
  Gift,
  Heart,
  Home,
  MapPin,
  MessageCircle,
  Pencil,
  ShoppingBag,
  UserRound,
} from "lucide-react"
import { authClient } from "@/lib/auth-clients"
import SignOutButton from "./Sign-Out-Button"
import SideBar from "./SideBar"

type ProfileSession = typeof authClient.$Infer.Session

const navItems = [
  { label: "خلاصه فعالیت‌ها", href: "/user/profile", icon: Home },
  { label: "سفارش‌های من", href: "/user/profile/orders", icon: ShoppingBag },
  { label: "لیست‌های من", href: "/user/profile/my-lists", icon: Heart },
  { label: "نظرات و پرسش‌ها", href: "/user/profile/activities", icon: MessageCircle },
  { label: "آدرس‌ها", href: "/user/profile/address", icon: MapPin },
  { label: "کارت‌های هدیه", href: "/user/profile/gift-cards", icon: Gift },
  { label: "پیام‌ها", href: "/user/profile/messages", icon: Bell },
  { label: "بازدیدهای اخیر", href: "/user/profile/recents", icon: Clock3 },
  { label: "اطلاعات حساب کاربری", href: "/user/profile/personal-info", icon: UserRound },
]



export default function ProfileShell({
  children,
  initialSession,
}: {
  children: React.ReactNode
  initialSession: ProfileSession
}) {
  const pathname = usePathname()
  const { data: clientSession } = authClient.useSession()
  const [active, setActive] = useState('/user/profile')

  const session = clientSession ?? initialSession

  const user = session.user
  const initials = user.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()

  return (
    <main className="profile-page min-h-screen px-3 pb-24 pt-18 sm:px-5 lg:px-8 lg:pb-12 lg:pt-36">
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
          <Link href="/" className="text-sm font-[iransansBold] text-[#3f4064]">حساب کاربری</Link>
          <div className="flex items-center gap-1 text-[#62666d]">
            <Link href="/" aria-label="پشتیبانی" className="rounded-full p-2 hover:bg-white"><MessageCircle className="size-5" /></Link>
            <Link href="/" aria-label="اعلان‌ها" className="rounded-full p-2 hover:bg-white"><Bell className="size-5" /></Link>
          </div>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-6">
          <aside className="hidden overflow-hidden rounded-xl border border-[#e6e6e8] bg-white lg:block">
            <div className="border-b border-[#f0f0f1] p-5">
              <div className="flex items-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#fff0f1] text-sm font-[iransansBold] text-[#ef4056]">{initials || "د"}</div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-[iransansBold] text-[#23254e]">{user.name}</div>
                  <div className="mt-1 truncate text-xs text-[#81858b]" dir="ltr">{user.email}</div>
                </div>
                <Link href="/user/profile/personal-info" aria-label="ویرایش اطلاعات" className="mr-auto rounded-full p-1.5 text-[#19bfd3] hover:bg-[#f4fbfc]"><Pencil className="size-4" /></Link>
              </div>
            </div>
            <div className="grid grid-cols-3 divide-x divide-x-reverse divide-[#f0f0f1] border-b border-[#f0f0f1] text-center">
              {["امتیاز", "کیف پول", "دیجی‌کلاب"].map((label) => <div key={label} className="px-2 py-4"><div className="text-sm font-[iransansBold] text-[#23254e]">۰</div><div className="mt-1 text-[10px] text-[#81858b]">{label}</div></div>)}
            </div>
            <SideBar/>
            
          </aside>
          <section className="min-w-0 space-y-5">{children}</section>

        </div>
      </div>
    </main>
  )
}
