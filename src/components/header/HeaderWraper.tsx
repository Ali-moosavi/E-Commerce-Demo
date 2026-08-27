'use client'
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAppDispatch , useAppSelector } from "@/redux/setup/hooks";
import { GetProductsAction } from "@/redux/features/products/ProductsService";
import MainHeader from "./MainHeader";
import { authClient } from "@/lib/auth-clients";
import type { ProductCategory } from "@/types/types";

export default function HeaderWraper() {
    const { data: session, isPending, refetch: refetchSession } = authClient.useSession()

    const { products, status } = useAppSelector((state) => state.Productstate)

    const dispatch= useAppDispatch()


    useEffect(()=>{
        dispatch(GetProductsAction())
       
     },[dispatch])
     const Location = usePathname()

    useEffect(() => {
        void refetchSession()
    }, [Location, refetchSession])
    let Headerstates = false
    let CategoryHeader = false
    let registerHeader = false
    const profileHeader = Location.startsWith(`/user/profile`)
     

    products?.forEach((category: ProductCategory) => {
        if (Location.startsWith(`/category/${category.categoryid}/`)){
            Headerstates = true
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
                Headerstates={Headerstates}
                CategoryHeader={CategoryHeader}
                isLoading={status === 'idle' || status === 'loading' || isPending}
                registerHeader = {registerHeader}
                profile={profileHeader}
                session={session}
            />
        </div>
    )
}
