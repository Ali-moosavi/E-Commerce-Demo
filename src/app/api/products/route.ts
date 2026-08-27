import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts } from '@/lib/data'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const categoryid = searchParams.get('Categoryid')

  const products = getAllProducts()

  if (categoryid) {
    const filtered = products.filter((p) => String(p.Categoryid) === categoryid)
    return NextResponse.json(filtered)
  }

  return NextResponse.json(products)
}