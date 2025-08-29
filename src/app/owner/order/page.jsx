import React from 'react'
import Navbar from '../../components/Navbar'
import Link from "next/link"

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ml-[60px] mt-[50px]">
          {orders.map((order) => (
            <div key={order.id} className="bg-white w-[388px] h-[467px] p-4 rounded-lg shadow">
              <div className="flex justify-between mb-2">
                <div className="flex flex-wrap">
                  <div className="flex items-center text-[32px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg" 
                      height="35px"
                      viewBox="0 -960 960 960"
                      width="31px"
                      fill="#000000"
                      className="mr-2">
                      <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h167q11-35 43-57.5t70-22.5q40 0 71.5 22.5T594-840h166q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560h-80v120H280v-120h-80v560Zm280-560q17 0 28.5-11.5T520-800q0-17-11.5-28.5T480-840q-17 0-28.5 11.5T440-800q0 17 11.5 28.5T480-760Z"/>
                    </svg>
                    <span>ออเดอร์ #{order.id}</span>
                    <p className="text-[30px] ml-[30px] mt-2">โต๊ะ: {order.table}</p>
                  </div>

                  <p className="text-sm text-black w-full ml-9">
                    {order.date} | เวลา: {order.time}
                  </p>

                </div>
              </div>

              <hr className="my-2 ml-[-16px] text-gray-300 w-[388px]"/>

              <div>
                <p className="font-semibold text-[40px] text-[#000000]">รายการ</p>
                {order.items.map((item, index) => (
                  <p className='ml-5 text-[#000000]' key={index}>{item}</p>
                ))}
              </div>
              <hr className="my-2 ml-3 text-gray-300 w-[320px]"/>
              <div className="mt-[185px] flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" 
                  height="24px" 
                  viewBox="0 -960 960 960" 
                  width="24px" 
                  fill="#000000">
                  <path d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-800q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Zm0-360Zm112 168 56-56-128-128v-184h-80v216l152 152ZM224-866l56 56-170 170-56-56 170-170Zm512 0 170 170-56 56-170-170 56-56ZM480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720q-117 0-198.5 81.5T200-440q0 117 81.5 198.5T480-160Z"/>
                </svg>
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
