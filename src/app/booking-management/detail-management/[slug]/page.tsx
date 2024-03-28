// components/change-flight.tsx
'use client'

import Flight from "@/components/list-flight-item/flight";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const ChangeFlight = (props: any) => {
    const [chuyenDuocChon, setChuyenDuocChon] = useState<any>();
    const [danhSachChuyenBay, setDanhSachChuyenBay] = useState<any[]>([]);
    const [selectedOption, setSelectedOption] = useState<number>(0)
    const [fetchSuccess, setFetchSuccess] = useState<boolean>(false)
    const searchParams = props.searchParams
    const router = useRouter()
    
    useEffect(() => {
        timChuyen(searchParams.sanBayDi, searchParams.sanBayDen, searchParams.ngayDi, searchParams.adultCount, searchParams.childCount, searchParams.infantCount)
    }, []);

    useEffect(() => {
        console.log(chuyenDuocChon)
    }, [chuyenDuocChon, selectedOption])

    const layThoiGian = (dateTimeString:string) =>  {
        const dateTime = new Date(dateTimeString);      
        const hours = dateTime.getHours();
        const minutes = dateTime.getMinutes();
        const timeString = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
        return timeString;
    }

    const backPage = () => {
        router.back()
    }

    const timChuyen = async (sanBayDi:string, sanBayDen:string, ngayDi:string, adultCount:string, childCount:string, infantCount:string) => {
        try {
            const queryData = {
                cityPair: `${sanBayDi}-${sanBayDen}`,
                departure: ngayDi,
                reservation: "string",
                journey: "string",
                currency: 'VND',
                adultCount: adultCount,
                childCount: childCount,
                infantCount: infantCount,
            };

            const newQueryParams = new URLSearchParams(queryData);
            const baseUrl = process.env.BASE_API_URL;
            const response = await axios.get(`${baseUrl}/TravelOptions?${newQueryParams.toString()}`);

            if (response.data) {
                setDanhSachChuyenBay(response.data);
                setFetchSuccess(true)
                console.log(response.data)
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error: any) {
            console.error('Error fetching data:', error.message);
        }
    };

    return (
        <div className="w-full xl:max-w-screen-xl mt-24 min-h-screen grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
            <div className=" col-span-2 sm:col-span-1 text-sm md:text-base sm:hidden block bg-white">
                <div className=" shadow-md border p-2 mt-4 rounded">
                    <h2 className="font-bold text-gray-800 mb-2">
                        Chuyến bay được chọn
                    </h2>
                    <div>
                        {
                            chuyenDuocChon
                            ?
                            <div>
                                <div className="flex items-center">
                                    <p>
                                        Hạng ghế:
                                    </p>
                                    <select className="p-1 border border-gray-300 rounded ml-2" name="" id="" value={selectedOption} onChange={(e) => setSelectedOption(parseInt(e.target.value))}>
                                        {
                                            chuyenDuocChon?.fareOptions.map((item:any, index:number)=>{
                                                return <option value={index} key={index}>{`${item.fareClass.description}`}</option>
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="mt-2 flex flex-wrap">
                                    <div className="flex items-center w-1/2 sm:w-full">
                                        <div>
                                            <ul className="">
                                                <li className="flex justify-end font-bold text-gray-800">{chuyenDuocChon?.flights[0].departure.airportCode}</li>
                                                <li className="flex justify-end font-bold text-blue-400 text-lg">{layThoiGian(chuyenDuocChon?.flights[0].departure.localScheduledTime)}</li>
                                            </ul>
                                        </div>
                                        <div className="px-4">
                                            <span>{"---->"}</span>
                                        </div>
                                        <div>
                                            <ul className="">
                                                <li className="flex justify-start font-bold text-gray-800">{chuyenDuocChon?.flights[0].arrival.airportCode}</li>
                                                <li className="flex justify-start font-bold text-blue-400 text-lg">{layThoiGian(chuyenDuocChon?.flights[0].arrival.localScheduledTime)}</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="w-1/2 sm:w-full mt-2">
                                        <span className="text-lg text-orange-500 text-end font-bold">
                                            {chuyenDuocChon?.fareOptions[selectedOption].priceAdult.toLocaleString()} VND
                                        </span>
                                    </div>
                                </div>
                            </div>
                            :
                            <p>Chưa có chuyến được chọn</p>
                        }
                    </div>
                    <div className="w-full flex justify-between pt-2 border-t">
                        <button onClick={backPage} className=" rounded-md font-medium bg-white box-border border-2 border-blue-500 hover:bg-blue-500 hover:text-white text-blue-500 p-2">
                            Thay đổi tìm kiếm
                        </button>
                        <button className=" rounded-md font-medium bg-blue-500 box-border border-2 border-blue-500 hover:bg-white hover:text-blue-500 text-white p-2">
                            Xác nhận
                        </button>
                    </div>
                </div>
            </div>
            <div className=" col-span-2">
            {fetchSuccess ? (
                    danhSachChuyenBay.length > 0 ? (
                        danhSachChuyenBay.map((item, index) => (
                            <div key={index}>
                                <Flight
                                    dataFlight={item}
                                    nguoiLon={searchParams.adultCount}
                                    treEm={searchParams.childCount}
                                    emBe={searchParams.infantCount}
                                    chuyenDuocChon={chuyenDuocChon}
                                    setChuyenDuocChon={setChuyenDuocChon}
                                />
                            </div>
                        ))
                    ) : (
                        <div>
                            <p>Không có chuyến bay</p>
                        </div>
                    )
                ) : (
                    <div className="w-full flex justify-center py-8 min-h-[640px]">
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
                )}
            </div>
            <div className=" col-span-2 sm:col-span-1 text-sm md:text-base sm:block hidden bg-white">
                <div className=" shadow-md border p-2 mt-4 rounded">
                    <h2 className="font-bold text-gray-800 mb-2">
                        Chuyến bay được chọn
                    </h2>
                    <div>
                        {
                            chuyenDuocChon
                            ?
                            <div>
                                <div className="flex items-center">
                                    <p>
                                        Hạng ghế:
                                    </p>
                                    <select className="p-1 border border-gray-300 rounded ml-2" name="" id="" value={selectedOption} onChange={(e) => setSelectedOption(parseInt(e.target.value))}>
                                        {
                                            chuyenDuocChon?.fareOptions.map((item:any, index:number)=>{
                                                return <option value={index} key={index}>{`${item.fareClass.description}`}</option>
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="mt-2 flex flex-wrap">
                                    <div className="flex items-center w-1/2 sm:w-full">
                                        <div>
                                            <ul className="">
                                                <li className="flex justify-end font-bold text-gray-800">{chuyenDuocChon?.flights[0].departure.airportCode}</li>
                                                <li className="flex justify-end font-bold text-blue-400 text-lg">{layThoiGian(chuyenDuocChon?.flights[0].departure.localScheduledTime)}</li>
                                            </ul>
                                        </div>
                                        <div className="px-4">
                                            <span>{"---->"}</span>
                                        </div>
                                        <div>
                                            <ul className="">
                                                <li className="flex justify-start font-bold text-gray-800">{chuyenDuocChon?.flights[0].arrival.airportCode}</li>
                                                <li className="flex justify-start font-bold text-blue-400 text-lg">{layThoiGian(chuyenDuocChon?.flights[0].arrival.localScheduledTime)}</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="w-1/2 sm:w-full mt-2">
                                        <span className="text-lg text-orange-500 text-end font-bold">
                                            {chuyenDuocChon?.fareOptions[selectedOption].priceAdult.toLocaleString()} VND
                                        </span>
                                    </div>
                                </div>
                            </div>
                            :
                            <p>Chưa có chuyến được chọn</p>
                        }
                    </div>
                    <div className="w-full flex justify-between pt-2 border-t">
                        <button onClick={backPage} className=" rounded-md font-medium bg-white box-border border-2 border-blue-500 hover:bg-blue-500 hover:text-white text-blue-500 p-2">
                            Thay đổi tìm kiếm
                        </button>
                        <button className=" rounded-md font-medium bg-blue-500 box-border border-2 border-blue-500 hover:bg-white hover:text-blue-500 text-white p-2">
                            Xác nhận
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangeFlight;


