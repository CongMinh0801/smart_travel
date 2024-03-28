'use client'

import { Dispatch, SetStateAction, useEffect, useState } from "react";

const ContactInfo = ({
    submit,
    setSubmit,
    setContactValue,
}: {
    submit: boolean;
    setSubmit: Dispatch<SetStateAction<any>>;
    setContactValue: Dispatch<SetStateAction<any>>;
}) => {
    const [ho, setHo] = useState<string>("");
    const [ten, setTen] = useState<string>("");
    const [hoVaTen, setHoVaTen] = useState<string>("");
    const [diDong, setDiDong] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({
        ho: "",
        ten: "",
        diDong: "",
        email: "",
    });

    const setHoTen = (value:string) => {
        setHoVaTen(value)
        setHo(value.split(" ")[0])
        const arr = value.split(" ")
        setTen(arr.slice(1).join(" "))
    }

    useEffect(() => {
        const contactValue = {
            ho: ho,
            ten: ten,
            diDong: diDong,
            email: email,
        };
        setContactValue(contactValue);
    }, [ho, ten, diDong, email]);

    useEffect(() => {
        if (submit) {
            const newErrors: { [key: string]: string } = {};

            const hoTenRegex = /^[^\d\s]+(\s+[^\d\s]+)+$/;
            if (hoVaTen.trim() === "") {
                newErrors.hoTen = "Họ tên không được để trống";
            } else if (!hoTenRegex.test(hoVaTen)) {
                newErrors.hoTen = "Họ tên không hợp lệ";
            }

            const diDongRegex = /^\d{10}$/;
            if (diDong.trim() === "") {
                newErrors.diDong = "Di động không được để trống";
            } else if (!diDongRegex.test(diDong)) {
                newErrors.diDong = "Số điện thoại di động không hợp lệ";
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email.trim() === "") {
                newErrors.email = "Email không được để trống";
            } else if (!emailRegex.test(email)) {
                newErrors.email = "Email không hợp lệ";
            }
            setErrors(newErrors);
        }
    }, [submit, hoVaTen, diDong, email]);

    return (
        <>
            <h2 className="ml-2 pt-4 pb-2 font-bold text-gray-800">Thông tin liên hệ:</h2>
            <div className="bg-gray-100 p-2 rounded-md flex">
                <div className="bg-white p-2 w-full">
                    <div className="w-full flex justify-between items-center">
                        <div className="w-1/2 mb-3 relative box-border pr-2">
                            <div className="">
                                <h2 className="text-sm font-semibold text-gray-700">Họ tên:</h2>
                                <input
                                    placeholder="VD: Nguyen Van An"
                                    type="text"
                                    onChange={(e) => setHoTen(e.target.value.toUpperCase())}
                                    value={hoVaTen}
                                    className="px-2 border rounded-sm md:h-8 md:text-base h-6 text-sm font-medium w-full"
                                />
                                {errors.hoTen && (
                                    <p className="text-red-500 mt-1 absolute top-full left-0 text-xs">{errors.hoTen}</p>
                                )}
                            </div>
                        </div>
                        <div className="w-1/2 mb-3 relative box-border pl-2">
                            <div className="">
                                <h2 className="text-sm font-semibold text-gray-700">Di động:</h2>
                                <input
                                    type="text"
                                    onChange={(e) => setDiDong(e.target.value)}
                                    value={diDong}
                                    className="px-2 border rounded-sm md:h-8 md:text-base h-6 text-sm font-medium w-full"
                                />
                                {errors.diDong && (
                                    <p className="text-red-500 mt-1 absolute top-full left-2 text-xs">{errors.diDong}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="w-1/2 mb-3 mt-1 relative box-border pr-2">
                        <div className="">
                            <h2 className="text-sm font-semibold text-gray-700">Email:</h2>
                            <input
                                type="text"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                className="px-2 border rounded-sm md:h-8 md:text-base h-6 text-sm font-medium w-full"
                            />
                            {errors.email && (
                                <p className="text-red-500 mt-1 absolute top-full text-xs">{errors.email}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactInfo;
