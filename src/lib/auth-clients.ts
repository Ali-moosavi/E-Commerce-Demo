import { createAuthClient } from "better-auth/react"

const configuredUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_URL
const isLocalUrl = configuredUrl?.includes('localhost') || configuredUrl?.includes('127.0.0.1')

export const authClient = createAuthClient({
    baseURL: configuredUrl && !isLocalUrl
        ? configuredUrl
        : typeof window !== 'undefined'
            ? window.location.origin
            : undefined,
})