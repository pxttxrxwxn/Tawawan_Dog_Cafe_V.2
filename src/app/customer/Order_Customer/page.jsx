"use client";
import React from "react";
import Nabarorder from "../../components/Navbarorder";
import Link from "next/link";

export default function Order_Customer() {
    return (
        <div className="min-h-screen flex flex-col">
            <Nabarorder activePage="1" />
            <div className="pt-[220px] px-30">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-[#D64545] font-bold text-[36px] font-c">
                        ตะกร้าของฉัน
                    </h2>
                    <Link href={"/customer/list_food"} className="text-[#000000] underline text-[24px]">
                        เพิ่มรายการ
                    </Link>
                </div>
            </div>
            <div className="bg-white flex justify-end items-center fixed bottom-0 left-0 w-full p-4  h-[100px] shadow-md gap-2">
                <h1 className="flex justify-between items-center text-black">
                    รวม (0 รายการ):  
                </h1>
                <span className="text-[#D64545] font-bold">0 ฿</span>
                <button className="bg-[#F4A261] text-white px-4 py-2 rounded-md text-3xl mr-6">
                    สั่งสินค้า
                </button>
            </div>
        </div>
    );
}