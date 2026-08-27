"use client"

import { LogOut } from "lucide-react"
import { useTransition } from "react"
import { signOutAction } from "@/components/actions/actions"

export default function SignOutButton() {
  const [isPending, startTransition] = useTransition()

  return (
    <form action={() => startTransition(() => signOutAction())}>
      <button
        type="submit"
        disabled={isPending}
        className="flex min-h-12 w-full items-center gap-3 px-5 text-right text-sm text-[#62666d] transition-colors hover:bg-[#f7f7f8] disabled:opacity-50"
      >
        <LogOut className="size-[18px]" />
        <span>{isPending ? "در حال خروج..." : "خروج از حساب کاربری"}</span>
      </button>
    </form>
  )
}
