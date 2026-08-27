import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded'
import PaidRoundedIcon from '@mui/icons-material/PaidRounded'
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded'
import AssignmentReturnRoundedIcon from '@mui/icons-material/AssignmentReturnRounded'
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'
import InstagramIcon from '@mui/icons-material/Instagram'
import TwitterIcon from '@mui/icons-material/Twitter'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'

const features = [
  { icon: LocalShippingRoundedIcon, label: 'امکان تحویل اکسپرس' },
  { icon: PaidRoundedIcon, label: 'امکان پرداخت در محل' },
  { icon: SupportAgentRoundedIcon, label: '۷ روز هفته، ۲۴ ساعته' },
  { icon: AssignmentReturnRoundedIcon, label: 'هفت روز ضمانت بازگشت کالا' },
  { icon: VerifiedRoundedIcon, label: 'ضمانت اصل بودن کالا' },
]

const linkGroups = [
  {
    title: 'با دیجی‌کالا',
    links: ['اتاق خبر دیجی‌کالا', 'فروش در دیجی‌کالا', 'فرصت‌های شغلی', 'گزارش تخلف در دیجی‌کالا', 'تماس با دیجی‌کالا', 'درباره دیجی‌کالا'],
  },
  {
    title: 'خدمات مشتریان',
    links: ['پاسخ به پرسش‌های متداول', 'رویه‌های بازگرداندن کالا', 'شرایط استفاده', 'حریم خصوصی', 'گزارش باگ', 'پیگیری سفارش'],
  },
  {
    title: 'راهنمای خرید از دیجی‌کالا',
    links: ['نحوه ثبت سفارش', 'رویه ارسال سفارش', 'شیوه‌های پرداخت', 'شرایط بازگشت کالا', 'پرسش‌های متداول'],
  },
]

const socials = [
  { icon: InstagramIcon, label: 'اینستاگرام' },
  { icon: TwitterIcon, label: 'توییتر' },
  { icon: LinkedInIcon, label: 'لینکدین' },
]


export default function Footer() {
  return (
    <footer className="mt-10 bg-white pb-16 lg:pb-0">
      <div className="mx-auto max-w-[1676px] px-4 sm:px-6 lg:px-8">
        <section className="grid grid-cols-2 justify-items-center gap-y-6 border-b border-gray-200 py-6 text-center sm:grid-cols-3 lg:flex lg:justify-between lg:gap-4">
          {features.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 lg:gap-2">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#19bfd3]/10 text-[#19bfd3]">
                <Icon sx={{ fontSize: 26 }} />
              </span>
              <span className="max-w-32 text-right text-[11px] leading-5 text-[#3f4064] lg:max-w-none lg:text-xs">
                {label}
              </span>
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-6 border-b border-gray-200 py-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#ef4056]/10 text-[#ef4056]">
              <EmailRoundedIcon sx={{ fontSize: 24 }} />
            </div>
            <div>
              <p className="text-sm font-[iransansBold] text-[#3f4064]">
                از جدیدترین تخفیف‌ها باخبر شوید
              </p>
              <p className="mt-1 text-xs text-[#81858b]">
                با عضویت در خبرنامه، جدیدترین محصولات و پیشنهادهای ویژه را دریافت کنید.
              </p>
            </div>
            <form className="flex w-full max-w-md items-center gap-2 sm:w-72" action="">
              <input
                type="email"
                required
                placeholder="ایمیل شما"
                className="h-11 min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-4 text-xs outline-none transition focus:border-[#19bfd3] focus:ring-2 focus:ring-[#19bfd3]/20"
              />
              <button
                type="submit"
                className="h-11 shrink-0 cursor-pointer rounded-lg bg-[#ef4056] px-5 text-xs font-[iransansBold] text-white transition hover:bg-[#d92f46]"
              >
                ثبت
              </button>
            </form>
          </div>

          <div className="flex flex-col-reverse items-start gap-4 lg:items-center">
            <div className="flex items-center gap-3 text-xs text-[#3f4064]">
              <span>دانلود اپلیکیشن دیجی‌کالا:</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-[10px] font-[iransansBold] text-[#3f4064]">
                آیفون
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-[10px] font-[iransansBold] text-[#3f4064]">
                اندروید
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#81858b]">همراه ما باشید:</span>
              <ul className="flex items-center gap-2">
                {socials.map(({ icon: Icon, label }) => (
                  <li key={label}>
                    <a
                      href="#"
                      aria-label={label}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0f0f1] text-lg text-[#81858b] transition hover:bg-[#19bfd3]/10 hover:text-[#19bfd3]"
                    >
                      <Icon fontSize="inherit" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>


        <section className="grid gap-8 border-b border-gray-200 py-7 sm:grid-cols-2 lg:grid-cols-3">
          {linkGroups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-4 text-sm font-[iransansBold] text-[#3f4064]">
                {group.title}
              </h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-xs text-[#81858b] transition hover:text-[#19bfd3]"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>


        <section className="flex flex-col items-center gap-5 py-7 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col items-center gap-4 lg:items-start">
            <img src="/digilogo.svg" alt="دیجی‌کالا" className="w-36 lg:w-44" />
            <p className="max-w-xl text-center text-[11px] leading-6 text-[#81858b] lg:text-right lg:text-xs">
              استفاده از مطالب فروشگاه اینترنتی نمایشی دیجی‌کالا فقط برای مقاصد غیرتجاری و با
              ذکر منبع بلامانع است. کلیه حقوق این سایت متعلق به این پروژه آموزشی است.
            </p>
          </div>
          <div className="flex items-start gap-4">
            <span className="flex h-24 w-24 items-center justify-center rounded-lg border border-gray-200 text-[10px] text-[#81858b]">
              نماد اعتماد
              <br />
              الکترونیکی
            </span>
            <span className="flex h-24 w-24 items-center justify-center rounded-lg border border-gray-200 text-[10px] text-[#81858b]">
              ساماندهی
            </span>
          </div>
        </section>

        <div className="hidden items-center justify-center gap-2 border-t border-gray-200 py-4 text-[11px] text-[#81858b] lg:flex">
          <span>بازگشت به بالا</span>
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 13, transform: 'rotate(90deg)' }} />
        </div>
      </div>
    </footer>
  )
}
