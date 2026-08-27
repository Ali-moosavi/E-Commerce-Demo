import { getDb } from '@/lib/db'
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
import dbJson from '@/data/db.json'

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

function normalizeIdentifier(identifier: string) {
  return identifier.trim().toLowerCase()
}

function findStoredUserByIdentifier(identifier: string): StoredUser | null {
  const normalizedIdentifier = normalizeIdentifier(identifier)
  const db = getDb()

  const row = db.prepare('SELECT * FROM app_users WHERE LOWER(identifier) = ?').get(normalizedIdentifier) as StoredUser | undefined

  return row ?? null
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

function nodeId(node: CATEGORY_TYPE): number | undefined {
  return node.categoryid ?? node.id
}

export function getCategoryTree(): CATEGORY_TYPE[] {
  return dbJson.categories as unknown as CATEGORY_TYPE[]
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
  return dbJson.products as unknown as PRODUCT_TYPE[]
}

export function getProductById(id: number): PRODUCT_TYPE | undefined {
  return getAllProducts().find((p) => Number(p.id) === Number(id))
}

export function getAllFilters(): SUCCES_PROPERTIES_TYPE[] {
  return dbJson.filters as unknown as SUCCES_PROPERTIES_TYPE[]
}

export function getAllUsers(): UserRecord[] {
  const db = getDb()
  const rows = db.prepare('SELECT * FROM app_users').all() as StoredUser[]
  return rows.map(toUserRecord)
}

export function getUserById(id: string): UserRecord | null {
  const db = getDb()
  const row = db.prepare('SELECT * FROM app_users WHERE id = ?').get(id) as StoredUser | undefined

  return row ? toUserRecord(row) : null
}

export function getUserByIdentifier(identifier: string): UserRecord | null {
  const user = findStoredUserByIdentifier(identifier)
  return user ? toUserRecord(user) : null
}

export function createUser(input: CreateUserInput): UserRecord {
  const identifier = normalizeIdentifier(input.identifier)
  const existingUser = getUserByIdentifier(identifier)

  if (existingUser) {
    const error = new Error('A user with this identifier already exists')
    Object.assign(error, { status: 409 })
    throw error
  }

  const db = getDb()
  const now = new Date().toISOString()
  const user: StoredUser = {
    id: randomUUID(),
    identifier,
    passwordHash: '', // placeholder — better-auth handles real passwords
    termsAccepted: input.termsAccepted,
    fullname: input.fullname,
    identifierComponent: input.identifierComponent,
    dob: input.dob,
    createdAt: now,
    updatedAt: now,
  }

  db.prepare(
    'INSERT INTO app_users (id, identifier, passwordHash, termsAccepted, fullname, identifierComponent, dob, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(user.id, user.identifier, user.passwordHash, user.termsAccepted ? 1 : 0, user.fullname ?? null, user.identifierComponent ?? null, user.dob ?? null, user.createdAt, user.updatedAt)

  return toUserRecord(user)
}

export function updateUser(id: string, input: UpdateUserInput): UserRecord | null {
  const currentUser = getUserById(id)
  if (!currentUser) return null

  const db = getDb()
  const now = new Date().toISOString()

  const fields: string[] = ['updatedAt = ?']
  const values: unknown[] = [now]

  if (input.identifier !== undefined) {
    const identifier = normalizeIdentifier(input.identifier)
    const existingUser = getUserByIdentifier(identifier)

    if (existingUser && existingUser.id !== id) {
      const error = new Error('A user with this identifier already exists')
      Object.assign(error, { status: 409 })
      throw error
    }

    fields.push('identifier = ?')
    values.push(identifier)
  }

  if (input.password !== undefined) {
    // We store the hash but better-auth manages real auth
    fields.push('passwordHash = ?')
    values.push('') // placeholder
  }

  if (input.termsAccepted !== undefined) {
    fields.push('termsAccepted = ?')
    values.push(input.termsAccepted ? 1 : 0)
  }

  if (input.fullname !== undefined) {
    fields.push('fullname = ?')
    values.push(input.fullname)
  }

  if (input.identifierComponent !== undefined) {
    fields.push('identifierComponent = ?')
    values.push(input.identifierComponent)
  }

  if (input.dob !== undefined) {
    fields.push('dob = ?')
    values.push(input.dob)
  }

  values.push(id)

  db.prepare(`UPDATE app_users SET ${fields.join(', ')} WHERE id = ?`).run(...values)

  return getUserById(id)
}
