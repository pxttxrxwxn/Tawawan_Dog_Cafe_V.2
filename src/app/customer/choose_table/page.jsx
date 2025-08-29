"use client";  // ต้องใส่ไว้บรรทัดแรกเสมอ

import React from 'react'
import Image from 'next/image'
import Link from "next/link"

export default function ChooseTable() {
    const handleSelectTable = (tableNumber) => {
        localStorage.setItem("selectedTable", tableNumber);
    };

    return (
        <div className="min-h-screen bg-[#fdf6e3] flex">
            <div className="flex justify-start mt-[35px] ml-[20px]">
                <div>
                    <Image src="/logo.png" alt="Logo" width={180} height={170} />
                </div>
                <div className='ml-[50px] mt-[30px]'>
                    <div className='flex justify-center w-[925px] bg-[#FFE8A3] rounded-2xl'>
                        <div className='mt-[50px] mb-[50px]'>
                            <p className='text-[40px] text-[#D64545]'>
                                โปรดเลือกหมายเลขโต๊ะที่ต้องการก่อนดำเนินการต่อ
                            </p>

                            <div className='flex flex-row justify-center gap-[150px] mt-[80px]'>
                                <Link
                                    href="/customer/list_food"
                                    onClick={() => handleSelectTable(1)}
                                    className='flex flex-col justify-center items-center w-[150px] h-[150px] rounded-sm bg-white text-4xl text-[#000000]'>
                                    <span>โต๊ะ</span>
                                    <span>1</span>
                                </Link>
                                <Link
                                    href="/customer/list_food"
                                    onClick={() => handleSelectTable(2)}
                                    className='flex flex-col justify-center items-center w-[150px] h-[150px] rounded-sm bg-white text-4xl text-[#000000]'>
                                    <span>โต๊ะ</span>
                                    <span>2</span>
                                </Link>
                                <Link
                                    href="/customer/list_food"
                                    onClick={() => handleSelectTable(3)}
                                    className='flex flex-col justify-center items-center w-[150px] h-[150px] rounded-sm bg-white text-4xl text-[#000000]'>
                                    <span>โต๊ะ</span>
                                    <span>3</span>
                                </Link>
                            </div>

                            <div className='flex flex-row justify-center gap-[150px] mt-[150px]'>
                                <Link
                                    href="/customer/list_food"
                                    onClick={() => handleSelectTable(4)}
                                    className='flex flex-col justify-center items-center w-[150px] h-[150px] rounded-sm bg-white text-4xl text-[#000000]'>
                                    <span>โต๊ะ</span>
                                    <span>4</span>
                                </Link>
                                <Link
                                    href="/customer/list_food"
                                    onClick={() => handleSelectTable(5)}
                                    className='flex flex-col justify-center items-center w-[150px] h-[150px] rounded-sm bg-white text-4xl text-[#000000]'>
                                    <span>โต๊ะ</span>
                                    <span>5</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
