"use client";
import React from "react";
import Navbar from "../../components/Navbarincome_and_expenses";

export default function Income() {
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
                <option>เลือกระยะเวลา</option>
                <option>วันนี้</option>
                <option>สัปดาห์นี้</option>
                <option>เดือนนี้</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto flex justify-center">
          <table className="border-collapse w-[80%] text-center text-black">
            <thead>
              <tr className="bg-[#F79C4B] text-white">
                <th className="border border-black px-4 py-2 ">หมายเลขออเดอร์</th>
                <th className="border border-black px-4 py-2">วันที่ | เวลา</th>
                <th className="border border-black px-4 py-2 ">โต๊ะ</th>
                <th className="border border-black px-4 py-2">รายละเอียด</th>
                <th className="border border-black px-4 py-2 ">จำนวนเงิน</th>
                <th className="border border-black px-4 py-2">จัดการ [บาท]</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black px-4 py-2 text-center">
                  001
                </td>
                <td className="border border-black px-4 py-2 text-center">
                  20/07/2025 |เวลา: 12:34
                </td>
                <td className="border border-black px-4 py-2 text-center">
                  โต๊ะ : 2
                </td>
                <td className="border border-black px-4 py-2 text-center">
                  1x ลาเต้เย็น
                </td>
                <td className="border border-black px-4 py-2 text-center">
                  45 บาท
                </td>
                <td className="border border-black px-4 py-2">
                  <div className="flex justify-center items-center">
                    <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    height="24px" viewBox="0 -960 960 960" 
                    width="24px" 
                    fill="#D64545">
                      <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
