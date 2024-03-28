'use client'

import { RootState } from "@/app/GlobalRedux/store";
import "./passenger.css"
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Calendar from "react-calendar"
import React from "react";
// import { useSelector } from "react-redux";

type ValuePiece = Date | null ;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const Passenger = (
    {
        passenger,
        number,
        submit,
        listNguoiLon,
        setListNguoiLon,
        setSubmit,
        setPassenger,
        setInfants
    }:{
        passenger: string,
        number: number,
        submit: boolean;
        listNguoiLon: number[],
        setListNguoiLon: Dispatch<SetStateAction<number[]>>,
        setSubmit: Dispatch<SetStateAction<any>>;
        setPassenger: Dispatch<SetStateAction<any>>,
        setInfants: Dispatch<SetStateAction<any>>,
    }) => {
    let soNguoiLon = 0
    if (typeof window !== 'undefined') {
        soNguoiLon = parseInt(JSON.parse(sessionStorage.getItem("nguoiLon") as string))
    } 
    
    const [ngaySinh, setNgaySinh] = useState<Value>();
    const [calendarNgaySinh, setCalendarNgaySinh] = useState<boolean>(false);
    const [gioiTinh, setGioiTinh] = useState<string>("MALE")
    const [nguoiLon, setNguoiLon] = useState<number>(0)
    const [ho, setHo] = useState<string>("")
    const [ten, setTen] = useState<string>("")
    const [hoVaTen, setHoVaTen] = useState<string>("")

    const [listNguoiLonTrong, setListNguoiLonTrong] = useState<string[]>([])
    const [errors, setErrors] = useState<{ [key: string]: string }>({
        hoVaTen: "",
        gioiTinh: "",
        ngaySinh: "",
        nguoiLon: "",
    });
    
    const setHoTen = (value:string) => {
        setHoVaTen(value)
        setHo(value.split(" ")[0])
        const arr = value.split(" ")
        setTen(arr.slice(1).join(" "))
    }

    useEffect(() => {
        if(passenger != "Em bé") {
            setPassenger({
                ho: ho,
                ten: ten,
                ngaySinh: ngaySinh ? formatDateSubmit(ngaySinh) : "",
                gioiTinh: gioiTinh,
                title: gioiTinh == "MALE" ? "Mr" : "Mrs",
                number: number,
                type: passenger,
                adult: passenger == "Người lớn" ? true : false,
                child: passenger == "Trẻ em" ? true : false,
            })
        } else {
            setInfants({
                ho: ho,
                ten: ten,
                ngaySinh: ngaySinh ? formatDateSubmit(ngaySinh) : "",
                gioiTinh: gioiTinh,
                title: gioiTinh == "MALE" ? "Mr" : "Mrs",
                number: number,
                nguoiLon: nguoiLon
            })
        }
    },[ho, ten, ngaySinh, gioiTinh, nguoiLon])

    useEffect(() => {
        if (submit) {
            const newErrors: { [key: string]: string } = {};

            const hoTenRegex = /^[^\d\s]+(\s+[^\d\s]+)+$/;
            if (hoVaTen.trim() === "") {
                newErrors.hoTen = "Họ tên không được trống";
            } else if (!hoTenRegex.test(hoVaTen)) {
                newErrors.hoTen = "Họ tên không hợp lệ";
            }

            if (nguoiLon === 0) {
                newErrors.nguoiLon = "Chọn người lớn đi cùng";
            }
            if (soLuong(listNguoiLon, nguoiLon) > 1 && nguoiLon !== 0) {
                newErrors.nguoiLon = "Mỗi người lớn chỉ đi cùng 1 em bé";
            }

            if (gioiTinh.trim() === "") {
                newErrors.gioiTinh = "Giới tính không được trống";
            }
            
            if (!ngaySinh) {
                newErrors.ngaySinh = "Ngày sinh không được trống";
            }
            setErrors(newErrors);
        }
    }, [submit, hoVaTen, gioiTinh, ngaySinh, nguoiLon]);
    
    useEffect(() => {
        let tempListNguoiLonTrong: string[] = [];
        for (let i = 0; i < soNguoiLon; i++) {
            tempListNguoiLonTrong.push("A" + i);
        }
        setListNguoiLonTrong(tempListNguoiLonTrong);
        const handleClickOutside = (event:any) => {
            const calendarContainer = document.querySelector(`.calendar-container${passenger == "Người lớn" ? "nguoi-lon" + number : 
                                                                                passenger == "Trẻ em" ? "tre-em" + number: "em-be" + number}`);
            if (calendarContainer && !calendarContainer.contains(event.target)) {  
                hideCalendar();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [])

    useEffect(()=>{
        hideCalendar()
    },[ngaySinh])

    function soLuong(arr:number[], a:number) {
        let count = 0;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === a) {
                count++;
            }
        }
        return count;
    }

    const formatDate = (date: Value) => {
        if (date) {
            const listItem = date.toString().split(" ");
            if (Array.isArray(listItem) && listItem.length > 0) {
              const thangTiengViet = ["Tháng Một","Tháng Hai","Tháng Ba","Tháng Tư","Tháng Năm","Tháng Sáu","Tháng Bảy","Tháng Tám","Tháng Chín","Tháng Mười","Tháng Mười Một","Tháng Mười Hai"];
              const thangAbbreviations = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
              return listItem[2] + " " + thangTiengViet[thangAbbreviations.indexOf(listItem[1])] + " " + listItem[3] ;
            }
        }
        return "Invalid Date";
    };

    const formatDateSubmit = (date: Value) => {
        if (date) {
            const listItem = date.toString().split(" ");
            if (Array.isArray(listItem) && listItem.length > 0) {
              const thangAbbreviations = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
              const thang = thangAbbreviations.indexOf(listItem[1]).toString().length == 2 
              ? (thangAbbreviations.indexOf(listItem[1]) + 1).toString() 
              : "0" + (thangAbbreviations.indexOf(listItem[1]) + 1).toString()
              return listItem[3] + "-" + thang + "-" + listItem[2] + " " +  listItem[4] + "Z";
            }
        } 
        return "Invalid Date";
    }

    const xuLiNguoiLon = (value:number) => {
        setNguoiLon(value)
        let tempList = listNguoiLon
        tempList[number-1] = value
        setListNguoiLon(tempList)
    }

    const showCalendar = () => {
        setCalendarNgaySinh(true)
    };
  
    const hideCalendar = () => {
      setCalendarNgaySinh(false)
    }

    const isDateDisabled = ({ date }: any) => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate());
        return date > currentDate;
    };

    return (
        <>
            <div className="bg-gray-100 p-2 rounded-md mt-2">
                <div className="">
                    <div className="flex justify-between items-center">
                        <h3 className="mb-2 font-medium text-gray-800">{`${passenger} ${number}`}</h3>
                        {
                            passenger == "Em bé" 
                            ? 
                                <div>
                                    <select onChange={(e) => xuLiNguoiLon(parseInt(e.target.value))} name="" id="" className="px-2 mb-2 border rounded-sm md:h-8 md:text-base h-6 text-sm w-32">
                                        <option className="text-gray-800" value={0}>{}</option>
                                        {listNguoiLonTrong?.map((item: any, index: number) => (
                                            <option key={index} className="text-gray-800" value={index + 1}>{`Người lớn ${index + 1}`}</option>
                                        ))}
                                    </select>
                                </div>
                            :
                                <></>
                        }
                    </div>
                    <div>
                        {
                            passenger === "Em bé"
                            ?
                                submit && errors.nguoiLon && (
                                    <p className="text-red-500 text-xs w-full text-end">{errors.nguoiLon}</p>
                                )
                            :
                                <></>
                        }
                    </div>
                </div>
                <div className="bg-white p-2 w-full">
                    <div className="w-full flex justify-between items-center mb-3">
                        <div className="w-1/2 pr-2 relative">
                            <h2 className="text-sm font-semibold text-gray-700">Danh xưng:</h2>
                            <select onChange={(e) => setGioiTinh(e.target.value)} name="" id="" className="px-2 border rounded-sm md:h-8 md:text-base h-6 text-sm w-full font-medium">
                                <option className="text-gray-800" value="MALE">Ông</option>
                                <option className="text-gray-800" value="FEMALE">Bà</option>
                            </select>
                            {submit && errors.gioiTinh && (
                                <p className="text-red-500 text-xs mt-1 absolute top-full left-2">{errors.gioiTinh}</p>
                            )}
                        </div>
                        <div className="w-1/2 pl-2 relative">
                            <h2 className="text-sm font-semibold text-gray-700">Họ tên:</h2>
                            <input value={hoVaTen} onChange={(e)=>setHoTen(e.target.value.toUpperCase())} placeholder="VD: Nguyen" type="text" className="px-2 border rounded-sm md:h-8 md:text-base h-6 text-sm w-full font-medium"/>
                            {submit && errors.hoTen && (
                                <p className="text-red-500 text-xs mt-1 absolute top-full left-2">{errors.hoTen}</p>
                            )}
                        </div>
                    </div>
                    {
                        passenger == "Em bé"
                        ?
                            <div className="mt-2 w-1/2 pr-2 mb-3 relative">
                                <h2 className="text-sm font-semibold text-gray-700">Ngày sinh:</h2>
                                <input type="text" 
                                    onClick={showCalendar} 
                                    value={ngaySinh ? formatDate(ngaySinh) : ""} 
                                    onChange={(e) => setNgaySinh(new Date(e.target.value))} 
                                    className="px-2 border rounded-sm md:h-8 md:text-base h-6 text-sm w-full font-medium"/>
                                {submit && errors.ngaySinh && (
                                    <p className="text-red-500 text-xs mt-1 absolute top-full left-0">{errors.ngaySinh}</p>
                                )}
                                <div className={`calendar-container${"em-be" + number} ${calendarNgaySinh ? 'block' : 'hidden'} z-10 absolute top-full`}>
                                    <Calendar tileDisabled={({ date }) => isDateDisabled({ date })}  className="bg-white text-gray-600 mt-2" value={ngaySinh} onChange={setNgaySinh} />
                                </div>
                            </div>
                        :
                            <div></div>
                    }
                </div>
            </div>
        </>
    )
}

export default Passenger 