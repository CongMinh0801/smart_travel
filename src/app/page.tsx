//Home Page
'use client'

import SearchForm from "@/components/homepage-search-form/search-form";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router:AppRouterInstance  = useRouter();

  return (
    <>
    <div className="w-full block bg-[url('../../public/plane-background.jpg')] bg-top">
      <div className="flex justify-center flex-wrap mt-[82px]">
        <div className="w-full xl:max-w-screen-xl mt-12 mb-12 flex justify-center flex-wrap">
          <h1 className="my-4 text-gray-800 font-bold text-3xl w-full text-center flex justify-center">
            Từ Việt Nam Đến Thế Giới, Trong Tầm Tay Bạn
          </h1>
          <SearchForm router={router} />
        </div>

        <div className='bg-white w-full rounded-t-3xl flex justify-center'>
          <div className="md:pt-16 pt-10 pb-16 w-full xl:max-w-screen-xl mx-4 xl:mx-0">
            <div className="">
              <h2 className="font-bold text-xl mb-2">Tours</h2>
              <div className="grid xl:grid-cols-3 xl:gap-8 md:grid-cols-2 sm:gap-6 sm:grid-cols-1 md:gap-8 gap-4">
                <div className=" rounded-md shadow-lg box-border border overflow-hidden">
                  <div className="w-full h-52 bg-cover bg-[url('/tours/tour1.jpg')]">
                  
                  </div>
                  <div className=" bg-white box-border p-2">
                      <h3 className="text-gray-800 font-bold">
                        Tour Đà Nẵng
                      </h3>
                      <p className="text-sm text-gray-600 font-medium">
                        Mô tả tour
                      </p>
                  </div>
                </div>
                <div className=" rounded-md shadow-lg box-border border overflow-hidden">
                  <div className="w-full h-52 bg-cover bg-[url('/tours/tour2.jpg')]">
                  
                  </div>
                  <div className=" bg-white box-border p-2">
                      <h3 className="text-gray-800 font-bold">
                        Tour Hồ Chí Minh
                      </h3>
                      <p className="text-sm text-gray-600 font-medium">
                        Mô tả tour
                      </p>
                  </div>
                </div>
                <div className=" rounded-md shadow-lg box-border border overflow-hidden">
                  <div className="w-full h-52 bg-cover bg-[url('/tours/tour3.jpg')]">
                  
                  </div>
                  <div className=" bg-white box-border p-2">
                      <h3 className="text-gray-800 font-bold">
                        Tour Hà Nội
                      </h3>
                      <p className="text-sm text-gray-600 font-medium">
                        Mô tả tour
                      </p>
                  </div>
                </div>
                <div className=" rounded-md shadow-lg box-border border overflow-hidden hidden md:block">
                  <div className="w-full h-52 bg-cover bg-[url('/tours/tour4.jpg')]">
                  
                  </div>
                  <div className=" bg-white box-border p-2">
                      <h3 className="text-gray-800 font-bold">
                        Tour Hải Phòng
                      </h3>
                      <p className="text-sm text-gray-600 font-medium">
                        Mô tả tour
                      </p>
                  </div>
                </div>
                <div className=" rounded-md shadow-lg box-border border overflow-hidden hidden md:block">
                  <div className="w-full h-52 bg-cover bg-[url('/tours/tour5.jpg')]">
                  
                  </div>
                  <div className=" bg-white box-border p-2">
                      <h3 className="text-gray-800 font-bold">
                        Tour Huế
                      </h3>
                      <p className="text-sm text-gray-600 font-medium">
                        Mô tả tour
                      </p>
                  </div>
                </div>
                <div className=" rounded-md shadow-lg box-border border overflow-hidden hidden md:block">
                  <div className="w-full h-52 bg-cover bg-[url('/tours/tour6.png')]">
                  
                  </div>
                  <div className=" bg-white box-border p-2">
                      <h3 className="text-gray-800 font-bold">
                        Tour Quảng Bình
                      </h3>
                      <p className="text-sm text-gray-600 font-medium">
                        Mô tả tour
                      </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>  
      </div>
    </div>
    </>
  )
}
