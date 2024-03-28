'use client'

import Image from "next/image"
import Detail from "./flight-detail/detail"
import { Dispatch, SetStateAction, useState } from "react"

const Flight = (
    {
        dataFlight,
        nguoiLon,
        treEm,
        emBe,
        chuyenDuocChon,
        setChuyenDuocChon,
    }: {
        dataFlight: any,
        nguoiLon: number | null,
        treEm: number | null,
        emBe: number | null,
        chuyenDuocChon: any,
        setChuyenDuocChon: Dispatch<SetStateAction<any>>,
    }) => {
    const [tagSelected, setTagSelected] = useState<string>("")

    const thoiGianDi = dataFlight.flights[0].departure.localScheduledTime.split(" ")
    const maSanBayDi = dataFlight.flights[0].departure.airportCode
    const tenThanhPhoDi = dataFlight.flights[0].departure.airportName
    const thoiGianDen = dataFlight.flights[0].arrival.localScheduledTime.split(" ")
    const maSanBayDen = dataFlight.flights[0].arrival.airportCode
    const tenThanhPhoDen = dataFlight.flights[0].arrival.airportName

    const tenMayBay = dataFlight.flights[0].aircraftModel.name
    const tongGiaVe1 = dataFlight.fareOptions[0].priceAdult.toLocaleString('en-US')

    const thoiGianBay = (start:string, end:string) => {
        const startTime:Date = new Date(start);
        const endTime:Date = new Date(end);

        const timeDifference = endTime.getTime() - startTime.getTime();

        const hours = Math.floor(timeDifference / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        return `${hours}h${minutes}m`
    }

    const moTagSelected = (value:string) => {
        if(tagSelected == "" || tagSelected != value) {
            setTagSelected(value)
        } else {
            setTagSelected("")
        }
    }

    return (
        <div className="bg-white w-full cursor-pointer rounded-md shadow-md mt-4 p-2 box-border border border-gray-100 hover:border-blue-400 transition-all">
            <div className="flex justify-between flex-wrap">
                <div>
                    <div className="flex justify-start items-center">
                        <Image src="/airlines/vietjet_small.webp" alt="Vietjet" width={30} height={30} />
                        <p className="ml-2">
                            Vietjet Air
                        </p>
                    </div>
                    <div className="flex items-center rounded-full border border-gray-600 px-2 p-py w-fit cursor-pointer hover:bg-gray-100 transition-all">
                        Airbus {tenMayBay}
                    </div>
                </div>

                <div className="flex justify-between">
                    <div>
                        <p className="text-xs"><br /></p>
                        <p className="font-medium">{thoiGianDi[1].slice(0,5)}</p>
                        <p className="text-sm text-gray-600">{maSanBayDi}</p>
                    </div>

                    <div className="mx-2">
                        <p className="text-xs block text-center text-gray-600">{thoiGianBay(thoiGianDi, thoiGianDen)}</p>
                        <p className="text-xs block text-center text-gray-600">{"--->"}</p>
                        <p className="text-xs block text-center text-gray-600">{dataFlight.numberOfChanges == 0 ? "Bay thẳng" : "Nhiều chặng"}</p>
                    </div>

                    <div>
                        <p className="text-xs"><br /></p>
                        <p className="font-medium">{thoiGianDen[1].slice(0,5)}</p>
                        <p className="text-sm text-gray-600">{maSanBayDen}</p>
                    </div>
                </div>

                <div className="md:mt-0 mt-4 ">
                    {/* <p className="text-end text-xs line-through text-gray-600">2.700.000 VND</p> */}
                    <p className="text-end md:text-lg text-base text-orange-500 font-semibold">{tongGiaVe1} VND</p>
                </div>
            </div>

            <div className="flex justify-between items-end mt-2">
                <ul className="text-sm text-gray-600 font-semibold flex justify-between">
                    <li className="mr-4">
                        <button onClick={()=>moTagSelected("Chi tiết")} className={`${tagSelected === "Chi tiết" ? "text-blue-500 border-blue-500" : "text-gray-600 border-transparent"} hover:text-blue-500 hover:border-blue-500 border-b-2 border-white box-border`}>
                            Chi tiết
                        </button>
                    </li>
                    <li className="mr-4">
                        <button onClick={()=>moTagSelected("Giá vé")} className={`${tagSelected === "Giá vé" ? "text-blue-500 border-blue-500" : "text-gray-600 border-transparent"} hover:text-blue-500 hover:border-blue-500 border-b-2 border-white box-border`}>
                            Giá vé
                        </button>
                    </li>
                </ul>

                <button onClick={()=>setChuyenDuocChon(dataFlight)} className="bg-blue-500 box-border border-2 border-blue-500 font-semibold md:py-2 md:px-8 py-1 px-6 rounded-md text-white transition-all hover:bg-white hover:text-blue-500">
                    Chọn
                </button>
            </div> 
            
            <Detail 
            tagSelected={tagSelected} 
            nguoiLon={nguoiLon} 
            treEm={treEm} 
            emBe={emBe}
            gioKhoiHanh={thoiGianDi[1].slice(0,5)} 
            gioDen={thoiGianDen[1].slice(0,5)} 
            ngayKhoiHanh={thoiGianDi[0]}
            ngayDen={thoiGianDen[0]}
            tenThanhPhoDi={tenThanhPhoDi}
            tenThanhPhoDen={tenThanhPhoDen}
            maSanBayDi = {maSanBayDi}
            maSanBayDen = {maSanBayDen}
            thoiGianBay={thoiGianBay(thoiGianDi, thoiGianDen)}
            dataFlight={dataFlight}/>
        </div>
    )
}

export default Flight