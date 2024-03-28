'use client'

import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

type DanhSachNgay = {
    date: string;
    weekday: string;
}

const ListFlightHeader = (
    {
        sanBayDi,
        sanBayDen,
        ngayDi,
        ngayVe,
        hanhKhach,
        chonChuyen,
        ngayDiMoi,
        ngayVeMoi,
        setNgayDiMoi,
        setNgayVeMoi

    }:{
        sanBayDi: string | null,
        sanBayDen: string | null,
        ngayDi: string | null,
        ngayVe: string | null,
        hanhKhach: number | null,
        chonChuyen: string,
        ngayDiMoi: string,
        ngayVeMoi: string,
        setNgayDiMoi: Dispatch<SetStateAction<string>>
        setNgayVeMoi: Dispatch<SetStateAction<string>>
    }) => {
    const router = useRouter()
    const [danhSachNgayOption, setDanhSachNgayOption] = useState<DanhSachNgay[]>([])

    const formatNgay = (ngay: string | null) => {
        if (ngay === null) {
            return "Ngày không hợp lệ";
        }
        const listNgayDi = ngay.split("-")
        const thangTiengViet = ["Tháng Một","Tháng Hai","Tháng Ba","Tháng Tư","Tháng Năm","Tháng Sáu","Tháng Bảy","Tháng Tám","Tháng Chín","Tháng Mười","Tháng Mười Một","Tháng Mười Hai"];
        return listNgayDi[2] + " " + thangTiengViet[parseInt(listNgayDi[1]) - 1] + " " + listNgayDi[0];
    }
    
    const setNgayMoi = (ngay: string) => {
        if(chonChuyen == "Chuyến đi") {
            setNgayDiMoi(ngay)
        } else {    
            setNgayVeMoi(ngay)
        }
    }

    const danhSachNgay = (ngay: string) => {
        const ngayChon = new Date(ngay);
        const danhSachNgayLienKe = [];
      
        for (let i = 2; i > 0; i--) {
          const previousDay = new Date(ngayChon);
          previousDay.setDate(ngayChon.getDate() - i);
          danhSachNgayLienKe.push(previousDay);
        }
      
        danhSachNgayLienKe.push(ngayChon);
      
        for (let i = 1; i <= 2; i++) {
          const nextDay = new Date(ngayChon);
          nextDay.setDate(ngayChon.getDate() + i);
          danhSachNgayLienKe.push(nextDay);
        }
      
        const danhSach = danhSachNgayLienKe.map(day => {
          const isValidDate = !isNaN(day.getTime()); 
      
          return {
            date: isValidDate ? day.toISOString().split('T')[0] : '',
            weekday: isValidDate ? day.toLocaleDateString('vi-VN', { weekday: 'long' }) : ''
          };
        });
      
        return danhSach;
    }; 

    const soSanhNgay = (ngay: string) => {
        const currentDate = new Date();
        const compareDate = new Date(ngay + " 23:59:59");

        if (compareDate > currentDate) {
            return true
        } else if (compareDate < currentDate) {
            return false
        } else {
            return true
        }
    }

    useEffect(() => {
        if (chonChuyen === "Chuyến đi" && ngayDi !== null) {
            setDanhSachNgayOption(danhSachNgay(ngayDi));
        } else if (chonChuyen === "Chuyến về" && ngayVe !== null) {
            setDanhSachNgayOption(danhSachNgay(ngayVe));
        }
    }, [chonChuyen, ngayDi, ngayVe]);
      
    return (
            <div className="w-full p-2 mb-2 bg-blue-500 border-b-4 border-blue-700 rounded shadow-md">
                <div className="rounded-lg w-full p-2 bg-white flex flex-wrap justify-between items-center transition-all">
                    <div>
                       <h2 className="flex items-center w-full text-base md:text-lg text-gray-800 font-bold">
                            <span>
                                {sanBayDi}
                            </span>
                            <div className="mx-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                </svg>
                            </div>
                            <span>
                                {sanBayDen}
                            </span>
                        </h2>
                        <p className="w-full text-gray-600 md:text-base text-sm font-medium">
                            {`${formatNgay(ngayDi)} | ${hanhKhach} hành khách`}
                        </p>
                    </div>

                    <div>
                        <button onClick={() => router.push('/')} className="md:p-4 p-2 hover:bg-gray-200 bg-gray-100 rounded-md md:mt-0 mt-3 flex items-center">
                            Thay đổi tìm kiếm
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 ml-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="md:grid grid-cols-5 gap-1 mt-2 font-semibold hidden">
                    {
                        danhSachNgayOption.map((item, index) => (
                            <div key={index} className='flex justify-center'>
                                <button disabled={!soSanhNgay(item.date) || index == 2 ? true : false} onClick={() => setNgayMoi(item.date)} className={`w-full cursor-pointer bg-opacity-70 rounded-md box-border hover:bg-gray-200 ${index == 2 ? "bg-gray-400" : soSanhNgay(item.date) ? "bg-transparent" : "bg-gray-600 hover:bg-gray-600"} hover:bg-opacity-50 hover:shadow-inner py-2 text-white transition-all duration-500`}>
                                    {item.weekday}<br/> {formatNgay(item.date).slice(0,-5)}
                                </button>
                            </div>
                        ))
                    }
                </div>
            </div>
    )
}

export default ListFlightHeader