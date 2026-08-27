import { requireServerSession } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PackageOpen, ShoppingBag } from "lucide-react"
import Link from "next/link"

export default async function OrdersPage() {
    await requireServerSession()
    return <Card className="profile-card"><CardHeader className="profile-card-header"><CardTitle className="text-base font-[iransansBold] text-[#23254e]">سفارش‌های من</CardTitle></CardHeader><CardContent className="p-6"><div className="mb-5 flex gap-2 overflow-x-auto border-b border-[#f0f0f1] pb-3">{["همه", "جاری", "تحویل شده", "مرجوع شده"].map((tab, index) => <button key={tab} type="button" className={`shrink-0 border-b-2 px-3 pb-3 text-xs ${index === 0 ? "border-[#ef4056] font-[iransansBold] text-[#ef4056]" : "border-transparent text-[#81858b]"}`}>{tab}</button>)}</div><div className="flex flex-col items-center justify-center rounded-lg bg-[#fafafa] px-5 py-16 text-center"><div className="flex size-16 items-center justify-center rounded-full bg-white text-[#a1a3a8] shadow-sm"><PackageOpen className="size-8" /></div><h2 className="mt-5 text-sm font-[iransansBold] text-[#3f4064]">سفارشی برای نمایش وجود ندارد</h2><p className="mt-2 max-w-sm text-xs leading-6 text-[#81858b]">سفارش‌های شما با وضعیت ارسال و جزئیات کامل در این قسمت قرار می‌گیرند.</p><Link href="/" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#ef4056] px-5 py-3 text-xs text-white hover:bg-[#d9364d]"><ShoppingBag className="size-4" />شروع خرید</Link></div></CardContent></Card>
}
