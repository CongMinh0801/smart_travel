'use client'

import axios from "axios"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import AirportList from "@/components/homepage-search-form/airport-list/airport-list";
import Calendar from "react-calendar";
import './detail-management.css'

interface PaymentMethod {
    identifier: string;
    description: string;
}

type ValuePiece = Date | null ;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function DetailManagement() {
    let [itemData, setItemData] = useState<any>()
    let [loaiVe, setLoaiVe] = useState<string>()
    const [loading, setLoading] = useState<boolean>(false)
    const [account, setAccount] = useState<any>()
    const [companyKey, setCompanyKey] = useState<string>()
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>()
    const router = useRouter()
    
    const [sanBayDi, setSanBayDi] = useState<string>("")
    const [sanBayDen, setSanBayDen] = useState<string>("")
    const [danhSachSanBay, setDanhSachSanBay] = useState<any>()
    const [ngayDi, setNgayDi] = useState<Value>(new Date());
    const [ngayVe, setNgayVe] = useState<Value>(new Date());
    const [calendarNgayDi, setCalendarNgayDi] = useState(false);
    const [listAirportDi, setListAirportDi] = useState(false);
    const [listAirportDen, setListAirportDen] = useState(false);
    const [journeyChange, setJourneyChange] = useState("Đi")
    const [fetchSuccess, setFetchSuccess] = useState(false)
    const [notError, setNotError] = useState(false)

    useEffect(()=>{
        fetchData()
        if (typeof window !== 'undefined') {
            setItemData(JSON.parse(sessionStorage.getItem("chiTietVe") as string))
            setLoaiVe(sessionStorage.getItem("loaiVe") as string)
            setLoading(true)
        } 
    },[])

    let journeys_1 = itemData?.journeys_1 ? JSON.parse(itemData.journeys_1) : null
    let journeys_2 = itemData?.journeys_2 ? JSON.parse(itemData.journeys_2) : null

    let charge_journeys_1 = itemData?.charge_journeys_1 ? JSON.parse(itemData.charge_journeys_1) : null
    let charge_journeys_2 = itemData?.charge_journeys_2 ? JSON.parse(itemData.charge_journeys_2) : null

    let contact_Info = itemData?.contact_Info ? JSON.parse(itemData.contact_Info) : null
    let passengers = itemData?.passengers ? JSON.parse(itemData.passengers) : null 

    let giaChuyenDi = 0
    let giaChuyenVe = 0

    let holdTime: Date;
    if (itemData?.hold) {
        holdTime = new Date(itemData.hold);
        holdTime.setHours(holdTime.getHours() + 7);
    } else {
        holdTime = new Date("1970-01-01T00:00:00");
    }

    let currentTime = new Date()
    let journeys_1_time, journeys_2_time = new Date("1970-01-01")
    journeys_1_time = new Date(journeys_1?.departure.localScheduledTime )
    if(journeys_2) {
        journeys_2_time = new Date(journeys_2.departure.localScheduledTime )
    }

    charge_journeys_1?.passenger.map((item:any, index:number) => {
        giaChuyenDi+=item.totalAmount
    })
    charge_journeys_2?.passenger.map((item:any, index:number) => {
        giaChuyenVe+=item.totalAmount
    })

    let adultCount = 0, childCount = 0, infantCount = 0
    if(passengers) {
        passengers.map((item:any) => {
            if(item.fareApplicability.adult) {
                adultCount += 1
                if(item.reservationProfile.infants.length > 0) {
                    infantCount += 1
                }
            } else {
                childCount += 1
            }
        })
    }

    useEffect(()=>{
        if(danhSachSanBay && danhSachSanBay.length > 0) {
            danhSachSanBay.map((item:any)=>{
                if(item.code === journeys_1.departure.airport.code){
                    setSanBayDi(`${item.name} (${item.code})`)
                } else if (item.code === journeys_1.arrival.airport.code){
                    setSanBayDen(`${item.name} (${item.code})`)
                }
            })
        }
    },[danhSachSanBay])

    useEffect(()=>{
        if(journeyChange === "Đi") {
            if(danhSachSanBay && danhSachSanBay.length > 0) {
                danhSachSanBay.map((item:any)=>{
                    if(item.code === journeys_1.departure.airport.code){
                        setSanBayDi(`${item.name} (${item.code})`)
                    } else if (item.code === journeys_1.arrival.airport.code){
                        setSanBayDen(`${item.name} (${item.code})`)
                    }
                })
            }
        } else {
            if(danhSachSanBay && danhSachSanBay.length > 0) {
                danhSachSanBay.map((item:any)=>{
                    if(item.code === journeys_2.departure.airport.code){
                        setSanBayDi(`${item.name} (${item.code})`)
                    } else if (item.code === journeys_2.arrival.airport.code){
                        setSanBayDen(`${item.name} (${item.code})`)
                    }
                })
            }
        }
    },[journeyChange])

    const fetchData = async () => {
        try {
            const baseUrl = process.env.BASE_API_URL
            const response = await axios.get(baseUrl + `/Companies`)
            setCompanyKey(response.data[0].key)
            const accountData = {
                accountNumber: response.data[0].account.accountNumber,
                creditLimit: response.data[0].account.creditLimit,
                creditAvailable: response.data[0].account,
                currency: {
                    code: response.data[0].currency.code,
                    description: response.data[0].currency.description,
                }
            }
            setAccount(accountData)
            if (!response.data) {
                throw new Error('Failed to fetch data');
            }
        } catch (error: any) {
            console.error('Error fetching data:', error.message);
        }
    };

    

    const xuLiThanhToan = async () => {
        if(paymentMethod) {
            try {
                const baseUrl = process.env.BASE_API_URL
                const body = {
                    reservationKey: itemData.booking_info_key,
                    data:{
                        "paymentMethod":{
                            "href":"https://vietjet-api.intelisystraining.ca/RESTv1/paymentMethods/tfCeB5%C2%A5mircWvs2CC2%A59VaH1zFawFw==",
                            "key":"tfCeB5¥mircWvs2C4HkDdOXNJfƒNFOopDW2yQCBh2p1¥CcncCLQNu3uhZGWzJkJUbmKK13BpWK¥9VaH1zFawFw==",
                            "identifier": "AG",
                            "description":"Agency Credit"
                        },
                        "paymentMethodCriteria":{
                            "account": {
                                "company": {
                                    "key": companyKey,
                                    "account": account
                                }
                            }
                        },
                        "currencyAmounts": [
                            {
                                "totalAmount": giaChuyenDi + giaChuyenVe,
                                "currency": {
                                    "code": "VND",
                                    "baseCurrency": true
                                },
                                "exchangeRate": 1
                            }
                        ],
                        "processingCurrencyAmounts": [
                            {
                                "totalAmount": 0,
                                "currency": {
                                    "code": "VND",
                                    "baseCurrency": true
                                },
                                "exchangeRate": 1
                            }
                        ],
                        "payerDescription": null,
                        "receiptNumber": null,
                        "payments": null,
                        "refundTransactions": null,
                        "notes": null
                    }
                }
                console.log(body)
                const response = await axios.post(baseUrl + `/reservations/paymentTransactions`, body)
                router.push("/booking-management")
        
                if (!response.data) {
                    throw new Error('Failed to fetch data');
                }
            } catch (error: any) {
                console.error('Error fetching data:', error.message);
            }
        } else {
            alert("Vui lòng chọn phương thức thanh toán")
        }
    };

    function formatNgay(inputDateString: string): string {
        const inputDate = new Date(inputDateString);
        inputDate.setHours(inputDate.getHours() + 7);
        const hours = inputDate.getHours();
        const minutes = inputDate.getMinutes();
        const day = inputDate.getDate();
        const month = inputDate.getMonth() + 1;
        const year = inputDate.getFullYear();
        const formattedString = `${hours}:${minutes < 10 ? '0' : ''}${minutes} - ${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}`;
        return formattedString;
    }

    function tinhKhoangCachThoiGian(startDateString: string, endDateString: string) {
        const startDate = new Date(startDateString);
        const endDate = new Date(endDateString);
        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
            const timeDifference = endDate.getTime() - startDate.getTime();
            const hours = Math.floor(timeDifference / (1000 * 60 * 60));
            const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            const formattedResult = `${hours}h${minutes}m`;
            return formattedResult;
        } else {
            return "Invalid date";
        }
    }

    function formatChuoiThoiGian(inputTimeString: string) {
        const inputDate = new Date(inputTimeString);
        const gio = String(inputDate.getHours()).padStart(2, '0');
        const phut = String(inputDate.getMinutes()).padStart(2, '0');
        const gioPhut = `${gio}:${phut}`;
        const ngay = String(inputDate.getDate()).padStart(2, '0');
        const thang = String(inputDate.getMonth() + 1).padStart(2, '0');
        const nam = inputDate.getFullYear();
        const ngayThang = `${ngay}-${thang}-${nam}`;
        return [gioPhut, ngayThang];
    }

    function formatCurrency(number: number) {
        const formattedNumber = Number(number).toString();
        const parts = formattedNumber.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        const result = parts.join('.');
    
        return `${result} VND`;
    }

    const isDateDisabled = ({ date }: any) => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 1);
        return date < currentDate;
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

    const showCalendar = (value:string) => {
        if(value == "Đi") {
            setCalendarNgayDi(true);
        } else {
            setCalendarNgayDi(false);
        }
    };

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

    const hideCalendar = () => {
        setCalendarNgayDi(false);
    };

    const hideListAirport = () => {
        setListAirportDi(false);
        setListAirportDen(false);
    };

    const xuLyTimChuyen = () => {
        router.push(`/booking-management/detail-management/change-flight?sanBayDi=${layMaSanBay(sanBayDi)}&sanBayDen=${layMaSanBay(sanBayDen)}&ngayDi=${formatDateSubmit(ngayDi)}&adultCount=${adultCount.toString()}&childCount=${childCount.toString()}&infantCount=${infantCount.toString()}&journey=${journeyChange === "Đi" ? "0" : "1"}`)
    }

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

    function layMaSanBay(input: string): string | null {
        const regex = /\(([^)]+)\)/;
        const matches = input.match(regex);
    
        if (matches && matches.length > 1) {
            return matches[1].trim();
        } else {
            return null;
        }
    }


    useEffect(() => {
        const handleClickOutside = (event:any) => {
          const calendarContainerDi = document.querySelector('.calendar-container-di');
          const listAirportContainerDi = document.querySelector('.listairport-container-di');
          const listAirportContainerVe = document.querySelector('.listairport-container-ve');
          if (calendarContainerDi 
              && !calendarContainerDi.contains(event.target) ) {
                  
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
        <div className="pt-24 box-border w-full lg:max-w-screen-lg min-h-screen">
            {
                !loading
                ?   
                    <div className="w-full flex justify-center">
                        <div role="status" className="w-fit">
                            <svg
                                aria-hidden="true"
                                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"
                                />
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                :
                    <>
                        <div className="shadow w-full border rounded p-2 mb-4 text-gray-700 text-base">
                            <h2 className=" font-bold">
                                Loại vé: 
                                {
                                    journeys_2
                                    ?
                                        <span className="ml-2 font-light">{"Khứ hồi"}</span>
                                    :
                                        <span className="ml-2 font-light">{"Một chiều"}</span>
                                }
                            </h2>
                            <div className="flex justify-between items-start mt-2">
                                <div>
                                    <h2 className="">
                                        <span className="font-bold">Mã đặt chỗ:</span> <span className="text-lg text-blue-400 font-bold">{itemData?.locator}</span>
                                    </h2>
                                    <h2 className="mt-2">
                                        <span className="font-bold">Thời gian xuất vé:</span> <span>{formatNgay(itemData?.creation)}</span>
                                    </h2>
                                    {
                                        itemData.hold 
                                        ?
                                        <p className="mt-2">
                                            Thời hạn giữ vé: <span>{holdTime.toLocaleString()}</span>
                                        </p>
                                        :
                                        <></>
                                    }
                                </div>
                            </div>
                            <div className="mt-2 lg:flex">
                                {
                                    journeys_1 
                                    ? 
                                    <div className="md:w-1/2">
                                        <h3>
                                            <span className="font-bold">Đi:</span> {formatChuoiThoiGian(journeys_1?.departure.localScheduledTime)[1]}
                                            <span>{journeys_1_time < currentTime ? <span className="ml-2 text-red-400">Quá thời gian bay</span> : <span className="ml-2 text-green-500">Chưa đến thời gian bay</span> }</span>
                                        </h3>
                                        <div className="mt-2 flex justify-between md:justify-start p-2 bg-gray-50 rounded w-full md:w-fit">
                                            <ul className="w-20 text-sm md:text-base md:w-32 text-right">
                                                <li>{formatChuoiThoiGian(journeys_1?.departure.localScheduledTime)[0]}</li>
                                                <li className="font-bold text-blue-500">{journeys_1?.departure.airport.code}</li>
                                                <li>{journeys_1?.departure.airport.name}</li>
                                            </ul>
                                            <ul className="w-20 text-sm md:text-base md:w-32 text-center">
                                                <li className="text-xs">{tinhKhoangCachThoiGian(journeys_1?.departure.localScheduledTime,journeys_1?.arrival.localScheduledTime)}</li>
                                                <li>{"--->"}</li>
                                                <li className="text-xs">{`${journeys_1?.flight.airlineCode} ${journeys_1?.flight.flightNumber}`}</li>
                                            </ul>
                                            <ul className="w-20 text-sm md:text-base md:w-32 text-left">
                                                <li>{formatChuoiThoiGian(journeys_1?.arrival.localScheduledTime)[0]}</li>
                                                <li className="font-bold text-blue-500">{journeys_1?.arrival.airport.code}</li>
                                                <li>{journeys_1?.arrival.airport.name}</li>
                                            </ul>
                                        </div>
                                    </div>
                                    :
                                    <></>
                                }
                                {
                                    journeys_2 
                                    ? 
                                    <div className="mt-2 md:w-1/2 md:mt-0">
                                        <h3>
                                            <span className="font-bold">Về:</span> {formatChuoiThoiGian(journeys_2.departure.localScheduledTime)[1]}
                                            <span>{journeys_2_time < currentTime ? <span className="ml-2 text-red-400">Quá thời gian bay</span> : <span className="ml-2 text-green-500">Chưa đến thời gian bay</span> }</span>
                                        </h3>
                                        <div className="mt-2 flex justify-between md:justify-start p-2 bg-gray-50 rounded w-full md:w-fit">
                                            <ul className="w-20 text-sm md:text-base md:w-32 text-right">
                                                <li>{formatChuoiThoiGian(journeys_2.departure.localScheduledTime)[0]}</li>
                                                <li className="font-bold text-blue-500">{journeys_2.departure.airport.code}</li>
                                                <li>{journeys_2.departure.airport.name}</li>
                                            </ul>
                                            <ul className="w-20 text-sm md:text-base md:w-32 text-center">
                                                <li className="text-xs">{tinhKhoangCachThoiGian(journeys_2.departure.localScheduledTime,journeys_2.arrival.localScheduledTime)}</li>
                                                <li>{"--->"}</li>
                                                <li className="text-xs">{`${journeys_2.flight.airlineCode} ${journeys_2.flight.flightNumber}`}</li>
                                            </ul>
                                            <ul className="w-20 text-sm md:text-base md:w-32 text-left">
                                                <li>{formatChuoiThoiGian(journeys_2.arrival.localScheduledTime)[0]}</li>
                                                <li className="font-bold text-blue-500">{journeys_2.arrival.airport.code}</li>
                                                <li>{journeys_2.arrival.airport.name}</li>
                                            </ul>
                                        </div>
                                    </div>
                                    :
                                    <></>
                                }
                            </div>

                            <div className="mt-4 md:flex">
                                <div className="md:w-1/2">
                                    <div className="">
                                        <h2><span className="font-bold">Thông tin liên lạc:</span></h2>
                                        <div className=" rounded p-2 w-full md:w-fit">
                                            <ul>
                                                <li className=" font-light"><span className=" font-medium">Họ tên:</span> {contact_Info?.name}</li>
                                                <li className=" font-light"><span className=" font-medium">Điện thoại:</span> {contact_Info?.phoneNumber}</li>
                                                <li className=" font-light"><span className=" font-medium">Email:</span> {contact_Info?.email}</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <h2><span className="font-bold">Thông tin hành khách:</span></h2>
                                        <div className=" rounded p-2 w-full md:w-fit">
                                            {
                                                passengers?.map((item: any, index:number)=>{
                                                    return <div key={index}>
                                                        Hành khách {index + 1}: <br/>
                                                        {`${item.reservationProfile.gender === "Male" ? "Ông" : "Bà"} ${item.reservationProfile.firstName} ${item.reservationProfile.lastName}`}
                                                        {
                                                            item.reservationProfile.infants[0] 
                                                            ? <p className="ml-4">Đi cùng bé {`${item.reservationProfile.infants[0].reservationProfile.firstName} 
                                                            ${item.reservationProfile.infants[0].reservationProfile.lastName}`}</p> 
                                                            : <></>
                                                        }
                                                    </div>
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 md:w-1/2">
                                    <h2><span className="font-bold">Giá:</span></h2>
                                    <div className="w-full pl-2">
                                        <p className=" w-full md:w-9/12 flex justify-between">
                                            Chuyến bay đi: <span>{formatCurrency(giaChuyenDi)}</span>
                                        </p>
                                        {
                                            charge_journeys_2
                                            ?
                                                <p className=" w-full md:w-9/12 flex justify-between">
                                                    Chuyến bay về: <span>{formatCurrency(giaChuyenVe)}</span>
                                                </p>
                                            : 
                                                <></>
                                        }
                                        <p className=" w-full md:w-9/12 flex justify-between">
                                            Tổng: <span className=" text-orange-500 font-bold">{formatCurrency(giaChuyenDi + giaChuyenVe)}</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center mt-4">
                                        <p className="font-bold">
                                            Tình trạng:
                                        </p> <br/>
                                        <p className={`ml-2 py-1 px-4 ${itemData.payment === 0 ? " bg-yellow-300" : "bg-green-300"} w-fit rounded`}>
                                            {
                                                itemData.payment === 0 
                                                ?
                                                "Đặt chỗ"
                                                :
                                                "Đã thanh toán"
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                            {
                                itemData.payment === 0 && holdTime > currentTime
                                ?
                                <>  
                                <div className="shadow w-full border rounded p-2 mb-4 text-gray-700 text-base">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <h3 className="font-bold">Phương thức thanh toán</h3>
                                            <ul>
                                                <li className="flex items-center">
                                                    <input onChange={()=>setPaymentMethod({"identifier": "AG", "description": "Agency Credit"})} className="mr-2" type="radio"/>
                                                    Agency Credit
                                                </li>
                                            </ul>
                                            {
                                                !paymentMethod
                                                ?
                                                <p className="text-red-400 font-light text-sm">
                                                    Vui lòng chọn phương thức thanh toán
                                                </p>
                                                :
                                                <></>
                                            }
                                        </div>
                                        <div>
                                            <button onClick={xuLiThanhToan} className="py-2 px-4 bg-blue-400 hover:bg-blue-500 font-bold text-white rounded">
                                                Thanh toán
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                </>
                                :
                                <></>
                            }
                            {
                                loaiVe !== "Hết hạn"
                                ?
                                <>
                                <div className="shadow w-full border rounded p-2 mb-4 text-gray-700 text-base">
                                    <h3 className="font-bold">Thay đổi chặng bay / ngày bay đi:</h3>
                                    <div className=" flex item-center">
                                        <div className="flex justify-between mr-4">
                                            <input className="mr-2" checked={journeyChange === "Đi"} onChange={() => setJourneyChange("Đi")} type="radio" name="journey" />
                                            <span>Chuyến đi</span>
                                        </div>
                                        {
                                            journeys_2 ?
                                            <div className="flex justify-between">
                                                <input className="mr-2" checked={journeyChange === "Về"} onChange={() => setJourneyChange("Về")} type="radio" name="journey" />
                                                <span>Chuyến về</span>
                                            </div>
                                            :
                                            <></>
                                        }
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mt-2">
                                        <div className="flex items-center col-span-1">
                                            <div className="w-1/2 relative">
                                                <span>Sân bay đi:</span> <br/>
                                                <input type="text"  onClick={()=>showListAirport("Đi")} onChange={e => setSanBayDi(e.target.value)} value={sanBayDi} className="bg-gray-50 w-full outline-none border p-2 rounded-tl-md rounded-bl-md cursor-pointer"/>
                                                <div className={`listairport-container-di w-[200%] ${listAirportDi ? 'block' : 'hidden'} box-border py-2 absolute left-full bottom-full -translate-x-1/2 z-10 text-sm text-gray-800 bg-white shadow-lg rounded-md border border-gray-400`}>
                                                    <AirportList setValue={setSanBayDi} sanBay={sanBayDi} setDanhSachSanBay={setDanhSachSanBay}/>
                                                </div>
                                            </div>
                                            <div className="w-1/2 relative">
                                                <span>Sân bay đến:</span> <br/>
                                                <input type="text"  onClick={()=>showListAirport("Đến")} onChange={e => setSanBayDen(e.target.value)} value={sanBayDen} className="bg-gray-50 w-full outline-none border p-2 rounded-tr-md rounded-br-md cursor-pointer"/>
                                                <div className={`listairport-container-ve w-[200%] ${listAirportDen ? 'block' : 'hidden'} box-border py-2 absolute left-full bottom-full -translate-x-1/2 z-10 text-sm text-gray-800 bg-white shadow-lg rounded-md border border-gray-400`}>
                                                    <AirportList setValue={setSanBayDen} sanBay={sanBayDen} setDanhSachSanBay={setDanhSachSanBay}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center col-span-1">
                                            <div className="w-1/2 relative">
                                                <span>Ngày đi:</span> <br/>
                                                <input type="text" onClick={()=>showCalendar("Đi")} value={formatDate(ngayDi)} readOnly className="bg-gray-50 w-full outline-none border p-2 rounded-tl-md rounded-bl-md cursor-pointer"/>
                                                <div className={`calendar-container-di ${calendarNgayDi ? 'block' : 'hidden'} absolute z-10 bottom-full left-0`}>
                                                    <Calendar tileDisabled={({ date }) => isDateDisabled({ date })} className="bg-white text-gray-600" value={ngayDi} onChange={setNgayDi} />
                                                </div>
                                            </div>
                                            <div className="w-1/2 h-full items-end flex justify-end">
                                                <button onClick={xuLyTimChuyen} className="px-4 py-2 bg-blue-400 hover:bg-blue-500 rounded text-white font-bold">
                                                    Đổi chặng bay    
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </>
                                :
                                <></>
                            }
                    </>
            }
        </div>
    )
}