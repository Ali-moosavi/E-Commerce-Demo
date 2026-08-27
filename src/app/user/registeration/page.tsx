'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { userExist } from '@/components/actions/actions'
import { signUpUser } from '@/components/actions/actions'
import { signInUser } from '@/components/actions/actions'
import { authClient } from '@/lib/auth-clients'
import { useRouter } from 'next/navigation'
import {
    ArrowRight,
    Check,
    ShieldCheck,
    ShoppingBag,
    Sparkles,
    UserRound,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'

const formSchema = z
    .object({
        step: z.enum(['identifier', 'password', 'fullname']),
        identifyState: z.boolean(),
        validatePassword: z.string(),
        identifier: z
            .string()
            .trim()
            .min(1, 'ایمیل را وارد کنید')
            .email('یک ایمیل معتبر وارد کنید'),

        termsAccepted: z.boolean(),
        password: z.string(),
        fullname: z.string(),

    })
    .superRefine((data, ctx) => {
        if (!data.termsAccepted) {
            ctx.addIssue({
                code: 'custom',
                path: ['termsAccepted'],
                message: 'پذیرش قوانین ضروری است',
            })
        }

        if (data.step === 'password') {
            if (!data.password) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['password'],
                    message: 'رمز عبور را وارد کنید',
                })
                return
            }

            if (data.password.length < 8) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['password'],
                    message: 'رمز عبور باید حداقل ۸ کاراکتر باشد',
                })
            }

            if (data.password.length > 24) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['password'],
                    message: 'رمز عبور نباید بیشتر از ۲۴ کاراکتر باشد',
                })
            }
            if (!data.identifyState && data.password !== data.validatePassword) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['validatePassword'],
                    message: 'رمزعبور ها یکسان نیستند',
                })
                return
            }
        }
        if (data.step === 'fullname') {
            if (!data.fullname) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['fullname'],
                    message: 'لطفا نام و نام خانوادگی خود را وارد کنید'
                })
            }
        }
    })


type FormValues = z.infer<typeof formSchema>

const benefits = [
    {
        icon: ShoppingBag,
        title: 'پیگیری سفارش‌ها',
        description: 'همه خریدها و وضعیت ارسال را یکجا ببینید.',
    },
    {
        icon: Sparkles,
        title: 'پیشنهادهای شخصی',
        description: 'محصولات مناسب سلیقه‌تان را سریع‌تر پیدا کنید.',
    },
    {
        icon: ShieldCheck,
        title: 'خرید مطمئن‌تر',
        description: 'آدرس‌ها و اطلاعات خریدتان را امن نگه دارید.',
    },
]

