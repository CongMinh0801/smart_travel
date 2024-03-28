export default function Footer() {
    return (
        <div className="w-full flex flex-wrap bg-white justify-center items-center mt-2 border-t border-gray-200">
            <div className="block sm:flex justify-between w-full xl:max-w-screen-xl text-xs sm:text-sm py-4 text-gray-500">
                <div className="w-full sm:w-fit text-center">
                    <span className=" underline mr-2">Chính sách bảo mật</span>
                    <span className=" underline ">Điều khoản sử dụng</span>
                </div>
                <div className="w-full sm:w-fit text-center">
                    <span>
                        2024 © Demoo Booking App
                    </span>
                </div>
            </div>
        </div>
    )
}