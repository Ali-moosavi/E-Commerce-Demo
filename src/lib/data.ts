import { getDb, ready } from '@/lib/db'
import {
  randomUUID,
} from 'node:crypto'
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

function normalizeIdentifier(identifier: string) {
  return identifier.trim().toLowerCase()
}

async function findStoredUserByIdentifier(
  identifier: string,
): Promise<StoredUser | null> {
  const normalizedIdentifier = normalizeIdentifier(identifier)
  const pool = getDb()
  await ready()

  const { rows } = await pool.query<StoredUser>(
    'SELECT * FROM "app_users" WHERE LOWER("identifier") = $1',
    [normalizedIdentifier],
  )

  return rows[0] ?? null
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

function nodeId(node: CATEGORY_TYPE): number | undefined {
  return node.categoryid ?? node.id
}

export function getCategoryTree(): CATEGORY_TYPE[] {
  return dbJson.categories as unknown as CATEGORY_TYPE[]
}

export function findCategoryById(
  targetId: number,
  categories: CATEGORY_TYPE[] = getCategoryTree(),
): CATEGORY_TYPE | null {
  categories.map((category)=>{
    if (Number(nodeId(category)) === targetId) {const node = category
       return node}
    if (category.children?.length) {
      const found = findCategoryById(targetId, category.children)
      if (found) return found
    }
  }) 
  return null
}

export function collectCategoryIds(category: CATEGORY_TYPE): number[] {
  const ids:number[] = []
  const walk = (currentCategory: CATEGORY_TYPE) => {
    const currentId = Number(nodeId(currentCategory))
    if (Number.isFinite(currentId)) ids.push(currentId)
    currentCategory.children?.forEach(walk)
  }
  walk(category)
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

export async function getAllUsers(): Promise<UserRecord[]> {
  await ready()
  const pool = getDb()
  const { rows } = await pool.query<StoredUser>('SELECT * FROM "app_users"')
  return rows.map(toUserRecord)
}

export async function getUserById(id: string): Promise<UserRecord | null> {
  await ready()
  const pool = getDb()
  const { rows } = await pool.query<StoredUser>(
    'SELECT * FROM "app_users" WHERE "id" = $1',
    [id],
  )

  return rows[0] ? toUserRecord(rows[0]) : null
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

  await ready()
  const pool = getDb()
  const now = new Date().toISOString()
  const id = randomUUID()

  await pool.query(
    `INSERT INTO "app_users" ("id", "identifier", "passwordHash", "termsAccepted", "fullname", "identifierComponent", "dob", "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      id,
      identifier,
      '', 
      input.termsAccepted ? 1 : 0,
      input.fullname ?? null,
      input.identifierComponent ?? null,
      input.dob ?? null,
      now,
      now,
    ],
  )

  return toUserRecord({
    id,
    identifier,
    passwordHash: '',
    termsAccepted: input.termsAccepted,
    fullname: input.fullname,
    identifierComponent: input.identifierComponent,
    dob: input.dob,
    createdAt: now,
    updatedAt: now,
  })
}

export async function updateUser(
  id: string,
  input: UpdateUserInput,
): Promise<UserRecord | null> {
  const currentUser = await getUserById(id)
  if (!currentUser) return null

  await ready()
  const pool = getDb()
  const now = new Date().toISOString()

  const setClauses: string[] = ['"updatedAt" = $1']
  const values: unknown[] = [now]
  let paramIndex = 2

  if (input.identifier !== undefined) {
    const identifier = normalizeIdentifier(input.identifier)
    const existingUser = await getUserByIdentifier(identifier)

    if (existingUser && existingUser.id !== id) {
      const error = new Error('A user with this identifier already exists')
      Object.assign(error, { status: 409 })
      throw error
    }

    setClauses.push(`"identifier" = $${paramIndex}`)
    values.push(identifier)
    paramIndex++
  }

  if (input.password !== undefined) {
    setClauses.push(`"passwordHash" = $${paramIndex}`)
    values.push('') 
    paramIndex++
  }

  if (input.termsAccepted !== undefined) {
    setClauses.push(`"termsAccepted" = $${paramIndex}`)
    values.push(input.termsAccepted ? 1 : 0)
    paramIndex++
  }

  if (input.fullname !== undefined) {
    setClauses.push(`"fullname" = $${paramIndex}`)
    values.push(input.fullname)
    paramIndex++
  }

  if (input.identifierComponent !== undefined) {
    setClauses.push(`"identifierComponent" = $${paramIndex}`)
    values.push(input.identifierComponent)
    paramIndex++
  }

  if (input.dob !== undefined) {
    setClauses.push(`"dob" = $${paramIndex}`)
    values.push(input.dob)
    paramIndex++
  }

  values.push(id)

  await pool.query(
    `UPDATE "app_users" SET ${setClauses.join(', ')} WHERE "id" = $${paramIndex}`,
    values,
  )

  return getUserById(id)
}
