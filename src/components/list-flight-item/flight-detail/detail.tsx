'use client'

import { useEffect, useState } from "react"
import FlightDetail from "./flight-detail/flight-detail"
import PriceDetail from "./price-detail/price-detail"

const Detail = (
    {
        tagSelected,
        nguoiLon,
        treEm,
        emBe,
        gioKhoiHanh,
        ngayKhoiHanh,
        gioDen,
        ngayDen,
        tenThanhPhoDi,
        tenThanhPhoDen,
        maSanBayDi,
        maSanBayDen,
        thoiGianBay,
        dataFlight
    }:{
        tagSelected: string,
        nguoiLon: number | null,
        treEm: number | null,
        emBe: number | null,
        gioKhoiHanh: string,
        ngayKhoiHanh: string,
        gioDen: string,
        ngayDen: string,
        tenThanhPhoDi: string,
        tenThanhPhoDen: string,
        maSanBayDi: string,
        maSanBayDen: string,
        thoiGianBay: string,
        dataFlight: any
    }
    ) => {
    const [openFlightDetail, setOpenFlightDetail] = useState(false)
    const [openPriceDetail, setOpenPriceDetail] = useState(false)

    useEffect(()=> {
        if(tagSelected == "Chi tiết") {
            setOpenFlightDetail(true)
            setOpenPriceDetail(false)
        }else if (tagSelected == "Giá vé"){
            setOpenFlightDetail(false)
            setOpenPriceDetail(true)
        }else {
            setOpenFlightDetail(false)
            setOpenPriceDetail(false)
        }
    },[tagSelected])
    return (
        <div>
            <FlightDetail 
            gioKhoiHanh={gioKhoiHanh} 
            gioDen={gioDen} 
            ngayKhoiHanh={ngayKhoiHanh}
            ngayDen={ngayDen}
            tenThanhPhoDi={tenThanhPhoDi}
            tenThanhPhoDen={tenThanhPhoDen}
            maSanBayDi = {maSanBayDi}
            maSanBayDen = {maSanBayDen}
            thoiGianBay={thoiGianBay}
            dataFlight={dataFlight} 
            opened={openFlightDetail}/>
            
            <PriceDetail
            nguoiLon={nguoiLon} 
            treEm={treEm} 
            emBe={emBe} 
            tenThanhPhoDi={tenThanhPhoDi}
            tenThanhPhoDen={tenThanhPhoDen}
            dataFlight={dataFlight} 
            opened={openPriceDetail}/>
        </div>
    )
}

export default Detail