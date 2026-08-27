'use client'

import Image from 'next/image'
import { useState } from 'react'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded'
import CompareArrowsRoundedIcon from '@mui/icons-material/CompareArrowsRounded'
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'

type ProductGalleryProps = {
  name: string
  images: string[]
}

const galleryActions = [
  { label: 'افزودن به علاقه‌مندی‌ها', icon: FavoriteBorderRoundedIcon },
  { label: 'اشتراک‌گذاری کالا', icon: ShareOutlinedIcon },
  { label: 'اطلاع‌رسانی شگفت‌انگیز', icon: NotificationsNoneRoundedIcon },
  { label: 'نمودار قیمت', icon: TimelineRoundedIcon },
  { label: 'مقایسه کالا', icon: CompareArrowsRoundedIcon },
  { label: 'افزودن به لیست', icon: FormatListBulletedRoundedIcon },
]

export default function ProductGallery({ name, images }: ProductGalleryProps) {
  const availableImages = images.length > 0 ? images : ['s25fe.webp']
  const [selectedImage, setSelectedImage] = useState(availableImages[0])
  const [isImageLoading, setIsImageLoading] = useState(true)

  return (
    <section className="relative w-full" aria-label="گالری تصاویر محصول">
      <div className="absolute right-0 top-1  z-10 hidden lg:block">
        <ul className="flex flex-col gap-2">
          {galleryActions.map(({ label, icon: Icon }) => (
            <li key={label}>
              <button
                type="button"
                aria-label={label}
                title={label}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[23px] text-[#424750] transition-colors hover:bg-gray-100 hover:text-[#ef4056]"
              >
                <Icon fontSize="inherit" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-2 flex items-center justify-between px-1 lg:hidden">
        <div className="flex gap-2">
          {galleryActions.slice(0, 2).map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[22px] text-[#424750] shadow-sm"
            >
              <Icon fontSize="inherit" />
            </button>
          ))}
        </div>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] text-gray-500">
          {availableImages.length} تصویر
        </span>
      </div>

      <div className="relative mx-auto aspect-square w-full max-w-[420px]">
        {isImageLoading && (
          <div
            aria-hidden="true"
            className="absolute inset-4 animate-pulse rounded-2xl bg-gray-100 lg:inset-7"
          />
        )}
        <Image
          key={selectedImage}
          src={`/${selectedImage}`}
          alt={name}
          loading='eager'
          fill
          priority
          sizes="(max-width: 1024px) 88vw, 390px"
          className="object-contain p-4 lg:p-7"
          onLoad={() => setIsImageLoading(false)}
          onError={() => setIsImageLoading(false)}
        />
      </div>

      <ul className="mt-2 flex justify-center gap-2 overflow-x-auto mx-auto px-1 pb-2 lg:justify-start lg:pr-12">
        {availableImages.slice(0, 5).map((image, index) => (
          <li key={`${image}-${index}`} className="shrink-0">
            <button
              type="button"
              onClick={() => {
                if (image !== selectedImage) {
                  setIsImageLoading(true)
                  setSelectedImage(image)
                }
              }}
              aria-label={`نمایش تصویر ${index + 1}`}
              className={`relative flex h-[72px] w-[72px] cursor-pointer items-center justify-center overflow-hidden rounded-lg border bg-white p-1 transition-all ${
                selectedImage === image
                  ? 'border-[#19bfd3] shadow-[0_0_0_1px_#19bfd3]'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <Image
                src={`/${image}`}
                alt=""
                fill
                sizes="72px"
                className="object-contain p-1.5"
              />
            </button>
          </li>
        ))}
        {availableImages.length > 5 && (
          <li className="shrink-0">
            <button
              type="button"
              className="flex h-[72px] w-[72px] items-center justify-center rounded-lg border border-gray-200 bg-white text-3xl text-gray-600"
              aria-label="مشاهده همه تصاویر"
            >
              <MoreHorizRoundedIcon fontSize="inherit" />
            </button>
          </li>
        )}
      </ul>
    </section>
  )
}
