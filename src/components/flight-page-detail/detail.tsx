'use client'

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"
import ContactInfo from "./contact-info/contact-info"
import FlightInfo from "./flight-info/flight-info"
import Passenger from "./passenger/passenger"
import { RootState } from "@/app/GlobalRedux/store"
import { useSelector } from "react-redux"
import axios from "axios"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import FlightPagePaymentMethod from "../flight-page-payment/payment"


interface PaymentMethod {
    identifier: string,
    description: string,
}

interface HanhKhach {
    ho: string,
    ten: string,
    ngaySinh: string,
    gioiTinh: string,
    title: string,
    number: number,
    adult: boolean,
    child: boolean
}

const FligtPageDetail = (
    {
        router,
        chuyenBayDi,
        chuyenBayVe,
        chuyenDiFareOptions,
        chuyenVeFareOptions,
        setChuyenDiFareOptions,
        setChuyenVeFareOptions
    }:{
        router: AppRouterInstance,
        chuyenBayDi: any,
        chuyenBayVe: any,
        chuyenDiFareOptions: number,
        chuyenVeFareOptions: number,
        setChuyenDiFareOptions: Dispatch<SetStateAction<any>>,
        setChuyenVeFareOptions: Dispatch<SetStateAction<any>>,
    }) => {

    let nguoiLon = 0
    let treEm = 0
    let emBe = 0
    if (typeof window !== 'undefined') {
        nguoiLon = parseInt(JSON.parse(sessionStorage.getItem("nguoiLon") as string))
        treEm = parseInt(JSON.parse(sessionStorage.getItem("treEm") as string))
        emBe = parseInt(JSON.parse(sessionStorage.getItem("emBe") as string))
    } 
    
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({ identifier: '', description: '' })
    const [contactValue, setContactValue] = useState<any>()
    const [passenger, setPassenger] = useState<any>()
    const [infants, setInfants] = useState<any>()
    const [submit, setSubmit] = useState<boolean>(false)
    const [loading, setLoading] = useState(false)
    const [account, setAccount] = useState<any>()
    const [companyKey, setCompanyKey] = useState<string>()

    let initListNguoiLon: number[] = []
    for (let i = 0; i < emBe; i++){
        initListNguoiLon.push(0)
    }
    const [listNguoiLon, setListNguoiLon] = useState<number[]>(initListNguoiLon)
    // const nguoiLon = useSelector((state: RootState) => state.passenger.nguoiLon)
    // const treEm = useSelector((state: RootState) => state.passenger.treEm)
    // const emBe = useSelector((state: RootState) => state.passenger.emBe)
    const nguoiLonPassengersArray = Array.from({ length: nguoiLon }, (_, index) => index)
    const treEmPassengersArray = Array.from({ length: treEm }, (_, index) => index)
    const emBePassengersArray = Array.from({ length: emBe }, (_, index) => index)


    let giaChuyenBayDi = 0;
    if (chuyenBayDi?.fareOptions?.[chuyenDiFareOptions]) {
        giaChuyenBayDi =
            chuyenBayDi?.fareOptions[chuyenDiFareOptions]?.priceAdult * nguoiLon +
            chuyenBayDi?.fareOptions[0]?.priceChild * treEm +
            chuyenBayDi?.fareOptions[0]?.priceInfant * emBe;
    }

    let giaChuyenBayVe = 0;
    if (chuyenBayVe?.fareOptions?.[chuyenVeFareOptions]) {
        giaChuyenBayVe =
            chuyenBayVe?.fareOptions[chuyenVeFareOptions]?.priceAdult * nguoiLon +
            chuyenBayVe?.fareOptions[0]?.priceChild * treEm +
            chuyenBayVe?.fareOptions[0]?.priceInfant * emBe;
    }

    if(!giaChuyenBayVe) {
        giaChuyenBayVe = 0
    }

    const danhSachHanhKhach = useMemo(() => {
        const newDanhSachHanhKhach = [];
        for (let i = 0; i < nguoiLon + treEm; i++) {
          newDanhSachHanhKhach.push({
            ho: "",
            ten: "",
            ngaySinh: "",
            gioiTinh: "",
            title: "",
            number: 0,
            adult: false,
            child: false,
            infants: {
                ho: "",
                ten: "",
                ngaySinh: "",
                gioiTinh: "",
                title: "",
                number: 0,
                nguoiLon: 0,
            }
          });
        }
        return newDanhSachHanhKhach;
    }, [nguoiLon, treEm, emBe]);

    const danhSachEmBe = useMemo(() => {
        const newDanhSachEmBe = [];
        for (let i = 0; i < emBe; i++) {
          newDanhSachEmBe.push({
            ho: "",
            ten: "",
            ngaySinh: "",
            gioiTinh: "",
            title: "Infant",
            number: 0,
            nguoiLon: 0,
          });
        }
        return newDanhSachEmBe;
    }, [emBe]);

    useEffect(()=>{
        fetchData()
    },[])
    
    useEffect(()=>{
        if(passenger?.type == "Người lớn") {
            danhSachHanhKhach[0 + passenger.number -1] = passenger
        } else if (passenger?.type == "Trẻ em") {
            danhSachHanhKhach[nguoiLon + passenger.number-1] = passenger
        }
        
    },[passenger])

    useEffect(()=>{
        danhSachEmBe[infants?.number - 1] = infants
    },[infants])

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

    const xacNhanDatVe = () => {  
        const body = {
            adult: nguoiLon,
            child: treEm,
            infant: emBe,
            companyKey,
            account,
            journeysBookingCode: chuyenBayVe ? [
                                    chuyenBayDi?.fareOptions[chuyenDiFareOptions].bookingCode.key, 
                                    chuyenBayVe?.fareOptions[chuyenVeFareOptions].bookingCode.key]
                                    : [chuyenBayDi?.fareOptions[chuyenDiFareOptions].bookingCode.key],
            contactValue: contactValue,
            listAdultAndChild: danhSachHanhKhach,
            listInfant: danhSachEmBe,
            paymentMethod: paymentMethod,
            totalAmount: giaChuyenBayDi + giaChuyenBayVe,
        }

        setSubmit(true)

        //Validation
        const hasDuplicates = new Set(listNguoiLon).size !== listNguoiLon.length
        const hasEmptyNguoiLon = listNguoiLon.includes(0)
        const hasEmptyFieldLienHe = Object.values(contactValue).some((value) => value === "");
        const hasEmptyFieldEmBe = danhSachEmBe.some((obj:any) => Object.values(obj).some((value) => value === ""));
        const hasEmptyFieldHanhKhach = danhSachHanhKhach.some((obj:any) => 
            Object.entries(obj).some(([key, value]) => key !== 'ngaySinh' && value === "")
        )
        if(!hasEmptyFieldEmBe && !hasEmptyFieldHanhKhach && !hasEmptyFieldLienHe && !hasDuplicates && !hasEmptyNguoiLon) {
            datVe(body)
        }
    }

    const datVe = async (body:any) => {
        setLoading(true) 
        try {
              const baseUrl = process.env.BASE_API_URL
              const response = await axios.post(baseUrl + `/reservations`,body)
            if(response.data.message) {
                if(response.data.message.includes("Payment attempt failed res validation")) {
                    alert("Phương thức thanh toán sau không hợp lệ")
                } else {
                    alert(response.data.message)
                }
            } else {
                sessionStorage.setItem("bookingSuccess", JSON.stringify(response.data))
                router.push("/flights/booking-success")
            }
    
            if (!response.data) {
                throw new Error('Failed to fetch data');
            }
        } catch (error: any) {
            console.error('Error fetching data:', error.message);
        }
    };

    useEffect(()=>{

    },[paymentMethod])

    return (
        <div className="col-span-2 shadow-md rounded-md p-2 box-border border border-gray-100">
            <h2 className="ml-2 textt-gray-800 font-bold mb-2">Chuyến bay đi:</h2>
            <FlightInfo flightData = {chuyenBayDi}
                fareOption={chuyenDiFareOptions} 
                setFareOptions={setChuyenDiFareOptions}
            />
            {chuyenBayVe?
                <>
                    <h2 className="ml-2 textt-gray-800 font-bold mb-2 mt-4">Chuyến bay về:</h2>
                    <FlightInfo flightData = {chuyenBayVe}
                        fareOption={chuyenVeFareOptions}
                        setFareOptions={setChuyenVeFareOptions}
                    />
                </>
            :
                <></>
            }

            <ContactInfo    submit={submit} 
                            setSubmit={setSubmit} 
                            setContactValue={setContactValue}/>

            <h2 className="ml-2 pt-4 font-bold text-gray-800">Thông tin hành khách:</h2>

            {nguoiLonPassengersArray?.map((item: any, index:number) => (
                <div key={index}>
                    <Passenger
                    listNguoiLon={listNguoiLon}
                    setListNguoiLon={setListNguoiLon} 
                    submit = {submit}
                    setSubmit={setSubmit}
                    setInfants = {setInfants}
                    setPassenger={setPassenger} 
                    passenger={"Người lớn"} 
                    number={index+1}/>
                </div>
            ))}

            {treEmPassengersArray?.map((item: any, index:number) => (
                <div key={index + nguoiLon}>
                    <Passenger
                    listNguoiLon={listNguoiLon}
                    setListNguoiLon={setListNguoiLon} 
                    submit = {submit}
                    setSubmit={setSubmit}
                    setInfants = {setInfants}
                    setPassenger={setPassenger} 
                    passenger={"Trẻ em"} 
                    number={index+1}/>
                </div>
            ))}
            
            {emBePassengersArray?.map((item: any, index:number) => (
                <div key={index + nguoiLon + treEm}>
                    <Passenger
                    listNguoiLon={listNguoiLon}
                    setListNguoiLon={setListNguoiLon} 
                    submit = {submit}
                    setSubmit={setSubmit}
                    setInfants = {setInfants}
                    setPassenger={setPassenger} 
                    passenger={"Em bé"} 
                    number={index+1}/>
                </div>
            ))}

            <FlightPagePaymentMethod
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
            />

            {chuyenBayDi ? 
                <>
                    <div className="p-2 rounded bg-gray-100 mt-4">
                        <div className="flex justify-between">
                            <h2>Tổng giá:</h2>
                            <span className="text-lg text-orange-500 font-bold">{(giaChuyenBayDi + giaChuyenBayVe).toLocaleString('en-US') + "VND"}</span>
                        </div>
                    </div>
                    <div className="w-full flex justify-end mt-2">
                        {
                            !loading
                            ?
                                <button onClick={()=>xacNhanDatVe()} className="bg-blue-500 px-6 py-2 w-32 text-white shadow rounded-md font-bold">
                                    {paymentMethod.identifier === "PL"
                                    ?
                                    "Giữ chỗ"
                                    :
                                    "Đặt vé"}
                                </button>
                            :
                                <button onClick={()=>xacNhanDatVe()} disabled className="bg-blue-500 px-6 py-2 w-32 flex justify-center text-white shadow rounded-md font-bold">
                                    <div role="status" className="w-fit">
                                        <svg aria-hidden="true" className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                        </svg>
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </button>
                        }
                    </div>
                </>
            :
                <>
                    <div className="p-2 rounded bg-gray-300 animate-pulse mt-4">
                        <div className="flex justify-between">
                            <h2 className="w-1/2 h-6 bg-gray-400 rounded"></h2>
                            <span className="w-1/4 h-6 bg-gray-400 rounded"></span>
                        </div>
                    </div>

                    <div className="w-full flex justify-end mt-2">
                        {
                            !loading
                            ?
                                <button onClick={()=>xacNhanDatVe()} className="bg-gray-400 px-6 py-2 text-gray-500 cursor-pointer rounded-md font-bold">
                                    Giữ chỗ
                                </button>
                            :
                                <button onClick={()=>xacNhanDatVe()} disabled className="bg-gray-400 flex justify-center px-6 py-2 text-gray-500 rounded-md font-bold">
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
                </>
            }
        </div>
    )
}

export default FligtPageDetail 