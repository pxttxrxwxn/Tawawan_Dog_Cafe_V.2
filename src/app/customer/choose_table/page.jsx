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
                    <div className='w-[925px] h-[904px] bg-[#FFE8A3] rounded-2xl'>

                    </div>
                </div>
            </div>
        </div>
    )
}