export default function RegistrationPage() {
    const router = useRouter()
    const { refetch: refetchSession } = authClient.useSession()
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [isNavigating, startNavigation] = useTransition()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            step: 'identifier',
            identifier: '',
            termsAccepted: false,
            password: '',
            identifyState: false,
            validatePassword: '',
            fullname: '',
        },
    })

    const currentStep = form.watch('step')
    const identifyState = form.watch('identifyState')
    const isPending = form.formState.isSubmitting || isNavigating


    const handleSubmit = async (data: FormValues) => {
        setSubmitError(null)

        try {
            if (data.step === 'identifier') {
                const exists = await userExist({ identifier: data.identifier })
                form.setValue('identifyState', exists , {
                    shouldTouch:false,
                    shouldDirty:false,
                    shouldValidate:false
                })
                form.setValue('step', 'password', {
                    shouldTouch:false,
                    shouldDirty:false,
                    shouldValidate:false
                })
                return
            }

            if (data.step === 'password') {
                if (data.identifyState) {
                    const response = await signInUser({
                        identifier: data.identifier,
                        password: data.password,
                    })

                    if (!response.success) {
                        setSubmitError(response.error)
                        return
                    }

                    await refetchSession()
                    startNavigation(() => {
                        router.replace('/user/profile')
                        router.refresh()
                    })
                    return
                }

                form.setValue('step', 'fullname', {
                    shouldTouch: false,
                    shouldDirty: false,
                    shouldValidate: false,
                })
                return
            }

            if (data.step === 'fullname') {
                const response = await signUpUser({
                    identifier: data.identifier,
                    termsAccepted: data.termsAccepted,
                    password: data.password,
                    fullname: data.fullname,
                })

                if (!response.success) {
                    setSubmitError(response.error)
                    return
                }

                await refetchSession()
                startNavigation(() => {
                    router.replace('/user/profile')
                    router.refresh()
                })
            }



        } catch {
            setSubmitError('Something went wrong. Please try again.')
        }
    }

    return (
        <main className="min-h-screen bg-muted/40 px-4 py-6 sm:px-6 sm:py-10">
            <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col justify-between gap-10">
                <header className="flex items-center justify-between">
                    <Button
                        size="icon"
                        variant="outline"
                        className="rounded-full bg-background"
                        type='button'
                        nativeButton={false}
                        render={
                            <Link href="/" aria-label="بازگشت به صفحه اصلی">
                                <ArrowRight className="size-5" />
                            </Link>
                        }
                    >
                    </Button>

                    <Link href="/" aria-label="دیجی‌کالا">
                        <Image
                            src="/digilogo.svg"
                            alt="دیجی‌کالا"
                            width={146}
                            height={40}
                            priority
                            className="h-7 w-auto sm:h-8"
                        />
                    </Link>

                    <div className="size-10" aria-hidden="true" />
                </header>

                <section className="grid flex-1 items-center gap-8 lg:grid-cols-[1fr_28rem]">
                    <aside className="hidden rounded-2xl bg-[#fff5f6] p-8 lg:block">
                        <div className="mb-10 flex size-14 items-center justify-center rounded-2xl bg-background text-[#ef4056] shadow-sm">
                            <UserRound className="size-7" />
                        </div>

                        <h1 className="max-w-md text-3xl font-[iransansBold] leading-[1.7] text-[#23254e]">
                            خریدی راحت‌تر با حساب کاربری دیجی‌کالا
                        </h1>
                        <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
                            با ساخت حساب کاربری، تجربه خرید را شخصی‌تر و مدیریت سفارش‌ها را
                            ساده‌تر کنید.
                        </p>

                        <div className="mt-10 space-y-5">
                            {benefits.map(({ icon: Icon, title, description }) => (
                                <div key={title} className="flex items-start gap-3">
                                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-background text-[#ef4056]">
                                        <Icon className="size-5" />
                                    </span>
                                    <div>
                                        <h2 className="text-sm font-[iransansBold] text-[#3f4064]">
                                            {title}
                                        </h2>
                                        <p className="mt-1 text-xs leading-6 text-muted-foreground">
                                            {description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>

                    <Card className="border-border/80 bg-background shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
                        <CardHeader className="p-5 pb-0 sm:p-10 sm:pb-0">
                            <div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-[#fff0f1] text-[#ef4056] lg:hidden">
                                <UserRound className="size-5" />
                            </div>
                            <CardTitle className="text-xl font-[iransansBold] text-[#23254e]">
                                {currentStep == 'password' && identifyState == false ? 'ثبت نام'
                                    : currentStep == 'password' && identifyState == true ? 'ورود'
                                        : currentStep == 'identifier' ? 'ورود یا ثبت نام'
                                            : ""}
                            </CardTitle>
                            <CardDescription className="mt-1 text-sm leading-6">
                                {currentStep == 'password' && identifyState == false ? ' برای ثبت نام رمز عبور خود را وارد کنید'
                                    : currentStep == 'password' && identifyState == true ? ' برای ورود رمز عبور خود را وارد کنید'
                                        : currentStep == 'identifier' ? 'لطفا ایمیل خود را وارد کنید'
                                            : ""}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="p-5 sm:p-8">
                            <form
                                onSubmit={form.handleSubmit(handleSubmit)}
                                noValidate
                                className="space-y-7"
                                aria-busy={isPending}
                            >
                                <FieldGroup>
                                    {
                                        currentStep === 'identifier' && (
                                            <>
                                                <Controller
                                                    name='identifier'
                                                    control={form.control}
                                                    render={({ field, fieldState }) => (
                                                        <Field data-invalid={fieldState.invalid}>
                                                            <FieldLabel
                                                                htmlFor="identifier"
                                                                className="font-[iransansBold] text-[#3f4064]"
                                                            >
                                                                ایمیل
                                                            </FieldLabel>

                                                            <Input
                                                                id="identifier"
                                                                type="text"
                                                                dir="ltr"
                                                                autoComplete="username"
                                                                autoFocus
                                                                placeholder="name@example.com"
                                                                aria-invalid={fieldState.invalid}
                                                                {...field}
                                                            />
                                                            {fieldState.invalid && (
                                                                <FieldError
                                                                    errors={[fieldState.error]}
                                                                />
                                                            )}
                                                        </Field>
                                                    )}
                                                />

                                                <Controller
                                                    name="termsAccepted"
                                                    control={form.control}
                                                    render={({ field, fieldState }) => (
                                                        <>
                                                            <Field
                                                                orientation="horizontal"
                                                                data-invalid={fieldState.invalid}
                                                                className="items-start"
                                                            >

                                                                <Checkbox
                                                                    id="termsAccepted"
                                                                    name={field.name}
                                                                    checked={field.value}
                                                                    onBlur={field.onBlur}
                                                                    onCheckedChange={field.onChange}
                                                                    aria-invalid={fieldState.invalid}
                                                                />
                                                                <FieldLabel
                                                                    htmlFor="termsAccepted"
                                                                    className="cursor-pointer items-start font-normal text-muted-foreground"
                                                                >
                                                                    <span className="text-xs leading-6">
                                                                        با ادامه دادن،{' '}
                                                                        <a href="#" className="text-[#19bfd3] hover:underline">
                                                                            شرایط استفاده
                                                                        </a>{' '}
                                                                        و{' '}
                                                                        <a href="#" className="text-[#19bfd3] hover:underline">
                                                                            حریم خصوصی
                                                                        </a>{' '}
                                                                        دیجی‌کالا را می‌پذیرم.
                                                                    </span>
                                                                </FieldLabel>
                                                                <FieldDescription className="sr-only">
                                                                    برای ادامه باید قوانین و حریم خصوصی را بپذیرید.
                                                                </FieldDescription>
                                                            </Field>
                                                            {fieldState.invalid && (
                                                                <FieldError errors={[fieldState.error]} />
                                                            )}
                                                        </>
                                                    )}
                                                />


                                            </>
                                        )


                                    }
                                    {
                                        currentStep === 'password' && (
                                            <Controller
                                                name='password'
                                                control={form.control}
                                                render={({ field, fieldState }) => (
                                                    <Field data-invalid={fieldState.invalid}>
                                                        <FieldLabel>
                                                            رمز عبور
                                                        </FieldLabel>
                                                        <Input
                                                            {...field}
                                                            id="password"
                                                            type='password'
                                                            aria-invalid={fieldState.invalid}
                                                            placeholder="رمز عبور خود را وارد کنید"
                                                            autoComplete="off"
                                                        />
                                                        {fieldState.invalid && (
                                                            <FieldError errors={[fieldState.error]} />
                                                        )}
                                                    </Field>

                                                )
                                                }
                                            />

                                        )
                                    }
                                    {currentStep == 'password' && identifyState == false ? (
                                        <Controller
                                            name='validatePassword'
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel>
                                                        تکرار رمز عبور
                                                    </FieldLabel>
                                                    <Input
                                                        {...field}
                                                        id="validatePassword"
                                                        type='password'
                                                        aria-invalid={fieldState.invalid}
                                                        placeholder="رمزعبور خود را تکرار کنید"
                                                        autoComplete="off"
                                                    />
                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </Field>

                                            )
                                            }
                                        />
                                    ) : null}
                                    {currentStep === 'fullname' && (
                                        <Controller
                                            name='fullname'
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel>
                                                        نام و نام خانوادگی 
                                                    </FieldLabel>
                                                    <Input
                                                        {...field}
                                                        id="fullname"
                                                        type='text'
                                                        aria-invalid={fieldState.invalid}
                                                        placeholder="نام و نام خانوادگی خود را وارد کنید"
                                                        autoComplete="off"
                                                    />
                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </Field>

                                            )
                                            }
                                        />
                                    )}


                                </FieldGroup>

                                {submitError && (
                                    <p role="alert" className="text-sm text-[#ef4056]">
                                        {submitError}
                                    </p>
                                )}

                                <Button
                                    type="submit"
                                    size="lg"
                                    disabled={isPending}
                                    className="h-12 w-full bg-[#ef4056] font-[iransansBold] text-white hover:bg-[#d92f46] disabled:cursor-wait disabled:opacity-70"
                                >
                                    {isPending && (
                                        <span
                                            aria-hidden="true"
                                            className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                                        />
                                    )}
                                    {currentStep == 'password' && identifyState == false ? 'ادامه'
                                        : currentStep == 'password' && identifyState == true ? 'ورود'
                                            : currentStep == 'identifier' ? 'ادامه'
                                                : currentStep === 'fullname' ? 'ثبت نام'
                                                    : null}
                                </Button>

                            </form>
                        </CardContent>

                        <CardFooter className="justify-center border-t border-border/60 bg-transparent px-5 py-5 sm:px-8">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Check className="size-4 text-[#00a049]" />
                                ورود امن و سریع با کد تأیید
                            </div>
                        </CardFooter>
                    </Card>
                </section>

                <footer className="text-center text-[11px] text-muted-foreground">
                    با عضویت در دیجی‌کالا، خریدتان را ساده‌تر مدیریت کنید.
                </footer>
            </div>
        </main>
    )
}
