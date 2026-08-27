import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProductById, getAllProducts } from '@/lib/data'
import type { PRODUCT_TYPE } from '@/types/types'
import ProductGallery from '@/components/single-product/PoductGallery'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined'
import ProductsColors from '@/components/single-product/ProductsColors'
import AddToCart from '@/components/single-product/AddToCart'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getUserCart } from '@/components/actions/actions'

const faDigits = (value: number) =>
  new Intl.NumberFormat('fa-IR').format(value)

async function getProduct(id: string): Promise<PRODUCT_TYPE | null> {
  return getProductById(Number(id)) ?? null
}

export async function generateStaticParams() {
  const products = getAllProducts()

  return products.map((product) => ({
    categoryid: String(product.Categoryid ?? '1'),
    id: String(product.id),
  }))
}

export default async function SingleProduct({
  params,
}: {
  params: Promise<{ categoryid: string; id: string }>
}) {
  const { categoryid, id } = await params
  const product = await getProduct(id)
  const session =await auth.api.getSession({
    headers: await headers()
  })
  const cart = session ? await getUserCart(session.user.id) : null
  const cartQuantity = cart?.addedProducts.find(
    (item) => String(item.productId) === String(product?.id),
  )?.quantity ?? 0

  if (!product?.id) notFound()

  const details = product.pageDetails
  const properties = product.properties ?? []
  const colors = product.pageDetails ? product.pageDetails?.colors : []

  const featureItems =
    details?.featureHighlights ??
    properties.map((property) => ({
      label: property.nameFa,
      value: property.valueFa || property.value,
    }))
  const specifications = [
    ...properties.map((property) => ({
      label: property.nameFa,
      value: property.valueFa || property.value,
    })),
    ...(details?.specifications ?? []),
  ]
  const seller = details?.seller

  return (
    <div className="min-h-screen bg-white pb-28 text-[#23254e] lg:pb-0">
      <main className="mx-auto w-full max-w-[1676px]   pt-5 px-2 lg:pt-39">
        <nav
          aria-label="مسیر صفحه"
          className="mb-5 flex items-center gap-1 overflow-hidden whitespace-nowrap text-[11px] text-[#81858b] sm:text-xs"
        >
          <Link href="/" className="hover:text-[#19bfd3]">
            دیجی‌کالا
          </Link>
          <KeyboardArrowLeftRoundedIcon sx={{ fontSize: 16 }} />
          <Link href={`/category/${categoryid}`} className="hover:text-[#19bfd3]">
            {details?.productGroup ?? product.name}
          </Link>
          {details?.brandName && (
            <>
              <KeyboardArrowLeftRoundedIcon sx={{ fontSize: 16 }} />
              <span className="truncate">{details.brandName}</span>
            </>
          )}
        </nav>

        <section className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-[minmax(330px,2.6fr)_minmax(390px,3.7fr)_minmax(300px,2.55fr)] lg:grid-rows-[auto_1fr]">
          <div className="lg:col-start-1 lg:row-span-2 lg:row-start-1">
            <ProductGallery name={product.name} images={product.image} />
          </div>
          <header className="min-w-0 lg:col-start-2 lg:row-start-1">
            {details && (
              <div className="mb-3 flex items-center gap-2 text-xs text-[#19bfd3]">
                <Link href={`/category/${categoryid}`}>{details.brandName}</Link>
                <span className="text-gray-300">/</span>
                <span>{details.productGroup}</span>
              </div>
            )}
            <h1 className="text-[15px] font-[iransansBold] leading-7 text-[#23254e] sm:text-lg lg:text-xl">
              {product.name}
            </h1>
            <div className="mt-3 flex items-center gap-3 border-b border-gray-200 pb-4">
              <span className="h-px flex-1 bg-gray-100" />
              <h2
                dir="ltr"
                className="truncate text-[10px] text-[#a1a3a8] sm:text-xs"
              >
                {product.describtion}
              </h2>
            </div>
          </header>

          <div className="min-w-0 lg:col-start-2 lg:row-start-2">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
              <span className="flex items-center gap-1 text-[#3f4064]">
                <StarRoundedIcon sx={{ color: '#f9bc00', fontSize: 18 }} />
                <b>{product.rate}</b>
                {details && (
                  <span className="text-[10px] text-[#a1a3a8]">
                    (امتیاز {faDigits(details.ratingCount)} خریدار)
                  </span>
                )}
              </span>
              {details && (
                <>
                  <a href="#comments" className="text-[#19bfd3]">
                    {faDigits(details.commentCount)} دیدگاه
                  </a>
                  <a href="#questions" className="text-[#19bfd3]">
                    {faDigits(details.questionCount)} پرسش
                  </a>
                </>
              )}
            </div>

            <ProductsColors colors={colors}/>

            {featureItems.length > 0 && (
              <div className="mt-7">
                <h3 className="mb-4 text-base font-[iransansBold]">ویژگی‌ها</h3>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
                  {featureItems.slice(0, 4).map((feature) => (
                    <div
                      key={`${feature.label}-${feature.value}`}
                      className="rounded-lg bg-[#f0f0f1] p-3"
                    >
                      <p className="mb-2 text-[11px] text-[#81858b]">
                        {feature.label}
                      </p>
                      <p className="line-clamp-2 text-xs font-[iransansBold] leading-5 text-[#3f4064]">
                        {feature.value.length > 14 ? `...${feature.value.slice(0, 14)}` : feature.value}
                      </p>
                    </div>
                  ))}
                </div>
                {specifications.length > 0 && (
                  <a
                    href="#specifications"
                    className="mt-4 inline-flex items-center text-xs font-[iransansBold] text-[#19bfd3]"
                  >
                    مشاهده همه ویژگی‌ها
                    <KeyboardArrowLeftRoundedIcon sx={{ fontSize: 18 }} />
                  </a>
                )}
              </div>
            )}
          </div>

          {seller && (
            <aside className="lg:col-start-3 sticky h-screen lg:row-span-2 lg:row-start-1 hidden lg:block">
              <div className="rounded-xl border border-[#e0e0e2] bg-[#f7f7f8] p-5 lg:sticky lg:top-5">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="font-[iransansBold]">فروشنده</h2>
                  <span className="text-xs text-[#19bfd3]">
                    {faDigits(seller.otherSellerCount)} فروشنده دیگر
                  </span>
                </div>

                <div className="flex gap-3 border-b border-gray-200 pb-4">
                  <StorefrontOutlinedIcon className="mt-0.5 text-[#424750]" />
                  <div>
                    <p className="text-sm font-[iransansBold]">{seller.name}</p>
                    <p className="mt-2 text-[11px] text-[#81858b]">
                      <span className="text-[#00a049]">
                        {seller.satisfactionRate}
                      </span>{' '}
                      رضایت از کالا
                      <span className="mx-2 text-gray-300">|</span>
                      عملکرد{' '}
                      <span className="text-[#00a049]">
                        {seller.performance}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-b border-gray-200 py-4 text-xs">
                  <VerifiedUserOutlinedIcon className="text-[#424750]" />
                  <span>{seller.warranty}</span>
                </div>

                <div className="border-b border-gray-200 py-4">
                  <div className="flex items-center gap-3 text-xs">
                    <Inventory2OutlinedIcon className="text-[#ef4056]" />
                    <span className="font-[iransansBold]">
                      {seller.inventoryStatus}
                    </span>
                  </div>
                  <div className="mr-3 mt-3 space-y-3 border-r border-gray-300 pr-6 text-[11px] text-[#81858b]">
                    {seller.shippingMethods.map((method, index) => (
                      <p key={method} className="flex items-center gap-2">
                        {index === 0 ? (
                          <LocalShippingOutlinedIcon
                            sx={{ fontSize: 17, color: '#19bfd3' }}
                          />
                        ) : (
                          <WorkspacePremiumOutlinedIcon
                            sx={{ fontSize: 17, color: '#a63489' }}
                          />
                        )}
                        {method}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="pt-5">
                  <div className="mb-3 flex items-end justify-between">
                    {seller.remainingStock > 0 && (
                      <span className="text-[11px] font-[iransansBold] text-[#ef4056]">
                        تنها {faDigits(seller.remainingStock)} عدد در انبار باقی
                        مانده
                      </span>
                    )}
                    <p className="mr-auto text-left">
                      <strong className="text-xl font-[iransansBold]">
                        {product.price}
                      </strong>
                      <span className="mr-1 text-[11px]">
                        {details?.currency}
                      </span>
                    </p>
                  </div>
                  <AddToCart
                    userId={session?.user.id}
                    product={product}
                    initialQuantity={cartQuantity}
                  />
                  <div className="mt-4 flex items-center gap-2 text-[11px] text-[#62666d]">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f9bc00] text-xs font-bold">
                      +
                    </span>
                    <span>
                      {faDigits(seller.clubPoints)} امتیاز دیجی‌کلاب
                    </span>
                    <InfoOutlinedIcon
                      sx={{ fontSize: 16 }}
                      className="mr-auto"
                    />
                  </div>
                </div>
              </div>
            </aside>
          )}
        </section>

        {details?.returnPolicy && (
          <section className="mt-7 flex gap-3 rounded-lg border border-gray-200 p-4 text-xs leading-6 text-[#62666d]">
            <InfoOutlinedIcon
              sx={{ color: '#f9a825', fontSize: 22 }}
              className="shrink-0"
            />
            <p>{details.returnPolicy}</p>
          </section>
        )}

        {details && (
          <>
            <nav className="sticky top-0 z-30 mt-8 overflow-x-auto border-b border-gray-200 bg-white">
              <ul className="flex min-w-max gap-8 px-1 text-sm text-[#62666d]">
                {[
                  ['#introduction', 'معرفی'],
                  ['#review', 'بررسی تخصصی'],
                  ['#specifications', 'مشخصات'],
                  ['#comments', 'دیدگاه‌ها'],
                  ['#questions', 'پرسش‌ها'],
                ].map(([href, label], index) => (
                  <li key={href}>
                    <a
                      href={href}
                      className={`block py-4 ${index === 0
                          ? 'border-b-2 border-[#ef4056] font-[iransansBold] text-[#3f4064]'
                          : ''
                        }`}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <section
              id="introduction"
              className="scroll-mt-20 border-b border-gray-200 py-8"
            >
              <SectionTitle>معرفی</SectionTitle>
              <p className="max-w-5xl text-sm leading-8 text-[#3f4064]">
                {details.introduction}
              </p>
            </section>

            <section
              id="review"
              className="scroll-mt-20 border-b border-gray-200 py-8"
            >
              <SectionTitle>بررسی تخصصی</SectionTitle>
              {details.expertReviewText && (
                <p className="max-w-5xl text-sm leading-8 text-[#3f4064]">
                  {details.expertReviewText}
                </p>
              )}
              {details.expertReviewImage && (
                <div className="relative mx-auto mt-6 aspect-square w-full max-w-225 overflow-hidden rounded-xl bg-[#0b103d]">
                  <Image
                    src={`/${details.expertReviewImage}`}
                    alt={`اینفوگرافیک ${product.name}`}
                    fill
                    sizes="(max-width: 900px) 100vw, 900px"
                    className="object-contain"
                  />
                </div>
              )}
            </section>

            {specifications.length > 0 && (
              <section
                id="specifications"
                className="scroll-mt-20 border-b border-gray-200 py-8"
              >
                <SectionTitle>مشخصات</SectionTitle>
                <div className="mt-6 grid max-w-5xl gap-0">
                  {specifications.map((specification, index) => (
                    <div
                      key={`${specification.label}-${index}`}
                      className="grid grid-cols-[120px_1fr] gap-4 border-b border-gray-100 py-4 text-xs sm:grid-cols-[230px_1fr] sm:text-sm"
                    >
                      <span className="text-[#81858b]">
                        {specification.label}
                      </span>
                      <span className="text-[#3f4064]">
                        {specification.value}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section
              id="comments"
              className="scroll-mt-20 border-b border-gray-200 py-8"
            >
              <SectionTitle>دیدگاه‌ها</SectionTitle>
              <div className="mt-6 grid gap-5 lg:grid-cols-[230px_1fr]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-[iransansBold]">
                      {product.rate}
                    </span>
                    <span className="text-xs text-[#81858b]">از ۵</span>
                  </div>
                  <div className="mt-2 flex gap-0.5 text-[#f9bc00]">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <StarRoundedIcon key={index} sx={{ fontSize: 18 }} />
                    ))}
                  </div>
                  <p className="mt-3 text-[11px] text-[#81858b]">
                    از مجموع {faDigits(details.ratingCount)} امتیاز
                  </p>
                </div>
                <div className="space-y-4">
                  {details.reviews.map((review) => (
                    <article
                      key={review.id}
                      className="rounded-xl border border-gray-200 p-5"
                    >
                      <div className="mb-4 flex items-center gap-2">
                        <CheckCircleRoundedIcon
                          sx={{ color: '#00a049', fontSize: 20 }}
                        />
                        <strong className="text-sm">
                          {review.recommendation}
                        </strong>
                      </div>
                      <p className="text-sm leading-7 text-[#3f4064]">
                        {review.text}
                      </p>
                      <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4 text-[11px] text-[#81858b]">
                        <span>{review.author}</span>
                        {review.isBuyer && (
                          <span className="rounded bg-gray-100 px-2 py-1">
                            خریدار
                          </span>
                        )}
                        <button
                          type="button"
                          className="mr-auto flex items-center gap-1"
                        >
                          مفید بود ({faDigits(review.helpfulCount)})
                          <ThumbUpAltOutlinedIcon sx={{ fontSize: 17 }} />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section id="questions" className="scroll-mt-20 py-8">
              <SectionTitle>پرسش‌ها</SectionTitle>
              <div className="mt-6 max-w-4xl space-y-4">
                {details.questions.map((question) => (
                  <article
                    key={question.id}
                    className="rounded-xl border border-gray-200 p-5 text-sm"
                  >
                    <p className="leading-7 text-[#3f4064]">{question.text}</p>
                    <p className="mt-3 text-xs text-[#19bfd3]">
                      {question.answerCount > 0
                        ? `${faDigits(question.answerCount)} پاسخ`
                        : 'ثبت پاسخ'}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      <div className="fixed inset-x-0 bottom-15.25 z-40 border-t border-gray-200 bg-white px-4 py-3 shadow-[0_-5px_20px_rgba(0,0,0,0.08)] lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-4 ">
          <AddToCart
          product={product}
          userId={session?.user.id}
          initialQuantity={cartQuantity}
          />
          <p className="whitespace-nowrap text-left">
            <strong className="text-base font-[iransansBold]">
              {product.price}
            </strong>
            <span className="mr-1 text-[10px]">{details?.currency}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="relative mb-5 inline-block pb-3 text-lg font-[iransansBold] text-[#0c0c0c] after:absolute after:bottom-0 after:right-0 after:h-0.5 after:w-16 after:bg-[#ef4056]">
      {children}
    </h2>
  )
}
