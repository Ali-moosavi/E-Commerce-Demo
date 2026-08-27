import Link from "next/link"
import { ChevronLeft, Clock3, PackageCheck, RotateCcw, Truck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { requireServerSession } from "@/lib/auth"

export default async function ProfilePage() {
  await requireServerSession()

  return (
    <>
      <Card className="profile-card overflow-hidden">
        <CardHeader className="profile-card-header">
          <CardTitle className="flex items-center justify-between gap-4 text-base font-[iransansBold] text-[#23254e]">
            <span>سفارش‌های من</span>
            <Link href="/user/profile/orders" className="flex items-center gap-1 text-xs font-normal text-[#19bfd3]">مشاهده همه <ChevronLeft className="size-4" /></Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 divide-y divide-[#f0f0f1] p-0 sm:grid-cols-3 sm:divide-x sm:divide-x-reverse sm:divide-y-0">
          <SummaryItem icon={Truck} count="۰" label="جاری" tone="blue" />
          <SummaryItem icon={PackageCheck} count="۰" label="تحویل شده" tone="green" />
          <SummaryItem icon={RotateCcw} count="۰" label="مرجوع شده" tone="orange" />
        </CardContent>
      </Card>

      <Card className="profile-card">
        <CardHeader className="profile-card-header">
          <CardTitle className="flex items-center justify-between gap-4 text-base font-[iransansBold] text-[#23254e]"><span>آخرین فعالیت‌ها</span><Clock3 className="size-5 text-[#a1a3a8]" /></CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#f7f7f8] text-[#a1a3a8]"><Clock3 className="size-7" /></div>
          <h2 className="mt-4 text-sm font-[iransansBold] text-[#3f4064]">هنوز فعالیتی ثبت نشده است</h2>
          <p className="mt-2 text-xs leading-6 text-[#81858b]">با خرید از دیجی‌کالا، سفارش‌ها و فعالیت‌های شما در اینجا نمایش داده می‌شوند.</p>
        </CardContent>
      </Card>
    </>
  )
}

function SummaryItem({ icon: Icon, count, label, tone }: { icon: typeof Truck; count: string; label: string; tone: "blue" | "green" | "orange" }) {
  const toneClass = { blue: "bg-[#eefaff] text-[#19bfd3]", green: "bg-[#effbf3] text-[#00a049]", orange: "bg-[#fff7eb] text-[#f5a623]" }[tone]
  return <div className="flex items-center gap-4 px-5 py-6 sm:flex-col sm:items-center sm:justify-center sm:py-8"><div className={`flex size-12 items-center justify-center rounded-full ${toneClass}`}><Icon className="size-6" /></div><div className="flex items-center gap-2 sm:flex-col sm:gap-1"><span className="text-sm font-[iransansBold] text-[#23254e]">{count} سفارش</span><span className="text-xs text-[#81858b]">{label}</span></div></div>
}
