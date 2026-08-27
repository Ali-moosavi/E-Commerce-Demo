import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import HeaderInput from "./headerInput";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import HeaderCategory from "./HeaderCategory";
import MobileBottomNavigation from "./MobileBottomNavigation";
import Link from "next/link";
import { Bell, Headphones, Settings, UserRoundIcon } from "lucide-react";

export  default function MainHeader({
    CategoryHeader,
    isLoading,
    registerHeader,
    ads,
    profile,
    session,
}: {
    CategoryHeader?: boolean
    isLoading?: boolean
    registerHeader?:boolean
    ads?:boolean
    profile?: boolean
    session?: {
        session?: {
            token?: string
        } | null
        user?: {
            id?: string
        } | null
    } | null
}) {
    const isAuthenticated = Boolean(session?.session?.token || session?.user?.id)

    return (
        <>
            <header className={`lg:bg-white bg-gray-100 fixed w-full z-50 top-0 ${registerHeader ? 'hidden' : ""} `}>
                {profile && (
                    <div className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 lg:hidden">
                        <Link
                            href="/"
                            aria-label="بازگشت به فروشگاه"
                            className="text-xs font-[iransansBold] text-[#3f4064]"
                        >
                            حساب کاربری
                        </Link>
                        <div className="flex items-center gap-4 text-[#3f4064]">
                            <Link href="/" aria-label="پشتیبانی" className="p-1">
                                <Headphones className="size-5" />
                            </Link>
                            <Link href="/" aria-label="اعلان‌ها" className="p-1">
                                <Bell className="size-5" />
                            </Link>
                            <Link href="/" aria-label="تنظیمات" className="p-1">
                                <Settings className="size-5" />
                            </Link>
                        </div>
                    </div>
                )}

                <span className={`${ads || profile ? 'hidden': ''}`}>
                    <div
                    className={`relative z-0  w-full mx-auto h-8 md:h-12 lg:h-15 bg-cover bg-center bg-no-repeat ${CategoryHeader? 'hidden lg:block' : 'block'}  `}
                    style={{ backgroundImage: 'url(/adsbanner.gif) ' }}
                >
                </div>
                </span>

                <div className={`${profile ? 'hidden lg:block' : ''} flex flex-col-reverse lg:flex-col ${CategoryHeader? 'hidden lg:block' : 'block'} `}>
                    <div className="mt-5 mx-5  ">
                        <div>
                            <ul className="flex justify-between overflow-x-auto flex-nowrap gap-2 items-center mb-5 lg:hidden text-xs pb-2 px-2 md:px-0">
                                <li className="shrink-0 min-w-18 bg-white whitespace-nowrap rounded-lg border border-gray-400 font-[iransansBold] flex flex-col justify-center items-center py-2 px-1">
                                    <img className="w-10" src="/Services.png" alt="Services" />
                                    <span>سرویس‌ها</span>
                                </li>
                                <li className="shrink-0 min-w-18 bg-white whitespace-nowrap rounded-lg border border-gray-400 font-[iransansBold] flex flex-col justify-center items-center py-2 px-1">
                                    <img className="w-10" src="/worldcup.gif" alt="worldcup" />
                                    <span>جام جهانی</span>
                                </li>
                                <li className="shrink-0 min-w-18 bg-white whitespace-nowrap rounded-lg border border-gray-400 font-[iransansBold] flex flex-col justify-center items-center py-2 px-1">
                                    <img className="w-10" src="/DG.png" alt="digikala" />
                                    <span>دیجی‌کالا</span>
                                </li>
                                <li className="shrink-0 min-w-18 bg-white whitespace-nowrap rounded-lg border border-gray-400 font-[iransansBold] flex flex-col justify-center items-center py-2 px-1">
                                    <img className="w-10" src="/45_minutes.png" alt="45_minutes" />
                                    <span>۴۵ دقیقه‌ای</span>
                                </li>
                                <li className="shrink-0 min-w-18 bg-white whitespace-nowrap rounded-lg border border-gray-400 font-[iransansBold] flex flex-col justify-center items-center py-2 px-1">
                                    <img className="w-10" src="/Gold.png" alt="Gold" />
                                    <span>طلا و نقره</span>
                                </li>
                                <li className="shrink-0 min-w-18 bg-white whitespace-nowrap rounded-lg border border-gray-400 font-[iransansBold] flex flex-col justify-center items-center py-2 px-1">
                                    <img className="w-10" src="/style.webp" alt="style" />
                                    <span>استایل</span>
                                </li>
                                <li className="shrink-0 min-w-18 bg-white whitespace-nowrap rounded-lg border border-gray-400 font-[iransansBold] flex flex-col justify-center items-center py-2 px-1">
                                    <img className="w-10" src="/Supermarket.png" alt="Supermarket" />
                                    <span>سوپرمارکت</span>
                                </li>
                                <li className="shrink-0 min-w-18 bg-white whitespace-nowrap rounded-lg border border-gray-400 font-[iransansBold] flex flex-col justify-center items-center py-2 px-1">
                                    <img className="w-10" src="/credit.png" alt="credit" />
                                    <span>اعتبار خرید</span>
                                </li>
                                <li className="shrink-0 min-w-18 bg-white whitespace-nowrap rounded-lg border border-gray-400 font-[iransansBold] flex flex-col justify-center items-center py-2 px-1">
                                    <img className="w-10" src="/medicene.webp" alt="medicene" />
                                    <span>دارو</span>
                                </li>
                            </ul>
                        </div>
                        <div className="flex justify-between gap-5 items-center">
                            <div className="flex gap-10 items-center w-full ">


                                <img className="object-cover w-50 lg:block hidden"
                                    src="/digilogo.svg" alt="" />
                                        <HeaderInput/>
                            </div>
                            <ul className="flex  gap-5 items-center ">
                                <li className="opacity-70 lg:text-[28px] text-[24px] bg-white py-0.5 px-2  rounded-full border lg:border-0"><NotificationsNoneIcon fontSize="inherit" /></li>

                                <li
                                    className={`${isAuthenticated ? '' : 'border border-gray-200'}  py-2 px-8 rounded-lg text-xs font-[iransansBold] whitespace-nowrap overflow-hidden lg:block hidden`}
                                ><Link href={isAuthenticated ? '/user/profile' : '/user/registeration'}>{
                                    isAuthenticated ? <span className="flex items-center text-sm"><UserRoundIcon/> <PlayArrowIcon sx={{transform:'rotate(90deg)'}} fontSize="inherit"/></span> : 'ورود | ثبت نام'
                                }</Link></li>
                                <div className="hidden lg:block h-6 opacity-10 w-px bg-black"></div>
                                <Link href={`/user/cart`} className="opacity-70 text-[28px] lg:block hidden"><ShoppingCartOutlinedIcon fontSize="inherit" /></Link>
                            </ul>

                        </div>
                    </div>
                    <section className={`relative z-20 w-full hidden mt-5 lg:border-b-gray-300 lg:border-b lg:drop-shadow overflow-visible whitespace-nowrap lg:block isolate ${CategoryHeader? 'hidden' : 'block'} `}>
                        <ul className="flex w-[60%] items-center gap-6 mx-5 mb-2   ">
                            <HeaderCategory isLoading={isLoading} />
                            <div className="h-4 opacity-10 w-px bg-black hidden lg:block"></div>
                            <li className="text-[13px] text-gray-700">شگفت‌انگیزها</li>
                            <li className="text-[13px] text-gray-700">سوپرمارکت</li>
                            <li className="text-[13px] text-gray-700">طلا و نقره دیجیتال</li>
                            <li className="text-[13px] text-gray-700">پرفروش‌ترین‌ها</li>
                            <div className="h-4 opacity-10 w-px bg-black hidden lg:block"></div>
                            <li className="text-[13px] text-gray-700">سوالی دارید؟</li>
                            <li className="text-[13px] text-gray-700">در دیجی‌کالا بفروشید!</li>
                        </ul>
                    </section >

                </div>

            </header>
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-between items-center px-6 py-2 z-50">
                <MobileBottomNavigation isAuthenticated={isAuthenticated}/>
            </nav>
        </>
    )
}
