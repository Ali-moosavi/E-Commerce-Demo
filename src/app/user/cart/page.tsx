import CartClient from '@/components/cart/CartClient'
import { getUserCart } from '@/components/actions/actions'
import { auth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function CartPage() {
  const session = await auth.api.getSession()
  const cart = await getUserCart(session?.user?.id)

  return <CartClient userId={session?.user?.id} initialCart={cart} />
}
