'use client';
import SearchIcon from '@mui/icons-material/Search';
import { type ChangeEvent, useState } from 'react';

export default function HeaderInput() {

    const [searchTerm, setSearchTerm] = useState('');

    const ChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }
   
    return (
        <>
            <div className="relative w-full lg:w-150">
                <div className={` absolute right-4 top-1/2 -translate-y-1/2 opacity-50 flex items-center gap-2`}>
                    <SearchIcon fontSize="small" />
                    <span className={` ${searchTerm ? 'hidden' : null} text-xs`}>جستجو</span>
                </div>
                <input
                    type="text"
                    className="w-full h-10 lg:h-12 rounded-full lg:bg-gray-100 bg-white border-none outline-none pr-12 pl-4 text-sm focus:bg-white focus:ring-1 focus:ring-red-500 transition-all"
                    onChange={ChangeHandler}
                />
            </div>
        </>
    )
}
