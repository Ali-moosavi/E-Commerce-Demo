import { requireServerSession } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle } from "lucide-react"

export default async function ActivitiesPage() {
  await requireServerSession()
  return <Card className="profile-card"><CardHeader className="profile-card-header"><CardTitle className="text-base font-[iransansBold] text-[#23254e]">نظرات و پرسش‌های من</CardTitle></CardHeader><CardContent className="p-6"><div className="flex flex-col items-center justify-center rounded-lg bg-[#fafafa] px-5 py-16 text-center"><MessageCircle className="size-10 text-[#d1d3d6]" /><h2 className="mt-4 text-sm font-[iransansBold] text-[#3f4064]">هنوز نظری ثبت نکرده‌اید</h2><p className="mt-2 text-xs text-[#81858b]">پس از خرید، تجربه‌تان را با دیگر کاربران به اشتراک بگذارید.</p></div></CardContent></Card>
}
