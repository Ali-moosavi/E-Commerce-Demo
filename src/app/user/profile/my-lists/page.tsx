import { requireServerSession } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart } from "lucide-react"

export default async function MylistPage() {
    await requireServerSession()
    return <Card className="profile-card"><CardHeader className="profile-card-header"><CardTitle className="text-base font-[iransansBold] text-[#23254e]">لیست‌های من</CardTitle></CardHeader><CardContent className="p-6"><div className="flex flex-col items-center justify-center rounded-lg bg-[#fafafa] px-5 py-16 text-center"><Heart className="size-10 text-[#d1d3d6]" /><h2 className="mt-4 text-sm font-[iransansBold] text-[#3f4064]">لیست علاقه‌مندی‌های شما خالی است</h2><p className="mt-2 text-xs text-[#81858b]">محصولات مورد علاقه‌تان را ذخیره کنید تا بعداً راحت‌تر پیدایشان کنید.</p></div></CardContent></Card>
}
