import React from 'react'
import Image from 'next/image'

export default function choose_table() {
    return(
        <div className="min-h-screen bg-[#fdf6e3]">
            <div className="flex justify-start mt-[35px] ml-[20px]">
                <div>
                    <Image src="/logo.png" alt="Logo"
                    width={180} height={170} />
                </div>
                <div className='ml-[50px] mt-[30px]'>
                    <div className='flex justify-center w-[925px] h-[904px] bg-[#FFE8A3] rounded-2xl'>
                        <div className='mt-[80px]'>
                            <p className='text-[40px] text-[#D64545]'>โปรดเลือกหมายเลขโต๊ะที่ต้องการก่อนดำเนินการต่อ</p>

                            <div className='flex flex-row justify-center gap-[150px] mt-[80px]'>
                                <div className='flex flex-col justify-center items-center w-[150px] h-[150px] rounded-sm bg-white text-4xl'>
                                    <span>โต๊ะ</span>
                                    <span>1</span>
                                </div>
                                <div className='flex flex-col justify-center items-center w-[150px] h-[150px] rounded-sm bg-white text-4xl'>
                                    <span>โต๊ะ</span>
                                    <span>2</span>
                                </div>
                                <div className='flex flex-col justify-center items-center w-[150px] h-[150px] rounded-sm bg-white text-4xl'>
                                    <span>โต๊ะ</span>
                                    <span>3</span>
                                </div>
                            </div>
                            <div className='flex flex-row justify-center gap-[150px] mt-[150px]'>
                                <div className='flex flex-col justify-center items-center w-[150px] h-[150px] rounded-sm bg-white text-4xl'>
                                    <span>โต๊ะ</span>
                                    <span>4</span>
                                </div>
                                <div className='flex flex-col justify-center items-center w-[150px] h-[150px] rounded-sm bg-white text-4xl'>
                                    <span>โต๊ะ</span>
                                    <span>5</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
