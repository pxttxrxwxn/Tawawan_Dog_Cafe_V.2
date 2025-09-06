"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbarincome_and_expenses";

export default function Income() {
    const [orders, setOrders] = useState([]);
    useEffect(() => {
    
        fetch("/data/Income.json")
          .then((res) => res.json())
          .then((data) => setOrders(data))
          .catch((err) => console.error(err));
      }, []);
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = String(date.getFullYear()).slice(-2);
        return `${day}/${month}/${year}`;
    };
  return (
    <div className="min-h-screen">

      <Navbar activePage="income" />
      
      <div className="pt-[200px] px-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <svg 
            xmlns="http://www.w3.org/2000/svg" 
            height="24px" 
            viewBox="0 -960 960 960" 
            width="24px" 
            fill="#000000">
              <path d="m136-240-56-56 296-298 160 160 208-206H640v-80h240v240h-80v-104L536-320 376-480 136-240Z"/></svg>
            <h2 className="text-[#D64545] font-bold text-xl">
              รายรับ
            </h2>
          </div>

          <div className="flex justify-end mb-4">
            <div className="flex items-center gap-8">
              <span className="font-medium text-[#000000]">ดูสรุป :</span>
              <select className="border rounded-md px-3 py-1 shadow-sm bg-white text-[#000000]">
                <option>ทั้งหมด</option>
                <option>วันนี้</option>
                <option>สัปดาห์นี้</option>
                <option>เดือนนี้</option>
              </select>
            </div>
          </div>
        </div>

        {orders.length > 0 ? (
          <div className="overflow-x-auto flex justify-center">
            <table className="border-collapse w-[80%] text-center text-black">
              <thead>
                <tr className="bg-[#F79C4B] text-white">
                  <th className="border border-black px-4 py-2 ">หมายเลขออเดอร์</th>
                  <th className="border border-black px-4 py-2">วันที่ | เวลา</th>
                  <th className="border border-black px-4 py-2 ">โต๊ะ</th>
                  <th className="border border-black px-4 py-2">รายละเอียด</th>
                  <th className="border border-black px-4 py-2 ">จำนวนเงิน</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={index} className="bg-[#FFE8A3]">
                    <td className="border border-black px-4 py-2 text-center">
                      {order.ordernumber}
                    </td>
                    <td className="border border-black px-4 py-2 text-center">
                      {formatDate(order.date)} | เวลา: {order.time}
                    </td>
                    <td className="border border-black px-4 py-2">
                      {order.tableNumber}
                    </td>
                    <td className="border border-black px-4 py-2 text-center">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-start p-2">
                          {item.quantity}x {item.name}{item.type ? `${item.type}` : ""}
                        </div>
                      ))}
                    </td>
                    <td className="border border-black px-4 py-2">{order.total} บาท</td>
                  </tr>
                  ))}
              </tbody>
            </table>
          </div>
          ) : (
            <p className="text-center text-gray-500 mt-10">ไม่มีข้อมูลรายรับ</p>
        )}
      </div>
    </div>
  );
}
