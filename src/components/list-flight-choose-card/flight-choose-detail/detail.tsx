
const CardDetail = ({
    chuyenBay,
}:{
    chuyenBay:any,
}) => {
    return (
        <div className="w-full h-12 md:h-fit mt-2 md:pt-2 p-1 md:border-none md:border-t border bg-white flex justify-between text-sm md:text-base">
            <div>
                <div className="flex text-gray-500">
                    <p className="w-10 md:w-16 text-end">{chuyenBay?.flights[0]?.departure.localScheduledTime.split(" ")[1].slice(0,5)}</p>
                    <p className="w-5 md:w-8 flex justify-center">→</p>
                    <p className="w-10 md:w-16 text-start">{chuyenBay?.flights[0]?.arrival.localScheduledTime.split(" ")[1].slice(0,5)}</p>
                </div>
                <div className="flex text-gray-700">
                    <p className="w-10 md:w-16 text-end">{chuyenBay?.flights[0]?.departure.airportCode}</p>
                    <p className="w-5 md:w-8 flex justify-center"></p>
                    <p className="w-10 md:w-16 text-start">{chuyenBay?.flights[0]?.arrival.airportCode}</p>
                </div>
            </div>
            <div className="ml-2 md:ml-0 h-full flex">
                <p className="text-orange-500 text-end">{`${chuyenBay?.fareOptions[0].priceAdult.toLocaleString('en-US')} VND`}</p>
            </div>
        </div>
    )
}

export default CardDetail 