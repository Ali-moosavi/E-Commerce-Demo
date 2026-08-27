'use client'
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { useState } from 'react';
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function MobileBottomNavigation({ isAuthenticated }: { isAuthenticated: boolean }){

    const [Icone1, setIcone1] = useState(true)
    const [Icone2, setIcone2] = useState(false)
    const [Icone3, setIcone3] = useState(false) 
    const [Icone4, setIcone4] = useState(false)
    const Location = usePathname()
        const isCartRoute = Location.startsWith('/user/cart')

    return  <>
              <Link 
            className={`flex flex-col items-center cursor-pointer text-[25px] ${Icone1? 'text-gray-800' :'text-gray-500'} ${isCartRoute ? 'hidden' : ''}`}
                onClick={()=>{
                    setIcone1((perv)=>!perv)
                    setIcone2(false)
                    setIcone3(false)
                    setIcone4(false)
                 }}
                 href={'/'}
                >
                    <HomeOutlinedIcon fontSize="inherit" />
                    <span className="text-[10px] mt-1 font-bold">خانه</span>
                </Link>
                <Link
                className={`flex flex-col items-center cursor-pointer text-[25px] ${Icone2? 'text-gray-800' :'text-gray-500'} ${isCartRoute ? 'hidden' : ''}`}
                 onClick={()=>{
                    setIcone1(false)
                    setIcone2((perv)=>!perv)
                    setIcone3(false)
                    setIcone4(false)
                 }}
                 href={'/category'}
                 >
                    <CategoryOutlinedIcon fontSize="inherit" />
                    <span className="text-[10px] mt-1">دسته‌بندی</span>
                </Link>
                <Link 
                className={`flex flex-col items-center cursor-pointer text-[25px] ${Icone3? 'text-gray-800' :'text-gray-500'} ${isCartRoute ? 'hidden' : ''}`}
                onClick={()=>{
                    setIcone1(false)
                    setIcone2(false)
                    setIcone3((perv)=>!perv)
                    setIcone4(false)
                 }}
                 href={'/user/cart'}
                >
                    <ShoppingCartOutlinedIcon fontSize="inherit" />
                    
                    <span className="text-[10px] mt-1">سبد خرید</span>
                </Link>
                <Link
                 className={`flex flex-col items-center cursor-pointer text-[25px] ${Icone4? 'text-gray-800' :'text-gray-500'} ${isCartRoute ? 'hidden' : ''}`}
                 onClick={()=>{
                    setIcone1(false)
                    setIcone2(false)
                    setIcone3(false)
                    setIcone4((perv)=>!perv)
                 }}
                 href={isAuthenticated ? '/user/profile' : '/user/registeration'}
                 >
                    <PersonOutlineOutlinedIcon fontSize="inherit" />
                    <span className="text-[10px] mt-1">دیجی‌کالای من</span>
                </Link>
    </>
}