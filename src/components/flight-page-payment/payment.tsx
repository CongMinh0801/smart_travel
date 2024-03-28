'use client'

import axios from "axios"
import { Dispatch, SetStateAction, useEffect, useState } from "react"

interface PaymentMethod {
    identifier: string,
    description: string,
}

export default function FlightPagePaymentMethod({
    paymentMethod,
    setPaymentMethod,
}:{
    paymentMethod: PaymentMethod,
    setPaymentMethod: Dispatch<SetStateAction<PaymentMethod>>
}) {
    const [method, setMethod] = useState<string>()
    const xuLiPaymentMethod = (value: string) => {
        if(value === "Agency Credit"){
            setPaymentMethod(
                {
                    "identifier": "AG",
                    "description": "Agency Credit"
                }
            )
        }else if (value === "Pay Later"){
            setPaymentMethod(
                {
                    "identifier": "PL",
                    "description": "Pay Later"
                }
            ) 
        }
        setMethod(value)
    }

    const fetchData = async () => {
        try {
                const baseUrl = process.env.BASE_API_URL
                const response = await axios.get(baseUrl + `/Companies`)
            if (!response.data) {
                throw new Error('Failed to fetch data');
            }
        } catch (error: any) {
            console.error('Error fetching data:', error.message);
        }
    };

    useEffect(()=>{

    },[method])

    return (
        <>
            <h2 className="mt-2 ml-2 font-bold">
                Phương thức thanh toán:
            </h2>
            <div className="bg-gray-100 rounded-md p-2">
                <ul>
                    <li className="">
                        <button onClick={() => xuLiPaymentMethod("Pay Later")} className="flex justify-start items-center w-full p-2 rounded hover:bg-blue-100">
                            <input 
                                type="radio" 
                                className="mr-2" 
                                checked={method === "Pay Later" ? true : false} 
                                onChange={() => xuLiPaymentMethod("Pay Later")} 
                                name="payment"/>
                            Thanh toán sau (Giữ chỗ)
                        </button>
                    </li>
                    <li className="mt-2">
                        <button onClick={() => xuLiPaymentMethod("Agency Credit")} className="flex justify-start items-center w-full p-2 rounded hover:bg-blue-100">
                            <input 
                                type="radio" 
                                className="mr-2" 
                                checked={method === "Agency Credit" ? true : false} 
                                onChange={() => xuLiPaymentMethod("Agency Credit")} 
                                name="payment"/>
                            Agency Credit
                        </button>
                    </li>
                </ul>
            </div>
        </>
    )
}