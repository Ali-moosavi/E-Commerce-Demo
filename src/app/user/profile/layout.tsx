import ProfileShell from "@/components/dashboard/ProfileShell"
import { requireServerSession } from "@/lib/auth"

export default async function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await requireServerSession()

  return <ProfileShell initialSession={session}>{children}</ProfileShell>
}
