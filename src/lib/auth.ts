import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";

export const auth = betterAuth({
  database: getDb(),
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
})

export async function getServerSession() {
  return auth.api.getSession({
    headers: await headers(),
  })
}

export async function requireServerSession() {
  const session = await getServerSession()

  if (!session) {
    redirect("/user/registeration")
  }

  return session
}
