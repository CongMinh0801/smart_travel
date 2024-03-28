// List Flights Page
'use client';

import Card from '@/components/list-flight-choose-card/card';
import Filter from '@/components/list-flight-filter/filter';
import ListFlightHeader from '@/components/list-flight-header/header';
import Flight from '@/components/list-flight-item/flight';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { use, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
//import { setNguoiLonState, setTreEmState, setEmBeState } from "../GlobalRedux/Features/passenger/passengerSlice";

export default function Flights() {
    const [flights, setFlights] = useState([]);
    const [chonChuyenDi, setChonChuyenDi] = useState();
    const [chuyenDuocChon, setChuyenDuocChon] = useState();
    const [chonChuyenVe, setChonChuyenVe] = useState();
    const [chonChuyen, setChonChuyen] = useState('Chuyến đi');
    const [sortValue, setSortValue] = useState('Giá tăng dần');
    const [ngayDiMoi, setNgayDiMoi] = useState<string>('');
    const [ngayVeMoi, setNgayVeMoi] = useState<string>('');
    const [danhSachChuyenBayVe, setDanhSachChuyenBayVe] = useState([]);
    const [danhSachChuyenBayDi, setDanhSachChuyenBayDi] = useState([]);
    const [fetchSuccess, setFetchSuccess] = useState<boolean>(false);
    let soNguoiLon = useRef<number | null>(null);
    let soTreEm = useRef<number | null>(null);
    let soEmBe = useRef<number | null>(null);
    let sanBayDiRef = useRef<string | null>(null);
    let sanBayDenRef = useRef<string | null>(null);
    let ngayDiRef = useRef<string | null>(null);
    let ngayVeRef = useRef<string | null>(null);
    let khuHoiRef = useRef<boolean | null>(null);
    const shouldFetch = useRef(false);

    const router: AppRouterInstance = useRouter();
    //const dispatch = useDispatch()

    const fetchData = async () => {
        try {
            const queryParams = new URLSearchParams(window.location.search);
            const khuHoi = queryParams.get('khu_hoi') === 'true';
            const sanBayDi = queryParams.get('san_bay_di') || '';
            const sanBayDen = queryParams.get('san_bay_den') || '';
            const ngayDi = queryParams.get('ngay_di') || '';
            const ngayVe = queryParams.get('ngay_ve') || '';
            const nguoiLon = parseInt(queryParams.get('nguoi_lon') || '0', 10);
            const treEm = parseInt(queryParams.get('tre_em') || '0', 10);
            const emBe = parseInt(queryParams.get('em_be') || '0', 10);
            khuHoiRef.current = khuHoi;
            sanBayDiRef.current = sanBayDi;
            sanBayDenRef.current = sanBayDen;
            ngayDiRef.current = ngayDi;
            ngayVeRef.current = ngayVe;
            soNguoiLon.current = nguoiLon;
            soTreEm.current = treEm;
            soEmBe.current = emBe;

            const queryData: {
                cityPair: string;
                departure: string;
                currency: string;
                adultCount: string;
                childCount: string;
                infantCount: string;
            } = {
                cityPair: sanBayDi + '-' + sanBayDen,
                departure: ngayDi,
                currency: 'VND',
                adultCount: nguoiLon.toString(),
                childCount: treEm.toString(),
                infantCount: emBe.toString(),
            };

            const newQueryParams = new URLSearchParams(queryData);
            const baseUrl = process.env.BASE_API_URL;
            const response = await axios.get(baseUrl + `/TravelOptions?${newQueryParams.toString()}`);

            if (response.data) {
                setDanhSachChuyenBayDi(response.data);
                console.log(response.data)
            }

            if (khuHoi) {
                const iQueryData: {
                    cityPair: string;
                    departure: string;
                    currency: string;
                    adultCount: string;
                    childCount: string;
                    infantCount: string;
                } = {
                    cityPair: sanBayDen + '-' + sanBayDi,
                    departure: ngayVe,
                    currency: 'VND',
                    adultCount: nguoiLon.toString(),
                    childCount: treEm.toString(),
                    infantCount: emBe.toString(),
                };
                const iQueryParams = new URLSearchParams(iQueryData);
                const iStartTime = performance.now();
                const iResponse = await axios.get(baseUrl + `/TravelOptions?${iQueryParams.toString()}`);
                const iEndTime = performance.now();
                const elapsedTime = iEndTime - iStartTime;
                if (elapsedTime < 1000) {
                    const delayTime = 1000 - elapsedTime;
                    await new Promise((resolve) => setTimeout(resolve, delayTime));
                }
                if (iResponse.data) {
                    setDanhSachChuyenBayVe(iResponse.data);
                }
            }
            if (!response.data) {
                throw new Error('Failed to fetch data');
            }
            setFetchSuccess(true);
        } catch (error: any) {
            console.error('Error fetching data:', error.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (chuyenDuocChon) {
            if (chonChuyen === 'Chuyến đi') {
                setChonChuyenDi(chuyenDuocChon);
            } else {
                setChonChuyenVe(chuyenDuocChon);
            }
        }
    }, [chuyenDuocChon]);

    useEffect(() => {
        let danhSachChuyenBayCanSapXep;
        if (chonChuyen === 'Chuyến đi') {
            danhSachChuyenBayCanSapXep = danhSachChuyenBayDi;
        } else {
            danhSachChuyenBayCanSapXep = danhSachChuyenBayVe;
        }

        if (sortValue === 'Giá tăng dần') {
            danhSachChuyenBayCanSapXep.sort(
                (a: any, b: any) => a.fareOptions[0].priceAdult - b.fareOptions[0].priceAdult,
            );
            setFlights(danhSachChuyenBayCanSapXep);
        } else if (sortValue === 'Giá giảm dần') {
            danhSachChuyenBayCanSapXep.sort(
                (a: any, b: any) => b.fareOptions[0].priceAdult - a.fareOptions[0].priceAdult,
            );
            setFlights(danhSachChuyenBayCanSapXep);
        } else if (sortValue === 'Thời gian khởi hành') {
        }
    }, [chonChuyen, danhSachChuyenBayDi, danhSachChuyenBayVe, sortValue]);

    useEffect(() => {
        const updateUrlAndRefresh = () => {
            const currentParams = new URLSearchParams(window.location.search);
            const newParams = new URLSearchParams(currentParams.toString());
            if (ngayDiMoi !== '') {
                newParams.set('ngay_di', ngayDiMoi);
                shouldFetch.current = true;
            }
            if (ngayVeMoi !== '') {
                newParams.set('ngay_ve', ngayVeMoi);
                shouldFetch.current = true;
            }
            window.history.replaceState({}, '', `${window.location.pathname}?${newParams.toString()}`);
            if (shouldFetch.current) {
                setFetchSuccess(false);
                fetchData();
            }
        };
        updateUrlAndRefresh();
    }, [ngayDiMoi, ngayVeMoi]);

    return (
        <div
            className={`w-full mt-[92px] xl:max-w-screen-xl ${
                chonChuyenDi || chonChuyenVe ? 'mb-20' : 'mb-12'
            } md:mb-0 grid md:grid-cols-3 grid-cols-1 lg:gap-8 md:gap-4 mb-24`}
        >
            <div className="md:col-span-2 col-span-1 min-h-[640px]">
                <ListFlightHeader
                    sanBayDi={sanBayDiRef.current}
                    sanBayDen={sanBayDenRef.current}
                    ngayDi={ngayDiRef.current}
                    ngayVe={ngayVeRef.current}
                    hanhKhach={(soNguoiLon.current ?? 0) + (soTreEm.current ?? 0) + (soEmBe.current ?? 0)}
                    chonChuyen={chonChuyen}
                    ngayDiMoi={ngayDiMoi}
                    ngayVeMoi={ngayVeMoi}
                    setNgayDiMoi={setNgayDiMoi}
                    setNgayVeMoi={setNgayVeMoi}
                />
                {fetchSuccess ? (
                    flights.length > 0 ? (
                        flights.map((item, index) => (
                            <div key={index}>
                                <Flight
                                    dataFlight={item}
                                    nguoiLon={soNguoiLon.current}
                                    treEm={soTreEm.current}
                                    emBe={soEmBe.current}
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
            <div className="col-span-1">
                <Card
                    khuHoi={khuHoiRef.current}
                    ngayDi={ngayDiRef.current}
                    ngayVe={ngayVeRef.current}
                    sanBayDi={sanBayDiRef.current}
                    sanBayDen={sanBayDenRef.current}
                    chonChuyenDi={chonChuyenDi}
                    setChonChuyenDi={setChonChuyenDi}
                    chonChuyenVe={chonChuyenVe}
                    setChonChuyenVe={setChonChuyenVe}
                    chonChuyen={chonChuyen}
                    router={router}
                    setChonChuyen={setChonChuyen}
                />
                {/* <Filter sortValue={sortValue} setSortValue={setSortValue} /> */}
            </div>
        </div>
    );
}
