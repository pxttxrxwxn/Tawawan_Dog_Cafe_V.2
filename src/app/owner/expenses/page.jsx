// app/owner/income_and_expenses/page.jsx  (หรือ pages/owner/income_and_expenses/index.jsx ถ้าใช้ pages router)
"use client";
import React from "react";
import Navbar from "../../components/Navbarincome_and_expenses";

export default function Expenses() {
  return (
    <div className="min-h-screen">

      <Navbar activePage="expenses" />
      
      <div className="pt-[200px] px-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <svg 
            xmlns="http://www.w3.org/2000/svg" 
            height="24px" 
            viewBox="0 -960 960 960" 
            width="24px" 
            fill="#000000">
              <path d="M640-240v-80h104L536-526 376-366 80-664l56-56 240 240 160-160 264 264v-104h80v240H640Z"/></svg>
            <h2 className="text-[#D64545] font-bold text-xl">
              รายจ่าย
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
        <div className="flex justify-end mb-4">
          <div className="flex justify-center items-center w-[173px] h-[52px] bg-[#C49A6C] px-2 py-1 rounded-[5px] font-bold gap-1">
            <svg 
            xmlns="http://www.w3.org/2000/svg" 
            height="24px" 
            viewBox="0 -960 960 960" 
            width="24px" 
            fill="#FFFFFF">
              <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
            เพิ่มรายจ่าย

          </div>

        </div>

        <div className="overflow-x-auto flex justify-center">
          <table className="border-collapse w-[80%] text-center text-black">
            <thead>
              <tr className="bg-[#F79C4B] text-white">
                <th className="border border-black px-4 py-2">วันที่</th>
                <th className="border border-black px-4 py-2 ">รายละเอียด</th>
                <th className="border border-black px-4 py-2">จำนวนเงิน</th>
                <th className="border border-black px-4 py-2 ">หมวดหมู่</th>
                <th className="border border-black px-4 py-2">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black px-4 py-2 text-center">
                  20/07/2025
                </td>
                <td className="border border-black px-4 py-2 text-center">
                  จ่ายเงินค่าจ้างพนังงาน
                </td>
                <td className="border border-black px-4 py-2 text-center">
                  <span className="text-[#D64545]">-</span>5000 บาท
                </td>
                <td className="border border-black px-4 py-2 text-center">
                  ค่าแรง
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
