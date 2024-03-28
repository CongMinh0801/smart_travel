'use client'

import "./search-form.css"
import { useEffect, useState } from "react";
import Calendar from 'react-calendar'
import AirportList from "./airport-list/airport-list";
import { setNguoiLonState, setTreEmState, setEmBeState } from "@/app/GlobalRedux/Features/passenger/passengerSlice";
import { useDispatch } from "react-redux";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { setChuyenBayDiState, setChuyenBayVeState } from "@/app/GlobalRedux/Features/flights/flightsSlice";

type ValuePiece = Date | null ;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function SearchForm({router} : {router:AppRouterInstance}) {
    const dispatch = useDispatch()

    const [sanBayDi, setSanBayDi] = useState<string>("Hồ Chí Minh (SGN)")
    const [sanBayDen, setSanBayDen] = useState<string>("Hà Nội (HAN)")

    const [ngayDi, setNgayDi] = useState<Value>(new Date());
    const [ngayVe, setNgayVe] = useState<Value>(new Date());

    const [nguoiLon, setNguoiLon] = useState<number>(1)
    const [treEm, setTreEm] = useState<number>(0)
    const [emBe, setEmBe] = useState<number>(0)

    const [calendarNgayDi, setCalendarNgayDi] = useState(false);
    const [calendarNgayVe, setCalendarNgayVe] = useState(false);

    const [listAirportDi, setListAirportDi] = useState(false);
    const [listAirportDen, setListAirportDen] = useState(false);

    const [khuHoi, setKhuhoi] = useState(false)
    const [loading, setLoading] = useState(false)

    const [validationNgayVe, setValidationNgayVe] = useState<boolean>(false)

    const isDateDisabled = ({ date }: any) => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 1);
        return date < currentDate;
    };
    
    const xuLiTimKiem = () => {
        setLoading(true)
        const query = {
            san_bay_di: sanBayDi.substring(sanBayDi.length - 4, sanBayDi.length - 1),
            san_bay_den: sanBayDen.substring(sanBayDen.length - 4, sanBayDen.length - 1),
            ngay_di: formatDateSubmit(ngayDi) || "",
            ngay_ve: formatDateSubmit(ngayVe) || "",
            nguoi_lon: nguoiLon.toString(),
            tre_em: treEm.toString(),
            em_be: emBe.toString(),
            khu_hoi: khuHoi.toString(),
        };

        const queryString = new URLSearchParams(query).toString();

        dispatch(setNguoiLonState(nguoiLon))
        dispatch(setTreEmState(treEm))
        dispatch(setEmBeState(emBe))
        sessionStorage.setItem("nguoiLon", JSON.stringify(nguoiLon))
        sessionStorage.setItem("treEm", JSON.stringify(treEm))
        sessionStorage.setItem("emBe", JSON.stringify(emBe))
        sessionStorage.removeItem('chuyenBayDi')
        sessionStorage.removeItem('chuyenBayVe')
        dispatch(setChuyenBayDiState(null))
        dispatch(setChuyenBayVeState(null))
        router.push(`/flights?${queryString}`);
    }

    const timKiem = () => {
        if (khuHoi) {
            if(!validationNgayVe) {
                xuLiTimKiem()
            }
        } else {
            xuLiTimKiem()
        }
    };
    
    

    const showCalendar = (value:string) => {
        if(value == "Đi") {
            setCalendarNgayDi(true);
            setCalendarNgayVe(false);
        } else {
            setCalendarNgayDi(false);
            setCalendarNgayVe(true);
        }
    };
  
    const hideCalendar = () => {
      setCalendarNgayDi(false);
      setCalendarNgayVe(false);
    };

    const showListAirport = (value:string) => {
        if(value == "Đi") {
            setListAirportDi(true);
            setListAirportDen(false);
        } else {{
            setListAirportDi(false);
            setListAirportDen(true);
        }}
    };
  
    const hideListAirport = () => {
      setListAirportDi(false);
      setListAirportDen(false);
    };

    const xuLiKhuHoi = () => {
        setKhuhoi(!khuHoi)
    }

    const tangHanhKhach = (param:string) => {
        if(param == "Người lớn") {
            setNguoiLon(nguoiLon + 1)
        } else if (param == "Trẻ em") {
            setTreEm(treEm + 1)
        } else if (param == "Em bé") {
            if (emBe < nguoiLon) {
                setEmBe(emBe + 1)
            }
        }
    }

    const giamHanhKhach = (param:string) => {
        if(param == "Người lớn") {
            if(nguoiLon > 1) {
                if(nguoiLon == emBe) {
                    setNguoiLon(nguoiLon - 1)
                    setEmBe(emBe - 1)
                } else {
                    setNguoiLon(nguoiLon - 1)
                }
            }
        } else if (param == "Trẻ em") {
            if(treEm > 0) {
                setTreEm(treEm - 1)
            }
        } else if (param == "Em bé") {
            if(emBe > 0) {
                setEmBe(emBe - 1)
            }
        }
    }
  
    const formatDate = (date: Value) => {
        if (date) {
            const listItem = date.toString().split(" ");
            if (Array.isArray(listItem) && listItem.length > 0) {
              const thangTiengViet = ["Tháng Một","Tháng Hai","Tháng Ba","Tháng Tư","Tháng Năm","Tháng Sáu","Tháng Bảy","Tháng Tám","Tháng Chín","Tháng Mười","Tháng Mười Một","Tháng Mười Hai"];
              const thangAbbreviations = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
              return listItem[2] + " " + thangTiengViet[thangAbbreviations.indexOf(listItem[1])] + " " + listItem[3] ;
            }
        }
        return "Invalid Date";
    };
    
    const formatDateSubmit = (date: Value) => {
        if (date) {
            const listItem = date.toString().split(" ");
            if (Array.isArray(listItem) && listItem.length > 0) {
                const thangTiengViet = ["Tháng Một","Tháng Hai","Tháng Ba","Tháng Tư","Tháng Năm","Tháng Sáu","Tháng Bảy","Tháng Tám","Tháng Chín","Tháng Mười","Tháng Mười Một","Tháng Mười Hai"];
                const thangAbbreviations = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                let thang = (thangAbbreviations.indexOf(listItem[1]) + 1).toString()
                if(thang.length == 1) {
                thang = "0" + thang
              }
              return listItem[3] + "-" + thang + "-" + listItem[2] ;
            }
        }
        return "Invalid Date";
    };

    useEffect(()=>{
        hideCalendar()
        if(ngayVe && ngayDi) {
            if(ngayVe >= ngayDi) {
                setValidationNgayVe(false)
            } else {
                setValidationNgayVe(true)
            }
        }
    },[ngayDi, ngayVe])

    const swapAirport = () => {
        let temp = sanBayDi
        setSanBayDi(sanBayDen)
        setSanBayDen(temp)
    }

    useEffect(() => {
      const handleClickOutside = (event:any) => {
        const calendarContainerDi = document.querySelector('.calendar-container-di');
        const calendarContainerVe = document.querySelector('.calendar-container-ve');
        const listAirportContainerDi = document.querySelector('.listairport-container-di');
        const listAirportContainerVe = document.querySelector('.listairport-container-ve');
        if (calendarContainerDi 
            && !calendarContainerDi.contains(event.target) 
            && calendarContainerVe 
            && !calendarContainerVe.contains(event.target)) {
                
          hideCalendar();
        }

        if (listAirportContainerDi 
            && !listAirportContainerDi.contains(event.target) 
            && listAirportContainerVe 
            && !listAirportContainerVe.contains(event.target)) {
                
          hideListAirport();
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);


    return (
      <div className="text-gray-700 w-full">
        <div className="w-full flex flex-wrap items-center justify-between">
            <div className="lg:w-5/12 w-full lg:mx-0 mx-4 relative">
                <div className="w-2/4 inline-block font-semibold relative">
                    Từ:<br/>
                    <input type="text" placeholder="Nhập tên thành phố" onClick={()=>showListAirport("Đi")} onChange={e => setSanBayDi(e.target.value)} value={sanBayDi} className="my-2 h-10 sm:h-14 text-sm sm:text-base w-full box-border sm:pl-10 pl-7 border-2 text-gray-600 border-gray-400 rounded-l-xl"/>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mt-1 lg:mt-0 lg:w-6 lg:h-6 absolute left-1 top-1/2 translate-x-1 text-gray-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                    <div className={`listairport-container-di w-[200%] ${listAirportDi ? 'block' : 'hidden'} box-border py-2 absolute left-0 z-10 text-sm text-gray-800 bg-white shadow-lg rounded-md border border-gray-400`}>
                        <AirportList setValue={setSanBayDi} sanBay={sanBayDi}/>
                    </div>
                </div>
                <div className="w-2/4 inline-block font-semibold relative">
                    Đến:<br/>
                    <input type="text" placeholder="Nhập tên thành phố" onClick={()=>showListAirport("Đến")} onChange={e => setSanBayDen(e.target.value)} value={sanBayDen} className="my-2 h-10 sm:h-14 text-sm sm:text-base w-full box-border sm:pl-14 pl-9 border-2 text-gray-600 border-gray-400 rounded-r-xl"/>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mt-1 lg:mt-0 lg:w-6 lg:h-6 absolute left-0 top-1/2 md:translate-x-6 translate-x-4 text-gray-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                    <div className={`listairport-container-ve w-[200%] ${listAirportDen ? 'block' : 'hidden'} box-border py-2 absolute left-0 -translate-x-1/2 z-10 text-sm text-gray-800 bg-white shadow-lg rounded-md border border-gray-400`}>
                        <AirportList setValue={setSanBayDen} sanBay={sanBayDen}/>
                    </div>
                </div>

                <button onClick={swapAirport} className="absolute left-1/2 top-1/2 -translate-x-1/2 lg:-translate-y-3 sm:-translate-y-2 -translate-y bg-white lg:h-12 lg:w-12 sm:h-10 sm:w-10 h-6 w-6 flex justify-center items-center border border-gray-400 rounded-full hover:bg-gray-200 hover:rotate-180 transition-all duration-500 text-black">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 lg:mt-0 lg:w-6 lg:h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                </button>
            </div>
            <div className="lg:w-5/12 w-full lg:mx-0 mx-4 relative">
                <div className="w-2/4 inline-block font-semibold relative">
                    Ngày đi:<br/>
                    <input type="text" onClick={()=>showCalendar("Đi")} value={formatDate(ngayDi)} readOnly className="my-2 h-10 sm:h-14 text-sm sm:text-base w-full box-border sm:pl-10 pl-7 border-2 text-gray-600 border-gray-400 rounded-l-xl"/>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mt-1 lg:mt-0 lg:w-6 lg:h-6 absolute ml-2 left-0 top-1/2 translate-x-1 text-gray-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                    </svg>
                    <div className={`calendar-container-di ${calendarNgayDi ? 'block' : 'hidden'} absolute z-10 top-full left-0`}>
                        <Calendar tileDisabled={({ date }) => isDateDisabled({ date })} className="bg-white text-gray-600" value={ngayDi} onChange={setNgayDi} />
                    </div>
                </div>
                <div className="w-2/4 inline-block font-semibold relative">
                    Ngày về:<br/>
                    <input disabled={khuHoi ? false : true} type="text" onClick={()=>showCalendar("Về")} value={formatDate(ngayVe)} readOnly className="my-2 h-10 sm:h-14 text-sm sm:text-base w-full box-border sm:pl-10 pl-7 border-2 text-gray-600 border-gray-400 rounded-r-xl"/>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mt-1 lg:mt-0 lg:w-6 lg:h-6 absolute ml-2 left-0 top-1/2 translate-x-1 text-gray-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                    </svg>
                    <div className={`calendar-container-ve ${calendarNgayVe ? 'block' : 'hidden'} absolute z-10 top-full left-0 -translate-x-1/2 sm:-translate-x-0`}>
                        <Calendar tileDisabled={({ date }) => isDateDisabled({ date })} className="bg-white text-gray-600" value={ngayVe} onChange={setNgayVe} />
                    </div>
                    {
                        khuHoi && validationNgayVe ? (
                            <>
                                <p className="text-rose-500 font-normal text-xs sm:text-sm block absolute bottom-[-10px] ml-2">Ngày về nhỏ hơn ngày đi</p>
                            </>
                        )
                        : <></>
                    }
                </div>
                <button onClick={xuLiKhuHoi} className={`text-gray-600 sm:p-2 p-1 sm:text-base text-sm hover:bg-orange-600 hover:text-white ${khuHoi ? "bg-orange-500 text-white" : "bg-white"} rounded-md font-medium mt-3 absolute top-full right-0`}>
                    Khứ hồi
                </button>
            </div>

            <button onClick={() => timKiem()} className=" text-white hidden lg:flex bg-orange-500 sm:p-4 p-2 mt-6 box-border border border-gray-200 rounded-xl cursor-pointer hover:bg-orange-600 transition-all item-center">
                Tìm kiếm
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mt-1 lg:mt-0 lg:w-6 lg:h-6 ml-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </button>
        </div>
        <div className="w-full lg:flex flex-wrap items-center mb-4 mt-16 px-4 lg:px-0 box-border lg:mt-4 lg:mx-0 grid grid-cols-2 gap-4 sm:text-base text-sm">
            <div className="search-form-customer-count h-8 py lg:px-4 px-1 flex justify-between items-center lg:mr-6 mr-0 rounded-md border-2 border-gray-400">
                Người lớn: 
                <div className="flex items-center justify-between">
                    <button onClick={()=>tangHanhKhach("Người lớn")} className="">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mx-2 hover:bg-gray-200 hover:text-black">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </button>
                    {nguoiLon}
                    <button onClick={()=>giamHanhKhach("Người lớn")} className="">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mx-2 hover:bg-gray-200 hover:text-black">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="search-form-customer-count h-8 py lg:px-4 px-1 flex justify-between items-center lg:mr-6 mr-0 rounded-md border-2 border-gray-400">
                Trẻ em: 
                <div className="flex items-center justify-between">
                    <button onClick={()=>tangHanhKhach("Trẻ em")} className="">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mx-2 hover:bg-gray-200 hover:text-black">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </button>
                    {treEm}
                    <button onClick={()=>giamHanhKhach("Trẻ em")} className="">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mx-2 hover:bg-gray-200 hover:text-black">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="search-form-customer-count h-8 py lg:px-4 px-1 flex justify-between items-center lg:mr-6 mr-0 rounded-md border-2 border-gray-400">
                Em bé: 
                <div className="flex items-center justify-between">
                    <button onClick={()=>tangHanhKhach("Em bé")} className="">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mx-2 hover:bg-gray-200 hover:text-black">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </button>
                    {emBe}
                    <button onClick={()=>giamHanhKhach("Em bé")} className="">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mx-2 hover:bg-gray-200 hover:text-black">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        <div className="w-full px-4 flex justify-center">
            {
                !loading 
                ?
                    <button onClick={() => timKiem()} className=" text-white w-full sm:w-3/12 flex justify-center sm:justify-between lg:hidden bg-orange-500 sm:p-4 p-2 mt-6 box-border border border-gray-200 rounded-xl cursor-pointer hover:bg-orange-600 transition-all item-center">
                        Tìm kiếm
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mt-1 lg:mt-0 lg:w-6 lg:h-6 ml-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </button>
                :
                    <button onClick={() => timKiem()} disabled className=" w-full sm:w-3/12 flex justify-center lg:hidden bg-orange-500 sm:p-4 p-2 mt-6 box-border border-2 border-gray-400 rounded-xl cursor-pointer hover:bg-orange-600 transition-all item-center">
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