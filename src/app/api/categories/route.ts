import { NextResponse } from 'next/server'
import { getCategoryTree } from '@/lib/data'

export async function GET() {
  return NextResponse.json(getCategoryTree())
}