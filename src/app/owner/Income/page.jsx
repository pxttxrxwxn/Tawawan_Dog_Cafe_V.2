"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbarincome_and_expenses";

export default function Income() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const incomeRes = await fetch("/api/income");
        const incomeData = await incomeRes.json();

        const oiRes = await fetch("/api/order_income");
        const oiData = await oiRes.json();

        const incomeWithOrderNumber = incomeData.map((income) => {
          const oi = oiData.find(
            (oi) => oi.income_id?.trim() === income.income_id?.trim()
          );
          const ordernumber = oi ? oi.order_id.trim() : "-";

          const dateTime = income.order_datetime ? new Date(income.order_datetime) : new Date();

          return {
            ordernumber,
            tableNumber: income.table_number || "-",
            date: dateTime.toISOString(),
            time: dateTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            items: income.order_description?.map((item) => ({
              name: item.MenuName,
              type: item.Type,
              quantity: item.Quantity,
            })) || [],
            total: income.total || 0,
          };
        });

        setOrders(
          incomeWithOrderNumber.sort((a, b) => new Date(b.date) - new Date(a.date))
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  const filterOrders = () => {
    const today = new Date();
    return orders.filter((order) => {
      if (!order.date) return false;
      const orderDate = new Date(order.date);

      if (filter === "today") {
        return (
          orderDate.getDate() === today.getDate() &&
          orderDate.getMonth() === today.getMonth() &&
          orderDate.getFullYear() === today.getFullYear()
        );
      }

      if (filter === "week") {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
        return orderDate >= startOfWeek && orderDate <= endOfWeek;
      }

      if (filter === "month") {
        return (
          orderDate.getMonth() === today.getMonth() &&
          orderDate.getFullYear() === today.getFullYear()
        );
      }

      return true;
    });
  };

  const filteredOrders = filterOrders().sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="min-h-screen">
      <Navbar activePage="income" />
      <div className="pt-[200px] px-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 ml-[10%]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="32px"
              viewBox="0 -960 960 960"
              width="32px"
              fill="#000000"
            >
              <path d="m136-240-56-56 296-298 160 160 208-206H640v-80h240v240h-80v-104L536-320 376-480 136-240Z" />
            </svg>
            <h2 className="text-[#D64545] font-bold text-2xl">รายรับ</h2>
          </div>

          <div className="flex justify-end mb-4">
            <div className="flex items-center gap-2">
              <span className="font-medium text-[#000000] text-[18px]">ดูสรุป :</span>
              <select
                className="border rounded-md px-3 py-1 shadow-sm bg-white text-[#000000]"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">ทั้งหมด</option>
                <option value="today">วันนี้</option>
                <option value="week">สัปดาห์นี้</option>
                <option value="month">เดือนนี้</option>
              </select>
            </div>
          </div>
        </div>

        {orders.length > 0 ? (
          <div className="overflow-x-auto flex justify-center">
            <table className="border-collapse w-[80%] text-center text-black mb-3">
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
                {filteredOrders.map((order, index) => (
                  <tr key={index} className="bg-[#FFE8A3]">
                    <td className="border border-black px-4 py-2 text-center">{order.ordernumber}</td>
                    <td className="border border-black px-4 py-2 text-center">{formatDate(order.date)} | เวลา: {order.time}</td>
                    <td className="border border-black px-4 py-2">{order.tableNumber}</td>
                    <td className="border border-black px-4 py-2 text-center">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-start p-2">
                          {item.quantity}x {item.name}{item.type ? ` ${item.type}` : ""}
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
          <p className="text-center text-2xl font-bold text-[#D64545] mt-[10%]">ไม่มีข้อมูลรายรับ</p>
        )}
      </div>
    </div>
  );
}