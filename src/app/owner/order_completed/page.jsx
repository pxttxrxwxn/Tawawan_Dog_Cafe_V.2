import React from 'react'
import Navbar from '../../components/Navbar'
import Link from "next/link"

export default function oder_completed() {
    return (
        <div className="min-h-screen">
            <Navbar activePage="order" />
            <div className="p-6 ">
                <div className="mb-4 mt-[200px] pl-[80px] pr-[80px] flex">
                    <Link href="/owner/order" className="w-[454px] h-[99px] p-5 rounded-sm bg-[#FFE7A1] flex items-center text-[#000000] cursor-pointer">
                        <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        height="48px" 
                        viewBox="0 -960 960 960" 
                        width="48px" 
                        fill="#000000">
                        <path d="M352.82-310Q312-310 284-338.18q-28-28.19-28-69Q256-448 284.18-476q28.19-28 69-28Q394-504 422-475.82q28 28.19 28 69Q450-366 421.82-338q-28.19 28-69 28ZM180-80q-24 0-42-18t-18-42v-620q0-24 18-42t42-18h65v-60h65v60h340v-60h65v60h65q24 0 42 18t18 42v620q0 24-18 42t-42 18H180Zm0-60h600v-430H180v430Zm0-490h600v-130H180v130Zm0 0v-130 130Z"/></svg>
                        <span className="font-bold text-[30px] m-5">คำสั่งซื้อจากลูกค้า</span>
                    </Link>
                    <Link href="/owner/order_completed" className="ml-auto bg-[#0FA958] w-[454px] h-[99px] text-white px-5 py-2 rounded-lg flex items-center cursor-pointer">
                        <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        height="48px" 
                        viewBox="0 -960 960 960" 
                        width="48px" 
                        fill="#000000">
                        <path d="m419-321 289-290-43-43-246 247-119-119-43 43 162 162ZM180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Z"/></svg>
                        <span className="font-bold text-[30px] m-5">ออเดอร์เสร็จสิ้น</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}