import React from 'react'
import Navbar from '../../components/Navbar'
import TodayIcon from '@mui/icons-material/Today'
import { Alarm, CheckBox, ContentPaste } from '@mui/icons-material'


export default function order() {
  const orders = [
    {
      id: '001',
      table: 2,
      date: '20/07/2025',
      time: '12:34',
      items: ['1x ลาเต้เย็น'],
      status: 'รอดำเนินการ'
    }
  ]
  return (
    <div className="">
      <Navbar activePage="order" />
      <div className="min-h-screen bg-[#fdf6e3]">

      <div className="p-6 ">
        <div className="mb-4 mt-[200px] pl-[80px] pr-[80px] flex">
          <div className="w-[454px] h-[99px] p-5 rounded-sm bg-[#FFE7A1] flex items-center">
            <TodayIcon style={{ fontSize: '55px'}} />
            <span className="font-bold text-[30px] m-5">คำสั่งซื้อจากลูกค้า</span>
          </div>
          <div className="ml-auto bg-[#0FA958] w-[454px] h-[99px] text-white px-5 py-2 rounded-lg flex items-center">
            <CheckBox style={{ fontSize: '55px', color: 'black'}} />
            <span className="font-bold text-[30px] m-5">ออเดอร์เสร็จสิ้น</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ml-[60px] mt-[50px]">
          {orders.map((order) => (
            <div key={order.id} className="bg-white w-[388px] h-[467px] p-4 rounded-lg shadow">
              <div className="flex justify-between mb-2">
                <div className='flex flex-wrap'>
                  <p className="text-[32px]">
                    <ContentPaste style={{ fontSize: '32px'}} /> ออเดอร์ #{order.id}
                    <p className="text-sm text-black">{order.date} | เวลา: {order.time}</p>
                  </p>
                  <p className="text-[30px] ml-[30px] mt-5">โต๊ะ: {order.table}</p>
                </div>
              </div>
              <hr className="my-2 ml-[-16px] text-gray-300 w-[388px]"/>
              <div>
                <p className="font-semibold text-[40px]">รายการ</p>
                {order.items.map((item, index) => (
                  <p className='ml-5' key={index}>{item}</p>
                ))}
              </div>
              <hr className="my-2 ml-3 text-gray-300 w-[320px]"/>
              <div className="mt-[195px] flex items-center">
                <Alarm />
                <p className="font-bold text-[20px] text-[#F4A261] ml-2">
                  สถานะ: <span className="text-[#F4A261] font-bold">{order.status}</span>
                </p>
              </div>
              <div className='flex justify-end'>
                <button className="w-[141px] h-[42px] bg-[#0FA958] text-white text-[15px] px-3 py-1 rounded">
                  ออเดอร์เสร็จสิ้น
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  )
}
