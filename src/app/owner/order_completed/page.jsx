"use client";

import React, { useEffect, useState } from "react";
import Navbar from '../../components/Navbar'
import Link from "next/link"

export default function OrderCompleted() {
    const [orders, setOrders] = useState([]);
    useEffect(() => {
        fetch("/data/orders.json")
            .then((res) => {
            if (!res.ok) throw new Error("Network response was not ok");
            return res.text();
            })
            .then((text) => {
            const data = text ? JSON.parse(text) : [];
            const completedOrders = data.filter(order => order.OrderStatus.toLowerCase() === "complete");
            setOrders(completedOrders);
            })
            .catch((err) => console.error("Failed to load orders:", err));
        }, []);
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = String(date.getFullYear()).slice(-2);
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${day}/${month}/${year}  |  เวลา: ${hours}:${minutes}`;
    };
    return (
        <div className="min-h-screen">
            <Navbar activePage="order" />
            <div className="pt-6 pl-6 pr-6">
                <div className="mb-4 mt-[180px] pl-[80px] pr-[80px] flex">
                    <Link href="/owner/order" className="w-[400px] h-[80px] p-5 rounded-sm bg-[#FFE7A1] flex items-center text-[#000000] cursor-pointer">
                        <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        height="48px" 
                        viewBox="0 -960 960 960" 
                        width="48px" 
                        fill="#000000">
                        <path d="M352.82-310Q312-310 284-338.18q-28-28.19-28-69Q256-448 284.18-476q28.19-28 69-28Q394-504 422-475.82q28 28.19 28 69Q450-366 421.82-338q-28.19 28-69 28ZM180-80q-24 0-42-18t-18-42v-620q0-24 18-42t42-18h65v-60h65v60h340v-60h65v60h65q24 0 42 18t18 42v620q0 24-18 42t-42 18H180Zm0-60h600v-430H180v430Zm0-490h600v-130H180v130Zm0 0v-130 130Z"/></svg>
                        <span className="font-bold text-[30px] m-5">คำสั่งซื้อจากลูกค้า</span>
                    </Link>
                    <Link href="/owner/order_completed" className="ml-auto bg-[#0FA958] w-[340px] h-[80px] text-white px-5 py-2 rounded-lg flex items-center cursor-pointer">
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
            <div className="bg-[#FFFFFF] m-8">
                <div className="p-5 flex flex-col">
                    <div className="flex justify-start items-center mb-6">
                        <h2 className="text-[#D64545] font-bold text-[28px] ml-2">
                            ประวัติการสั่งซื้อที่เสร็จสิ้น
                        </h2>
                    </div>
                    {orders.length > 0 ? (
                        <div className="overflow-x-auto flex justify-center mb-10">
                            <table className="border-collapse w-[80%] text-center text-black">
                                <thead>
                                    <tr className="bg-[#F79C4B] text-white">
                                    <th className="border border-black px-1 py-2">หมายเลขออเดอร์</th>
                                    <th className="border border-black px-4 py-2">วันที่ | เวลา</th>
                                    <th className="border border-black px-4 py-2">โต๊ะ</th>
                                    <th className="border border-black px-4 py-2">รายการ</th>
                                    <th className="border border-black px-4 py-2">ยอดรวม</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order, index) => (
                                        <tr key={index} className="bg-white">
                                            <td className="border border-black px-4 py-2">{order.OrderID}</td>
                                            <td className="border border-black px-4 py-2">{formatDate(order.OrderDateTime)}</td>
                                            <td className="border border-black px-4 py-2">{order.TableNumber}</td>
                                            <td className="border border-black px-4 py-2">
                                                {order.OrderDescription.map((item, idx) => (
                                                    <div key={idx} className="flex justify-start p-2">
                                                        {item.Quantity}x {item.MenuName}{item.Type  ? `${item.Type }` : ""}
                                                    </div>
                                                ))}
                                            </td>
                                            <td className="border border-black px-4 py-2">{order.Total} บาท</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 mt-10">ไม่มีข้อมูลคำสั่งซื้อ</p>
                    )}
                </div>
            </div>
        </div>
    )
}