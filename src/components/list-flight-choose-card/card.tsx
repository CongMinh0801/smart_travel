'use client'

import CardDetail from "./flight-choose-detail/detail"
import { Dispatch, SetStateAction, useState } from 'react';
import { setChuyenBayDiState, setChuyenBayVeState } from "@/app/GlobalRedux/Features/flights/flightsSlice";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useDispatch } from "react-redux";

const Card = (
    {
        khuHoi,
        ngayDi,
        ngayVe,
        sanBayDi,
        sanBayDen,
        chonChuyenDi,
        chonChuyenVe,
        chonChuyen,
        setChonChuyenDi,
        setChonChuyenVe,
        setChonChuyen,
        router,
    }:{
        khuHoi: boolean | null,
        ngayDi: string | null,
        ngayVe: string | null,
        sanBayDi: string | null,
        sanBayDen: string | null,
        chonChuyenDi: any,
        chonChuyenVe: any,
        chonChuyen: string,
        setChonChuyenDi: Dispatch<SetStateAction<any>>,
        setChonChuyenVe: Dispatch<SetStateAction<any>>,
        setChonChuyen: Dispatch<SetStateAction<string>>,
        router: AppRouterInstance,
    }) => {

    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const formatNgayDi = (ngay: string | null) => {
        if (ngay === null) {
            return "Ngày không hợp lệ";
        }
    
        const listNgayDi = ngay.split("-")
        const thangTiengViet = ["Tháng Một","Tháng Hai","Tháng Ba","Tháng Tư","Tháng Năm","Tháng Sáu","Tháng Bảy","Tháng Tám","Tháng Chín","Tháng Mười","Tháng Mười Một","Tháng Mười Hai"];
        return listNgayDi[2] + " " + thangTiengViet[parseInt(listNgayDi[1]) - 1] + " " + listNgayDi[0];
    }

    const xacNhanChon = () => {
        if(khuHoi) {
            if(chonChuyenDi && chonChuyenVe) {
                setLoading(true)
                dispatch(setChuyenBayDiState(chonChuyenDi))
                dispatch(setChuyenBayVeState(chonChuyenVe))
                sessionStorage.setItem('chuyenBayDi', JSON.stringify(chonChuyenDi))
                sessionStorage.setItem('chuyenBayVe', JSON.stringify(chonChuyenVe))
                router.push(`/flights/booking`)
            } else {
                alert("Hãy chọn chuyến đi và chguyến về")
            }
        } else {
            if(chonChuyenDi) {
                setLoading(true)
                dispatch(setChuyenBayDiState(chonChuyenDi))
                sessionStorage.setItem('chuyenBayDi', JSON.stringify(chonChuyenDi))
                router.push(`/flights/booking`)
            } else {
                alert("Hãy chọn chuyến bay")
            }
        }
    }

    return (
        <div className="w-full bg-white shadow-md box-border p-2 items-center text-base fixed md:relative bottom-0 left-0 border-t-2 border-gray-300 flex flex-wrap md:block md:border md:border-gray-100">
            <div className="flex w-full justify-between text-sm md:text-base">
                <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                    Chuyến bay
                </div>
                <p className="">{khuHoi ? "Khứ hồi" : "Một chiều"}</p>
            </div>
            <div className={`${khuHoi ? "w-1/2" : "w-full"} md:w-full md:mt-2 ${chonChuyen !== "Chuyến đi" ? "grayscale py-2" : "rounded py-2"} cursor-pointer transition-all`}>
                <button onClick={()=>setChonChuyen("Chuyến đi")} className="flex justify-start border-l-4 border-blue-400">
                    <div className="ml-2">
                        <div className="py-2 px-4 bg-blue-500 rounded-md flex justify-center items-center text-white font-bold">
                            1
                        </div>
                    </div>
                    <div className="md:ml-4 ml-2">
                        <p className="text-xs h-1/2 text-gray-500">{formatNgayDi(ngayDi)}</p>
                        <p className="text-xs h-1/2 font-semibold text-gray-800 text-start">{`${sanBayDi} → ${sanBayDen}`}</p>
                    </div>
                </button>
                {
                    chonChuyenDi ? <CardDetail chuyenBay={chonChuyenDi}/> : 
                    chonChuyenDi || chonChuyenVe ? <div className="h-12 w-full"></div> : <div></div>
                }
            </div>
            {khuHoi ? 
            <div className={`w-1/2 md:w-full md:mt-2 ${chonChuyen !== "Chuyến về" ? "grayscale py-2" : "rounded py-2"} cursor-pointer transition-all`}>
                    <button onClick={()=>setChonChuyen("Chuyến về")} className="flex justify-start border-l-4 border-blue-400">
                        <div className="ml-2">
                            <div className="py-2 px-4 bg-blue-500 rounded-md flex justify-center items-center text-white font-bold">
                                2
                            </div>
                        </div>
                        <div className="md:ml-4 ml-2">
                            <p className="text-xs h-1/2 text-gray-500">{formatNgayDi(ngayVe)}</p>
                            <p className="text-xs h-1/2 font-semibold text-gray-800 text-start">{`${sanBayDen} → ${sanBayDi}`}</p>
                        </div>
                    </button>
                    {
                        chonChuyenVe ? <CardDetail chuyenBay={chonChuyenVe}/> : 
                        chonChuyenDi || chonChuyenVe ? <div className="h-12 w-full"></div> : <div></div>
                    }
                </div>
            : <div></div>}
            <div className="md:mt-4 w-full flex justify-center">
                {
                    !loading 
                    ?
                        <button onClick={xacNhanChon} className="sm:w-4/12 w-full py-2 bg-blue-500 hover:bg-blue-400 rounded-md text-white font-semibold">
                            Xác nhận
                        </button>
                    :
                        <button onClick={xacNhanChon} disabled className="sm:w-4/12 w-full py-2 bg-blue-500 hover:bg-blue-400 rounded-md text-white font-semibold flex justify-center">
                            <div role="status" className="w-fit">
                                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                        </button>
                }

            </div>
        </div>
    )
}

export default Card 