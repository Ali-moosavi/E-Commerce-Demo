import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";

function getBaseUrl(): string {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  if (process.env.VERCEL_BRANCH_URL) return `https://${process.env.VERCEL_BRANCH_URL}`
  return "http://localhost:3000"
}

export const auth = betterAuth({
  database: getDb(),
  baseURL: getBaseUrl(),
  secret: process.env.BETTER_AUTH_SECRET ?? "fallback-secret-change-me",
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
