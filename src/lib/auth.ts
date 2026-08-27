import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getDb, ready } from "@/lib/db";

function getBaseUrl(): string {
  const configuredUrl = process.env.BETTER_AUTH_URL;
  const isLocalUrl = configuredUrl?.includes("localhost") || configuredUrl?.includes("127.0.0.1");

  if (configuredUrl && (!isLocalUrl || !process.env.VERCEL_URL)) return configuredUrl;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.VERCEL_BRANCH_URL)
    return `https://${process.env.VERCEL_BRANCH_URL}`;
  return "http://localhost:3000";
}

export const auth = betterAuth({
  database: getDb(),
  baseURL: getBaseUrl(),
  secret: process.env.BETTER_AUTH_SECRET ?? "fallback-secret-change-me",
  trustHost: true,
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
});

export async function getServerSession() {
  await ready();
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function requireServerSession() {
  const session = await getServerSession();

  if (!session) {
    redirect("/user/registeration");
  }

  return session;
}
