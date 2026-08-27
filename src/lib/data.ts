import db from '@/data/db.json'
import {
  randomBytes,
  randomUUID,
  scrypt as scryptCallback,
  timingSafeEqual,
} from 'node:crypto'
import { promisify } from 'node:util'
import type {
  PRODUCT_TYPE,
  CATEGORY_TYPE,
  SUCCES_PROPERTIES_TYPE,
} from '@/types/types'
import type { CreateUserInput, UpdateUserInput } from '@/lib/user-schema'

export type StoredUser = {
  id: string
  identifier: string
  passwordHash: string
  termsAccepted: boolean
  fullname?: string
  identifierComponent?: string
  dob?: string
  createdAt: string
  updatedAt: string
}

export type UserRecord = Omit<StoredUser, 'passwordHash'>

const scrypt = promisify(scryptCallback)
const jsonServerUrl = process.env.JSON_SERVER_URL ?? 'http://localhost:3001'

function normalizeIdentifier(identifier: string) {
  return identifier.trim().toLowerCase()
}

async function findStoredUserByIdentifier(
  identifier: string,
): Promise<StoredUser | null> {
  const users = await findStoredUsersByIdentifier(identifier)

  return users[0] ?? null
}

async function findStoredUsersByIdentifier(
  identifier: string,
): Promise<StoredUser[]> {
  const normalizedIdentifier = normalizeIdentifier(identifier)
  const users = await usersRequest<StoredUser[]>('/users')

  return users.filter(
      (user) => normalizeIdentifier(user.identifier) === normalizedIdentifier,
  )
}

function toUserRecord(user: StoredUser): UserRecord {
  return {
    id: user.id,
    identifier: user.identifier,
    termsAccepted: user.termsAccepted,
    fullname: user.fullname,
    identifierComponent: user.identifierComponent,
    dob: user.dob,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer

  return `scrypt$${salt}$${derivedKey.toString('hex')}`
}

export async function verifyPassword(
  password: string,
  storedPasswordHash: string,
) {
  const [algorithm, salt, storedHash] = storedPasswordHash.split('$')

  if (algorithm !== 'scrypt' || !salt || !storedHash) {
    return false
  }

  try {
    const derivedKey = (await scrypt(password, salt, 64)) as Buffer
    const storedKey = Buffer.from(storedHash, 'hex')

    if (derivedKey.length !== storedKey.length) {
      return false
    }

    return timingSafeEqual(derivedKey, storedKey)
  } catch {
    return false
  }
}

async function usersRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${jsonServerUrl}${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })

  if (!response.ok) {
    const error = new Error(`JSON Server request failed: ${response.status}`)
    Object.assign(error, { status: response.status })
    throw error
  }

  return response.json() as Promise<T>
}

function nodeId(node: CATEGORY_TYPE): number | undefined {
  return node.categoryid ?? node.id
}

export function getCategoryTree(): CATEGORY_TYPE[] {
  return db.categories as unknown as CATEGORY_TYPE[]
}

export function findCategoryById(
  targetId: number,
  nodes: CATEGORY_TYPE[] = getCategoryTree()
): CATEGORY_TYPE | null {
  for (const node of nodes) {
    if (Number(nodeId(node)) === targetId) return node
    if (node.children?.length) {
      const found = findCategoryById(targetId, node.children)
      if (found) return found
    }
  }
  return null
}

export function collectCategoryIds(node: CATEGORY_TYPE): number[] {
  const ids: number[] = []
  const walk = (current: CATEGORY_TYPE) => {
    const currentId = Number(nodeId(current))
    if (!Number.isNaN(currentId)) ids.push(currentId)
    current.children?.forEach(walk)
  }
  walk(node)
  return ids
}

export function getAllProducts(): PRODUCT_TYPE[] {
  return db.products as unknown as PRODUCT_TYPE[]
}

export function getProductById(id: number): PRODUCT_TYPE | undefined {
  return getAllProducts().find((p) => Number(p.id) === Number(id))
}

export function getAllFilters(): SUCCES_PROPERTIES_TYPE[] {
  return db.filters as unknown as SUCCES_PROPERTIES_TYPE[]
}

export async function getAllUsers(): Promise<UserRecord[]> {
  const users = await usersRequest<StoredUser[]>('/users')
  return users.map(toUserRecord)
}

export async function getUserById(id: string): Promise<UserRecord | null> {
  try {
    const user = await usersRequest<StoredUser[] | StoredUser>(
      `/users/${encodeURIComponent(id)}`,
    )
    const resolvedUser = Array.isArray(user) ? user[0] : user

    return resolvedUser ? toUserRecord(resolvedUser) : null
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'status' in error) {
      if (error.status === 404) return null
    }

    throw error
  }
}

export async function getUserByIdentifier(
  identifier: string,
): Promise<UserRecord | null> {
  const user = await findStoredUserByIdentifier(identifier)

  return user ? toUserRecord(user) : null
}

export async function createUser(
  input: CreateUserInput,
): Promise<UserRecord> {
  const identifier = normalizeIdentifier(input.identifier)
  const existingUser = await getUserByIdentifier(identifier)

  if (existingUser) {
    const error = new Error('A user with this identifier already exists')
    Object.assign(error, { status: 409 })
    throw error
  }

  const now = new Date().toISOString()
  const user: StoredUser = {
    id: randomUUID(),
    identifier,
    passwordHash: await hashPassword(input.password),
    termsAccepted: input.termsAccepted,
    fullname: input.fullname,
    identifierComponent: input.identifierComponent,
    dob: input.dob,
    createdAt: now,
    updatedAt: now,
  }

  const createdUser = await usersRequest<StoredUser>('/users', {
    method: 'POST',
    body: JSON.stringify(user),
  })

  return toUserRecord(createdUser)
}

export async function updateUser(
  id: string,
  input: UpdateUserInput,
): Promise<UserRecord | null> {
  const currentUser = await getUserById(id)
  if (!currentUser) return null

  const changes: Partial<StoredUser> = {
    updatedAt: new Date().toISOString(),
  }

  if (input.identifier !== undefined) {
    const identifier = normalizeIdentifier(input.identifier)
    const existingUser = await getUserByIdentifier(identifier)

    if (existingUser && existingUser.id !== id) {
      const error = new Error('A user with this identifier already exists')
      Object.assign(error, { status: 409 })
      throw error
    }

    changes.identifier = identifier
  }

  if (input.password !== undefined) {
    changes.passwordHash = await hashPassword(input.password)
  }

  if (input.termsAccepted !== undefined) {
    changes.termsAccepted = input.termsAccepted
  }

  if (input.fullname !== undefined) changes.fullname = input.fullname
  if (input.identifierComponent !== undefined) {
    changes.identifierComponent = input.identifierComponent
  }
  if (input.dob !== undefined) changes.dob = input.dob

  const updatedUser = await usersRequest<StoredUser>(
    `/users/${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      body: JSON.stringify(changes),
    },
  )

  return toUserRecord(updatedUser)
}
