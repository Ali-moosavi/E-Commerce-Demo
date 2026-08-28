'use client'
import {
  Bell,
  ChevronLeft,
  Clock3,
  Gift,
  Heart,
  Home,
  MapPin,
  MessageCircle,
  ShoppingBag,
  UserRound,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import SignOutButton from "./Sign-Out-Button"

export default function SideBar() {
    const [active , setActive] = useState<string>('/user/profile')
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

  return (
    <nav className="py-2 lg:p-0">
      {navItems.map((item) => {
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`profile-sidebar-item border-t ${ active === item.href ? 'border-r-4 border-r-red-600' :''}`}
            onClick={()=>{
            setActive(item.href)
            }}
          >
            <Icon className="size-[18px]" />
            <span>{item.label}</span>
            <ChevronLeft className="mr-auto size-4 opacity-50" />
          </Link>
        )
      })}
      <div className="border-t border-[#f0f0f1]"><SignOutButton /></div>
    </nav>
  )
}