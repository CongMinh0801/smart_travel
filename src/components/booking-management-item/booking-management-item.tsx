'use client'

import { BookingItem } from "@/app/booking-management/page"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

export default function BookingManagementItem({
    itemType,
    itemData,
    router,
}:{
    itemType: string,
    itemData: BookingItem,
    router: AppRouterInstance,
}) {
    let journeys_1 = JSON.parse(itemData.journeys_1)
    let journeys_2 = itemData.journeys_2 ? JSON.parse(itemData.journeys_2) : null

    
    let holdTime: Date;
    if (itemData.hold) {
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

    function xemChiTietVe() {
        sessionStorage.setItem("chiTietVe", JSON.stringify(itemData))
        sessionStorage.setItem("loaiVe", itemType)
        router.push("/booking-management/detail-management")
    }

    return (
        <div className="shadow w-full border rounded p-2 sm:p-4 mb-4 text-gray-700 text-base hover:border-blue-300">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="">
                        Mã đặt chỗ: <span className="text-lg text-blue-400 font-bold">{itemData.locator}</span>
                    </h3>
                    <p className="mt-2">
                        Thời gian xuất vé: <span>{formatNgay(itemData.creation)}</span>
                    </p>
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
                <div>
                    <p>
                        {
                            journeys_2
                            ?
                                "Khứ hồi"
                            :
                                "Một chiều"
                        }
                    </p>
                </div>
            </div>
            <div className="mt-2 grid md:grid-cols-2 grid-cols-1 gap-8">
                {
                    journeys_1 
                    ? 
                    <div className="">
                        <h3>
                            <span className="font-bold">Đi:</span> {formatChuoiThoiGian(journeys_1?.departure.localScheduledTime)[1]}
                            <span>{journeys_1_time < currentTime ? <span className="text-red-300 ml-2">Quá thời gian bay</span> : <span className="text-green-500 ml-2">Chưa đến thời gian bay</span> }</span>
                        </h3>
                        <div className="mt-2 flex justify-between md:justify-start p-2 bg-gray-50 rounded w-full">
                            <ul className="w-4/12 text-sm md:text-base text-right">
                                <li>{formatChuoiThoiGian(journeys_1.departure.localScheduledTime)[0]}</li>
                                <li className="font-bold text-blue-500">{journeys_1.departure.airport.code}</li>
                                <li>{journeys_1.departure.airport.name}</li>
                            </ul>
                            <ul className="w-4/12 text-sm md:text-base text-center">
                                <li className="text-xs">{tinhKhoangCachThoiGian(journeys_1.departure.localScheduledTime,journeys_1.arrival.localScheduledTime)}</li>
                                <li>{"--->"}</li>
                                <li className="text-xs">{`${journeys_1.flight.airlineCode} ${journeys_1.flight.flightNumber}`}</li>
                            </ul>
                            <ul className="w-4/12 text-sm md:text-base text-left">
                                <li>{formatChuoiThoiGian(journeys_1.arrival.localScheduledTime)[0]}</li>
                                <li className="font-bold text-blue-500">{journeys_1.arrival.airport.code}</li>
                                <li>{journeys_1.arrival.airport.name}</li>
                            </ul>
                        </div>
                    </div>
                    :
                    <></>
                }
                {
                    journeys_2 
                    ? 
                    <div className="mt-2 md:mt-0">
                        <h3>
                            <span className="font-bold">Về:</span> {formatChuoiThoiGian(journeys_2.departure.localScheduledTime)[1]}
                            <span>{journeys_2_time < currentTime ? <span className="text-red-300 ml-2">Quá thời gian bay</span> : <span className="text-green-500 ml-2">Chưa đến thời gian bay</span> }</span>
                        </h3>
                        <div className="mt-2 flex justify-between md:justify-start p-2 bg-gray-50 rounded w-full">
                            <ul className="w-4/12 text-sm md:text-base text-right">
                                <li>{formatChuoiThoiGian(journeys_2.departure.localScheduledTime)[0]}</li>
                                <li className="font-bold text-blue-500">{journeys_2.departure.airport.code}</li>
                                <li>{journeys_2.departure.airport.name}</li>
                            </ul>
                            <ul className="w-4/12 text-sm md:text-base text-center">
                                <li className="text-xs">{tinhKhoangCachThoiGian(journeys_2.departure.localScheduledTime,journeys_2.arrival.localScheduledTime)}</li>
                                <li>{"--->"}</li>
                                <li className="text-xs">{`${journeys_2.flight.airlineCode} ${journeys_2.flight.flightNumber}`}</li>
                            </ul>
                            <ul className="w-4/12 text-sm md:text-base text-left">
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
            <div className="mt-4 flex justify-between">
                {
                    itemData.payment === 1
                    ?
                    <div className="py-1 h-fit px-2 bg-green-400 text-white font-semibold text-sm md:text-base rounded">
                        Đã thanh toán
                    </div>
                    :
                    <div className="py-1 h-fit px-2 bg-orange-400 text-white font-semibold text-sm md:text-base rounded">
                        Đặt chỗ
                    </div>
                }
                <button onClick={xemChiTietVe} className="py-2 px-4 bg-blue-400 text-white font-semibold text-sm md:text-base rounded hover:bg-blue-500">
                    Xem chi tiết
                </button>
            </div>
        </div>
    )
}