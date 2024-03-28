'use client'

import { useEffect, useState } from "react"
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const [screenWidth, setScreenWidth] = useState(0)
  const pathName = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll)


    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    handleResize();


    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

    return (
      <div className={`w-full fixed h-20 top-0 left-0 flex justify-center items-center box-border transition-all shadow-md ${pathName == "/" ? (scrolled ? "text-gray-800 border-gray-200" : "text-gray-800 border-gray-600") : "text-gray-800 border-gray-200"} ${pathName == "/" ? (scrolled ? "bg-white" : " bg-transparent") : "bg-white"} border-b z-10`}>
        <div className="flex justify-between items-center w-full xl:max-w-screen-xl">
          
          <div className="text-3xl h-full font-bold pl-2">
            <Link href="/">
              <div className="flex justify-between items-center">
                <Image className="mr-2"
                  src="/logo_brand.png"
                  alt="Logo"
                  width={80}
                  height={80}
                />
                <p className="hidden md:block">
                  Smart Travel 
                </p>
              </div>
            </Link>
          </div>
          <div className="flex justify-end">
            <button 
              id="dropdownDefaultButton" 
              data-dropdown-toggle="dropdown" 
              className="px-3 box-border focus:boder-2 mr-2 flex items-center justify-center cursor-pointer py-2 rounded bg-slate-100 bg-opacity-50 hover:bg-opacity-70 hover:text-gray-500">
                <Link href="/booking-management">
                  <p className="hidden md:block">
                    Booking Management
                  </p>
                  <span className="flex md:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 block md:hidden mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                    </svg>
                    Management
                  </span>
                </Link>
              </button>
          </div>
        </div>
      </div>
    )
}

export default Header