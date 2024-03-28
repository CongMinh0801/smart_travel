'use client'
import { useRouter } from "next/navigation";

const BookingSuccess = () => {
    const router = useRouter()
    let thongTinBookingSuccess
    if (typeof window !== 'undefined') {
        thongTinBookingSuccess = JSON.parse(sessionStorage.getItem("bookingSuccess") as string);
    } else {
        thongTinBookingSuccess = {};
    }
    
    const danhSachHanhKhach = thongTinBookingSuccess.passengers

    const thoiGianBay = (start:string, end:string) => {
        const startTime:Date = new Date(start);
        const endTime:Date = new Date(end);

        const timeDifference = endTime.getTime() - startTime.getTime();

        const hours = Math.floor(timeDifference / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        return `${hours}h${minutes}m`
    }

    console.log(thongTinBookingSuccess)

    function tiepTucDatVe() {
        router.push("/")
    }

    function formatDateTime(inputDateTime: string) {
        const date = new Date(inputDateTime);
        date.setHours(date.getHours());
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const formattedResult = `${hours}h${minutes < 10 ? '0' : ''}${minutes} - ${day} tháng ${month}, ${year}`;
        return formattedResult;
      }

    return (
        <div className="w-full mt-[92px] xl:max-w-screen-lg min-h-[680px]">
            {
                thongTinBookingSuccess && thongTinBookingSuccess.paymentTransactions && thongTinBookingSuccess.paymentTransactions.length > 0
                ? (
                    <h1 className="w-full py-4 font-bold text-3xl text-blue-600 text-center">Thanh toán thành công</h1>
                )
                : (
                    <h1 className="w-full py-4 font-bold text-3xl text-blue-600 text-center">Giữ chỗ thành công</h1>
                )
            }

            {/* Đặt vé thành công */}
            {
                thongTinBookingSuccess && thongTinBookingSuccess.paymentTransactions && thongTinBookingSuccess.paymentTransactions.length > 0
                ? (
                    <div className="bg-gray-100 rounded-sm md:rounded-md p-2 pl-2">
                    <span className="text-lg text-gray-800 font-semibold">
                        Thời gian xuất vé:
                    </span>
                    <p>
                        {formatDateTime(thongTinBookingSuccess.paymentTransactions[0].paymentTime)}
                    </p>
                    </div>
                )
                : null
            }

            {/* PNR */}
            <div className="bg-gray-100 rounded-sm md:rounded-md p-2 mt-2 mb-2">
                <h2 className="text-lg text-gray-800 font-semibold">
                    Mã đặt chỗ: <span className="font-bold text-xl text-blue-500 px-2">{thongTinBookingSuccess.locator}</span>
                </h2>
            </div>

            {/* Thông tin chuyến đi */}
            <div className="bg-gray-100 rounded-sm md:rounded-md p-2">
                <h2 className="text-gray-800 font-bold text-lg px-2">Thông tin chuyến bay:</h2>
                {
                    thongTinBookingSuccess?.journeys && thongTinBookingSuccess.journeys.length > 0 && thongTinBookingSuccess.journeys[0]
                    ? 
                        <div className="mt-2 bg-white p-2 rounded-sm md:rounded-md flex flex-wrap justify-between lg:justify-start">
                            <div className="sm:w-1/2 w-full pb-2 sm:pb-0">
                                <h2>Chuyến bay đi: </h2>
                                <h2 className="flex sm:justify-start justify-between items-center text-md font-bold sm:w-full text-blue-500">
                                    <span>
                                        {`${thongTinBookingSuccess?.journeys[0].segments[0].departure.airport.name} 
                                        (${thongTinBookingSuccess?.journeys[0].segments[0].departure.airport.code})`}
                                    </span>
                                    <div className="mx-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                        </svg>
                                    </div>
                                    <span>
                                        {`${thongTinBookingSuccess?.journeys[0].segments[0].arrival.airport.name}
                                        (${thongTinBookingSuccess?.journeys[0].segments[0].arrival.airport.code})`}
                                    </span>
                                </h2>
                                <h2 className="flex mt-2 items-center text-md font-medium w-full text-gray-600">
                                    <span>Vietjet Air</span>
                                    <span className="ml-3">{`${thongTinBookingSuccess?.journeys[0].segments[0].flight.airlineCode.code}
                                                            ${thongTinBookingSuccess?.journeys[0].segments[0].flight.flightNumber}`}</span>
                                </h2>
                                <h2 className="flex mt-2 items-center text-md font-medium w-full text-gray-600">
                                    <span>Máy bay</span>
                                    <span className="ml-3">Airbus {thongTinBookingSuccess?.journeys[0].segments[0].flight.aircraftModel.name}</span>
                                </h2>
                            </div>
                            <div className="w-full sm:w-1/2 ml-0 text-md pt-2 border-t border-gray-300 sm:border-none sm:pt-0">
                                <ul className="flex justify-between items-center">
                                    <li className="font-semibold w-28 text-end">{thongTinBookingSuccess?.journeys[0].segments[0].departure.localScheduledTime.split(" ")[1].slice(0,5)}</li>
                                    <li className="mx-6 text-sm text-gray-600 border-b border-gray-500">{thoiGianBay(thongTinBookingSuccess?.journeys[0].segments[0].departure.localScheduledTime, thongTinBookingSuccess?.journeys[0].segments[0].arrival.localScheduledTime)}</li>
                                    <li className="font-semibold w-28 text-start">{thongTinBookingSuccess?.journeys[0].segments[0].arrival.localScheduledTime.split(" ")[1].slice(0,5)}</li>
                                </ul>
                                <ul className="flex justify-between items-center">
                                    <li className="text-gray-600 w-28 text-end">{thongTinBookingSuccess?.journeys[0].segments[0].departure.airport.code}</li>
                                    <li className="mx-6 text-sm text-gray-600">Bay thẳng</li>
                                    <li className="text-gray-600 w-28 text-start">{thongTinBookingSuccess?.journeys[0].segments[0].arrival.airport.code}</li>
                                </ul>
                                <ul className="flex justify-between items-center">
                                    <li className="text-gray-600 w-28 text-end">{thongTinBookingSuccess?.journeys[0].segments[0].departure.localScheduledTime.split(" ")[0]}</li>
                                    <li className="h-6"></li>
                                    <li className="text-gray-600 w-28 text-start">{thongTinBookingSuccess?.journeys[0].segments[0].arrival.localScheduledTime.split(" ")[0]}</li>
                                </ul>
                            </div>
                        </div>
                    :
                        <></>
                }
                {
                    thongTinBookingSuccess?.journeys && thongTinBookingSuccess.journeys.length > 1 && thongTinBookingSuccess.journeys[1]
                    ? 
                        <div className="mt-2 bg-white p-2 rounded-sm md:rounded-md flex flex-wrap justify-between lg:justify-start">
                            <div className="sm:w-1/2 w-full pb-2 sm:pb-0">
                                <h2>Chuyến bay về: </h2>
                                <h2 className="flex sm:justify-start justify-between items-center text-md font-bold sm:w-full text-blue-500">
                                    <span>
                                        {`${thongTinBookingSuccess?.journeys[1].segments[0].departure.airport.name} 
                                        (${thongTinBookingSuccess?.journeys[1].segments[0].departure.airport.code})`}
                                    </span>
                                    <div className="mx-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                        </svg>
                                    </div>
                                    <span>
                                        {`${thongTinBookingSuccess?.journeys[1].segments[0].arrival.airport.name}
                                        (${thongTinBookingSuccess?.journeys[1].segments[0].arrival.airport.code})`}
                                    </span>
                                </h2>
                                <h2 className="flex mt-2 items-center text-md font-medium w-full text-gray-600">
                                    <span>Vietjet Air</span>
                                    <span className="ml-3">{`${thongTinBookingSuccess?.journeys[1].segments[0].flight.airlineCode.code}
                                                            ${thongTinBookingSuccess?.journeys[1].segments[0].flight.flightNumber}`}</span>
                                </h2>
                                <h2 className="flex mt-2 items-center text-md font-medium w-full text-gray-600">
                                    <span>Máy bay</span>
                                    <span className="ml-3">Airbus {thongTinBookingSuccess?.journeys[1].segments[0].flight.aircraftModel.name}</span>
                                </h2>
                            </div>
                            <div className="w-full sm:w-1/2 ml-0 text-md pt-2 border-t border-gray-300 sm:border-none sm:pt-0">
                                <ul className="flex justify-between items-center">
                                    <li className="font-semibold w-28 text-end">{thongTinBookingSuccess?.journeys[1].segments[0].departure.localScheduledTime.split(" ")[1].slice(0,5)}</li>
                                    <li className="mx-6 text-sm text-gray-600 border-b border-gray-500">{thoiGianBay(thongTinBookingSuccess?.journeys[1].segments[0].departure.localScheduledTime, thongTinBookingSuccess?.journeys[1].segments[0].arrival.localScheduledTime)}</li>
                                    <li className="font-semibold w-28 text-start">{thongTinBookingSuccess?.journeys[1].segments[0].arrival.localScheduledTime.split(" ")[1].slice(0,5)}</li>
                                </ul>
                                <ul className="flex justify-between items-center">
                                    <li className="text-gray-600 w-28 text-end">{thongTinBookingSuccess?.journeys[1].segments[0].departure.airport.code}</li>
                                    <li className="mx-6 text-sm text-gray-600">Bay thẳng</li>
                                    <li className="text-gray-600 w-28 text-start">{thongTinBookingSuccess?.journeys[1].segments[0].arrival.airport.code}</li>
                                </ul>
                                <ul className="flex justify-between items-center">
                                    <li className="text-gray-600 w-28 text-end">{thongTinBookingSuccess?.journeys[1].segments[0].departure.localScheduledTime.split(" ")[0]}</li>
                                    <li className="h-6"></li>
                                    <li className="text-gray-600 w-28 text-start">{thongTinBookingSuccess?.journeys[1].segments[0].arrival.localScheduledTime.split(" ")[0]}</li>
                                </ul>
                            </div>
                        </div>
                    :
                        <></>
                }
            </div>

            {/* Thông tin hành khách */}
            <div className="bg-gray-100 rounded-sm md:rounded-md mt-4 p-2">
                <h2 className="text-gray-800 font-bold text-lg px-2">
                    Thông tin hành khách:
                </h2>
                <div className="w-full bg-white p-2 rounded-sm md:rounded-md">
                {
                    danhSachHanhKhach ?
                    danhSachHanhKhach.map((item:any, index:number)=>(
                        <div key={index} className="text-base font-medium text-gray-600 pb-2">
                            <p>
                                {item.reservationProfile.gender === "Male" ? "Ông" : "Bà"}, 
                                <span className="ml-2 text-gray-700">
                                    {item.reservationProfile.firstName + " " + item.reservationProfile.lastName}
                                </span>
                            </p>

                            {
                                item.infants[0]
                                ?
                                    <p className="pl-4 ">
                                        Đi cùng: 
                                        <span className="ml-2 text-gray-700">
                                            Bé, {item.infants[0].reservationProfile.firstName + " " + item.infants[0].reservationProfile.lastName}
                                        </span>
                                    </p>
                                :
                                    <></>
                            }
                        </div>
                        ))
                        :
                        <></>
                    }
                </div>
            </div>

            <div className="bg-gray-100 p-2 mt-2 rounded-md sm:rounded-sm flex justify-end">
                <button onClick={tiepTucDatVe} className="bg-blue-500 py-2 px-4 rounded text-white font-bold">
                    Tiếp tục đặt vé
                </button>
            </div>

        </div>
    )
}

export default BookingSuccess 