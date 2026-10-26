import ProfileShell from "@/components/dashboard/ProfileShell"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth.api.getSession({ headers: await headers() })
  console.log(session)

  if (!session) redirect("/user/registeration")

  return <ProfileShell initialSession={session}>{children}</ProfileShell>
}
