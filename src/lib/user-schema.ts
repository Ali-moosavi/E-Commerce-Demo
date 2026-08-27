import { z } from 'zod'

export const identifierSchema = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .email('Enter a valid email address')

export const createUserSchema = z.object({
  identifier: identifierSchema,
  termsAccepted: z
    .boolean()
    .refine((value) => value, 'Terms acceptance is required'),
  password: z
    .string()
    .min(8, 'Password must contain at least 8 characters')
    .max(128, 'Password must not contain more than 128 characters'),
  fullname: z.string().trim().max(100, 'Full name is too long').min(1 , 'نام و نام خانوادگی الزامی است'),
  identifierComponent: z
    .string()
    .trim()
    .max(100, 'Contact information is too long')
    .optional(),
  dob: z.string().trim().max(20, 'Birth date is too long').optional(),
})

export const updateUserSchema = z
  .object({
    identifier: identifierSchema.optional(),
    termsAccepted: z.boolean().optional(),
    password: z
      .string()
      .min(8, 'Password must contain at least 8 characters')
      .max(128, 'Password must not contain more than 128 characters')
      .optional(),
    fullname: z.string().trim().max(100, 'Full name is too long').optional(),
    identifierComponent: z
      .string()
      .trim()
      .max(100, 'Contact information is too long')
      .optional(),
    dob: z.string().trim().max(20, 'Birth date is too long').optional(),
  })
  .refine(
    (value) => Object.keys(value).length > 0,
    'At least one field is required',
  )

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
