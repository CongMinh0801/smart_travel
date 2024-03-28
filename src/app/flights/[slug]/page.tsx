'use client';

import FligtPageDetail from '@/components/flight-page-detail/detail';
import { RootState } from '@/app/GlobalRedux/store';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import FlightPagePaymentMethod from '@/components/flight-page-payment/payment';


const FligtPage = () => {
    // const chuyenBayDi = useSelector((state: RootState) => state.flights.chuyenBayDi)
    // const chuyenBayVe = useSelector((state: RootState) => state.flights.chuyenBayVe)
    const [chuyenDiFareOptions, setChuyenDiFareOptions] = useState<number>(0);
    const [chuyenVeFareOptions, setChuyenVeFareOptions] = useState<number>(0);
    let chuyenBayDi;
    let chuyenBayVe;

    if (typeof window !== 'undefined') {
        chuyenBayDi = JSON.parse(sessionStorage.getItem('chuyenBayDi') as string);
        chuyenBayVe = JSON.parse(sessionStorage.getItem('chuyenBayVe') as string);
    } else {
        chuyenBayDi = {};
        chuyenBayVe = {};
    }
    const router = useRouter();

    return (
        <div className="w-full mt-[92px] xl:max-w-screen-lg">
            <FligtPageDetail
                router={router}
                chuyenBayDi={chuyenBayDi}
                chuyenBayVe={chuyenBayVe}
                chuyenDiFareOptions={chuyenDiFareOptions}
                chuyenVeFareOptions={chuyenVeFareOptions}
                setChuyenDiFareOptions={setChuyenDiFareOptions}
                setChuyenVeFareOptions={setChuyenVeFareOptions}
            />
        </div>
    )
}

export default FligtPage;
