import { NextResponse } from 'next/server'

import { getUserById, updateUser } from '@/lib/data'
import { updateUserSchema } from '@/lib/user-schema'

export const runtime = 'nodejs'

type UserRouteContext = {
  params: Promise<{ id: string }>
}

function isUniqueViolation(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    (('code' in error && error.code === '23505') ||
      ('status' in error && error.status === 409))
  )
}

export async function GET(
  _request: Request,
  { params }: UserRouteContext,
) {
  const { id } = await params

  try {
    const user = await getUserById(id)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch {
    return NextResponse.json(
      { error: 'User could not be loaded' },
      { status: 500 },
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: UserRouteContext,
) {
  const { id } = await params
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = updateUserSchema.safeParse(body)

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
    const user = await updateUser(id, parsed.data)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    if (isUniqueViolation(error)) {
      return NextResponse.json(
        { error: 'A user with this identifier already exists' },
        { status: 409 },
      )
    }

    return NextResponse.json(
      { error: 'User could not be updated' },
      { status: 500 },
    )
  }
}
