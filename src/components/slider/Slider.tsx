'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay ,Thumbs } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Slider() {
    const slides = ['Slide1', 'Slide2', 'Slide3'];
    const mobileSlide = [
        {
            img:'Mobileslide1' ,
        text:' تابستان با ویتالیر شروع میشه' ,
        discreption:' محصولات پوستی تخصصی ویتالیر' ,
        button:'خرید'
    } ,
        {
            img:'Mobileslide2' ,
        text:' از خونه تا خودرو هرجی لازم داری' ,
        discreption:'' ,
        button:'خرید'
    }
        ,
        {
        img:'Mobileslide3' ,
        text:' خونه کارات رو میکنه' ,
        discreption:'همه چیز برای هوشمند کردن خونه' ,
        button:'خرید'
    }]

    return (
        <main className="w-full overflow-hidden mt-60 lg:mt-48">
            <div className='hidden lg:block'>
                <Swiper
                    dir="rtl"
                    modules={[Navigation, Pagination, Autoplay ]}
                    spaceBetween={0}
                    slidesPerView={1}
                    navigation
                    
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 4000 }}
                    className="w-full"
                >
                    {slides.map((slide) => (
                        <SwiperSlide key={slide}>
                            <img
                                src={`/Slides/${slide}.webp`}
                                alt={`Slide ${slide}`}
                                className=" w-full object-cover object-center lg:h-100"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className='lg:hidden'>
                <Swiper
                    dir="rtl"
                    modules={[Navigation, Pagination, Autoplay ,Thumbs ]}
                    spaceBetween={0}
                    slidesPerView={1}
                    pagination={{ clickable: true  }}
                    thumbs={{ swiper: null }}
                    autoplay={{ delay: 4000 }}
                    grabCursor={true}
                    allowTouchMove={true}
                    touchRatio={1}
                    threshold={10}
                    className="w-full"
                >
                    {mobileSlide.map((slide) => (
                        <SwiperSlide key={slide.img} className='px-2'>
                            <div className='relative mx-auto w-[96%] overflow-hidden rounded-2xl'>
                                <img
                                    src={`/Slides/${slide.img}.png`}
                                    alt={slide.discreption || slide.text}
                                    className="h-48 w-full object-cover object-center sm:h-56"
                                />
                                <div className='absolute inset-0 bg-linear-to-r from-black/40 via-transparent to-black/10' />
                                <div className='absolute inset-x-4 top-19 sm:top-1/3 sm:right-10'>
                                    <p className='text-right text-sm font-medium leading-relaxed text-white drop-shadow-md sm:text-xl'>
                                        {slide.text}
                                    </p>
                                    {slide.discreption && (
                                        <p className='mt-1 text-right text-[10px] text-white/90 sm:text-sm'>
                                            {slide.discreption}
                                        </p>
                                    )}
                                    <button
                                        type='button'
                                        className='mt-3 ml-auto flex items-center justify-center rounded-full bg-white/90 px-4 py-1 text-[10px] font-bold text-black shadow-sm sm:px-5 sm:text-xs'
                                    >
                                        {slide.button}
                                    </button>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </main>
    );
}