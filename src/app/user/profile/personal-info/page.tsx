import { requireServerSession } from "@/lib/auth"
import PersonalInfoForm from "@/components/dashboard/PersonalInfoForm"

export default async function PersonalInfoPage() {
  const session = await requireServerSession()
  return <PersonalInfoForm user={session.user} />
}
