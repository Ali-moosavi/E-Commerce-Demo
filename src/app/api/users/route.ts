import { NextRequest, NextResponse } from 'next/server'

import {
  createUser,
  getAllUsers,
  getUserByIdentifier,
} from '@/lib/data'
import { createUserSchema } from '@/lib/user-schema'

export const runtime = 'nodejs'

function isUniqueViolation(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    (('code' in error && error.code === '23505') ||
      ('status' in error && error.status === 409))
  )
}

export async function GET(request: NextRequest) {
  try {
    const identifier = request.nextUrl.searchParams.get('identifier')
    const user = identifier
      ? await getUserByIdentifier(identifier)
      : null
    const users = identifier
      ? user
        ? [user]
        : []
      : await getAllUsers()

    return NextResponse.json({ users })
  } catch {
    return NextResponse.json(
      { error: 'Users could not be loaded' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = createUserSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    )
  }

  try {
    return NextResponse.json(
      { user: await createUser(parsed.data) },
      { status: 201 },
    )
  } catch (error) {
    if (isUniqueViolation(error)) {
      return NextResponse.json(
        { error: 'A user with this identifier already exists' },
        { status: 409 },
      )
    }

    return NextResponse.json(
      { error: 'User could not be created' },
      { status: 500 },
    )
  }
}
