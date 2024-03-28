'use client'

import { Dispatch, SetStateAction, useState } from "react";

const Filter = ({
    sortValue,
    setSortValue
}:{
    sortValue: string,
    setSortValue: Dispatch<SetStateAction<any>>,
}) => {

    const handleSortChange = (name:string) => {
        setSortValue(name);
    };
    return (
        <div className="md:block hidden w-full mt-8 p-2 bg-white shadow-md rounded-md box-border border border-gray-100">
            <h2 className="text-lg font-semibold pb-2 border-b">
                Bộ lọc
            </h2>
            <div className="mt-2">
                Sắp xếp:
                <div className="bg-gray-100 rounded-md p-2">
                    <div className="text-sm text-gray-800 flex items-center p-2 hover:bg-blue-200 justify-start">
                        <input name="group-airline" className="mr-2" type="checkbox" onChange={() => handleSortChange('Giá tăng dần')} checked={sortValue === 'Giá tăng dần'}/>
                        Giá tăng dần
                    </div>
                    <div className="text-sm text-gray-800 flex items-center p-2 hover:bg-blue-200 justify-start">
                        <input name="group-airline" className="mr-2" type="checkbox" onChange={() => handleSortChange('Giá giảm dần')} checked={sortValue === 'Giá giảm dần'}/>
                        Giá giảm dần
                    </div>
                    <div className="text-sm text-gray-800 flex items-center p-2 hover:bg-blue-200 justify-start">
                        <input name="group-airline" className="mr-2" type="checkbox" onChange={() => handleSortChange('Thời gian khởi hành')} checked={sortValue === 'Thời gian khởi hành'}/>
                        Thời gian khởi hành
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Filter 