'use client'

import axios from "axios";
import { useEffect, useState } from "react";

interface Props {
    sanBay: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    setDanhSachSanBay?: React.Dispatch<React.SetStateAction<any>>
}

const AirportList: React.FC<Props> = ({ sanBay, setValue, setDanhSachSanBay }) => {
    const [listSanBay, setListSanBay] = useState<any[]>([])
    const [searchListSanBay, setSearchListSanBay] = useState<any[]>([])

    const fetchData = async () => {
        try {
                const baseUrl = process.env.BASE_API_URL
                const response = await axios.get(baseUrl + `/Airports`)
                setListSanBay(response.data.sort((a:any, b:any) => a.name.localeCompare(b.name)))
                setSearchListSanBay(response.data.sort((a:any, b:any) => a.name.localeCompare(b.name)))
                if(setDanhSachSanBay){
                    setDanhSachSanBay(response.data.sort((a:any, b:any) => a.name.localeCompare(b.name)))
                }
            if (!response.data) {
                throw new Error('Failed to fetch data');
            }
        } catch (error: any) {
            console.error('Error fetching data:', error.message);
        }
    };

    function removeVietnameseDiacritics(str:string) {
        str = str.toLowerCase();
        const diacriticsMap: { [key: string]: string } = {
            'à': 'a', 'ả': 'a', 'ã': 'a', 'á': 'a', 'ạ': 'a',
            'ă': 'a', 'ằ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ắ': 'a', 'ặ': 'a',
            'â': 'a', 'ầ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ấ': 'a', 'ậ': 'a',
            'è': 'e', 'ẻ': 'e', 'ẽ': 'e', 'é': 'e', 'ẹ': 'e',
            'ê': 'e', 'ề': 'e', 'ể': 'e', 'ễ': 'e', 'ế': 'e', 'ệ': 'e',
            'ì': 'i', 'ỉ': 'i', 'ĩ': 'i', 'í': 'i', 'ị': 'i',
            'ò': 'o', 'ỏ': 'o', 'õ': 'o', 'ó': 'o', 'ọ': 'o',
            'ô': 'o', 'ồ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ố': 'o', 'ộ': 'o',
            'ơ': 'o', 'ờ': 'o', 'ở': 'o', 'ỡ': 'o', 'ớ': 'o', 'ợ': 'o',
            'ù': 'u', 'ủ': 'u', 'ũ': 'u', 'ú': 'u', 'ụ': 'u',
            'ư': 'u', 'ừ': 'u', 'ử': 'u', 'ữ': 'u', 'ứ': 'u', 'ự': 'u',
            'ỳ': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ý': 'y', 'ỵ': 'y',
            'đ': 'd',
        };
        return str.replace(/[àảãáạăằẳẵắặâầẩẫấậèẻẽéẹêềểễếệìỉĩíịòỏõóọôồổỗốộơờởỡớợùủũúụưừửữứựỳỷỹýỵđ]/g, function(match) {
            return diacriticsMap[match];
        });
    }

    useEffect(()=>{
        fetchData()
    },[])
    
    useEffect(()=>{
        setSearchListSanBay(listSanBay.filter(
            (obj) => `${obj.name} (${obj.code})`
                .toLowerCase()
                .includes(
                    removeVietnameseDiacritics(sanBay.toLowerCase())
                )
            )
        )

    },[sanBay])

    return (
        <>
        <h3 className="mb-2 px-2">Thành phố - Sân bay</h3>
            <ul className="max-h-96 overflow-y-auto">
                {
                    searchListSanBay.length > 0 ?
                    searchListSanBay.map((item, index) => (
                        <li key={index} className="h-10 pl-2 hover:cursor-pointer text-gray-600 hover:bg-gray-200">
                            <button className="w-full h-full text-start" onClick={()=>(setValue(`${item.name} (${item.code})`))}>
                                {`${item.name} (${item.code})`}<br/>
                            </button>
                        </li>
                    ))
                    : <div></div>
                }
            </ul>
        </>
    )
}

export default AirportList