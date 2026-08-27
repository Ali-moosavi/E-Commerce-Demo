'use client'
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAppDispatch , useAppSelector } from "@/redux/setup/hooks";
import { GetProductsAction } from "@/redux/features/products/ProductsService";
import MainHeader from "./MainHeader";
import type { ProductCategory } from "@/types/types";

type HeaderSession = {
    session?: {
        token?: string
    } | null
    user?: {
        id?: string
    } | null
} | null

export default function HeaderWraper() {
    const [session, setSession] = useState<HeaderSession>(null)
    const [isPending, setIsPending] = useState(true)

    const { products, status } = useAppSelector((state) => state.Productstate)

    const dispatch= useAppDispatch()


    useEffect(()=>{
        dispatch(GetProductsAction())
     },[dispatch])
    const Location = usePathname()

    useEffect(() => {
        const controller = new AbortController()
        setIsPending(true)

        fetch('/api/auth/get-session', { signal: controller.signal })
            .then((response) => response.ok ? response.json() : null)
            .then((nextSession: HeaderSession) => setSession(nextSession))
            .catch(() => setSession(null))
            .finally(() => setIsPending(false))

        return () => controller.abort()
    }, [Location])
    let CategoryHeader = false
    let registerHeader = false
    const profileHeader = Location.startsWith(`/user/profile`)
     

    products?.forEach((category: ProductCategory) => {
        if (Location.startsWith(`/category/${category.categoryid}/`)){
        }
    })

    if (Location.startsWith(`/category/`)){
            CategoryHeader = true
        }
    if (Location.startsWith(`/category`)){
            CategoryHeader = true
        }
           if (Location == `/user/registeration` && !profileHeader){
            registerHeader = true
        }
        
    return (
        <div>
            <MainHeader
                CategoryHeader={CategoryHeader}
                isLoading={status === 'idle' || status === 'loading' || isPending}
                registerHeader = {registerHeader}
                profile={profileHeader}
                session={session}
            />
        </div>
    )
}
