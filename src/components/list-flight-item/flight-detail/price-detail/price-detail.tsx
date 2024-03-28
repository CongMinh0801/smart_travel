import Image from "next/image"

const PriceDetail = ({
    opened,
    nguoiLon,
    treEm,
    emBe,
    tenThanhPhoDi,
    tenThanhPhoDen,
    dataFlight
}:{
    opened: boolean,
    nguoiLon: number | null,
    treEm: number | null,
    emBe: number | null,
    tenThanhPhoDi: string,
    tenThanhPhoDen: string,
    dataFlight: any
}) => {
    let giaNguoiLon = dataFlight.fareOptions[0].priceAdult
    let giaTreEm = dataFlight.fareOptions[0].priceChild
    let giaEmBe = dataFlight.fareOptions[0].priceInfant
    let tongGiaNguoiLon
    let tongGiaTreEm 
    let tongGiaEmBe 
    let tongGia = 0
    if (nguoiLon) {
        tongGiaNguoiLon = nguoiLon * giaNguoiLon
        tongGia += tongGiaNguoiLon
    }
    if (treEm) {
        tongGiaTreEm = treEm * giaTreEm
        tongGia += tongGiaTreEm
    }
    if (emBe) {
        tongGiaEmBe = emBe * giaEmBe
        tongGia += tongGiaEmBe
    }

    return (
        <div className={`${opened ? "block" : "hidden"} mt-2 bg-gray-100 p-2 rounded-md`}>
            <div>
                <p className="text-gray-800 text-base font-bold">Chi tiết giá</p>
                <div className="bg-white mt-2 p-2 shadow-sm border border-gray-100 rounded-md font-semibold">
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                        <div className="text-sm text-gray-500">
                            <p className="text-start mb-2">{`Vé người lớn (x${nguoiLon})`}</p>
                            {treEm != 0 ? <p className="text-start mb-2">{`Vé trẻ em (x${treEm})`}</p> : <p></p>}
                            {emBe != 0 ? <p className="text-start mb-2">{`Vé em bé (x${emBe})`}</p> : <p></p>}
                        </div>
                        <div className="text-sm text-gray-500">
                            <p className="text-end">{tongGiaNguoiLon?.toLocaleString('en-US') + " VND"}</p>
                            {treEm != 0 ? <p className="text-end">{tongGiaTreEm?.toLocaleString('en-US') + " VND"}</p> : <p></p>}
                            {emBe != 0 ? <p className="text-end">{tongGiaEmBe?.toLocaleString('en-US') + " VND"}</p> : <p></p>}
                        </div>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-2">
                        <p className="text-start text-gray-500">Tổng</p>
                        <p className="text-end text-base text-gray-800">{tongGia.toLocaleString('en-US') + " VND"}</p>
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <p className="text-gray-800 text-base font-bold">Giá hành lý</p>
                <p className="text-gray-500 font-semibold text-xs">Xem giá hành lý cho chuyến bay của bạn.</p>
                <div className="bg-white mt-2 p-2 shadow-sm border border-gray-100 rounded-md font-semibold">
                    <div className="flex items-center text-sm">
                        <Image src="/airlines/vietjet_small.webp" alt="Vietjet" width={30} height={30} />
                        <p className="ml-2">
                            Vietjet Air
                        </p>
                    </div>
                    <p className="text-gray-500 text-xs font-normal">{`${tenThanhPhoDi} ---> ${tenThanhPhoDen} - Phổ thông`}</p>
                    <button className="text-blue-500 text-xs font-semibold flex items-center mt-1">
                        <p>Xem giá hành lý</p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 ml-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PriceDetail 