import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { ready } from "@/lib/db";

const handler = toNextJsHandler(auth);

async function ensureDbGet(request: Request) {
  await ready();
  return handler.GET(request);
}

async function ensureDbPost(request: Request) {
  await ready();
  return handler.POST(request);
}

export const GET = ensureDbGet;
export const POST = ensureDbPost;