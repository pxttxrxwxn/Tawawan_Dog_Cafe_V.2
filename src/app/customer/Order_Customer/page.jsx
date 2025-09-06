"use client";
import React, { useEffect, useState } from "react";
import Nabarorder from "../../components/Navbarorder";
import Link from "next/link";

export default function Order_Customer() {
  const [orders, setOrders] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/order");
      const data = await res.json();
      setOrders(data);
      const total = data.reduce((sum, item) => sum + item.totalPrice, 0);
      setTotalAmount(total);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 2000);
    return () => clearInterval(interval);
  }, []);

    const updateTotal = (ordersData) => {
    setOrders(ordersData);
    const total = ordersData.reduce((sum, i) => sum + i.totalPrice, 0);
    setTotalAmount(total);
    };

    const handleQuantityChange = async (item, delta) => {
    try {
        let data;
        if (delta < 0) {
        const res = await fetch("/api/order", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            code: item.code,
            type: item.type,
            sugarLevel: item.sugarLevel,
            note: item.note || "",
            }),
        });
        data = await res.json();
        } else {
        const res = await fetch("/api/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...item, quantity: 1 }),
        });
        data = await res.json();
        }

        if (data.success) updateTotal(data.orders);
    } catch (error) {
        console.error("Failed to update quantity:", error);
    }
    };

  const handleRemove = async (item) => {
    try {
      const res = await fetch("/api/order", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: item.code,
          type: item.type,
          sugarLevel: item.sugarLevel,
          note: item.note || "",
          removeAll: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
        const total = data.orders.reduce((sum, i) => sum + i.totalPrice, 0);
        setTotalAmount(total);
      }
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Nabarorder activePage="1" />
      <div className="pt-[220px] px-30">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[#D64545] font-bold text-[36px] font-c">
            ตะกร้าของฉัน
          </h2>
          <Link
            href={"/customer/list_food"}
            className="text-[#000000] underline text-[24px]"
          >
            เพิ่มรายการ
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto flex justify-center mb-10 pb-[130px]">
        {orders.length > 0 ? (
          <table className="border-collapse w-[80%] text-center text-black">
            <thead>
              <tr className="bg-[#F79C4B] text-white">
                <th className="border border-black px-4 py-2">รูปสินค้า</th>
                <th className="border border-black px-4 py-2">ชื่อสินค้า</th>
                <th className="border border-black px-4 py-2">รูปแบบ</th>
                <th className="border border-black px-4 py-2">ระดับความหวาน</th>
                <th className="border border-black px-4 py-2">ราคา</th>
                <th className="border border-black px-4 py-2">จำนวนสินค้า</th>
                <th className="border border-black px-4 py-2">ราคารวม</th>
                <th className="border border-black px-4 py-2">ลบสินค้า</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((item, index) => (
                <tr key={index} className="bg-white">
                  <td className="border border-black px-4 py-2 ">
                    <img src={item.image} alt={item.name} className="w-20 h-20 mx-auto" />
                  </td>
                  <td className="border border-black px-4 py-2">{item.name}</td>
                  <td className="border border-black px-4 py-2">{item.type || "-"}</td>
                  <td className="border border-black px-4 py-2">{item.sugarLevel || "-"}</td>
                  <td className="border border-black px-4 py-2">{item.basePrice} ฿</td>
                  <td className="border border-black px-4 py-2">
                    <button
                        className="text-black px-2 cursor-pointer"
                        onClick={() => handleQuantityChange(item, -1)}
                    >
                        -
                    </button>
                    <span className="px-2">{item.quantity}</span>
                    <button
                        className=" text-black px-2 cursor-pointer"
                        onClick={() => handleQuantityChange(item, 1)}
                    >
                        +
                    </button>
                </td>
                  <td className="border border-black px-4 py-2">{item.totalPrice} ฿</td>
                  <td className="border border-black px-4 py-2">
                    <div className="flex justify-center cursor-pointer">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            height="24px" 
                            viewBox="0 -960 960 960" 
                            width="24px" 
                            fill="#D64545"
                            onClick={() =>handleRemove(item)}>
                            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500 text-xl">ยังไม่มีสินค้าในตะกร้า</p>
        )}
      </div>

        <div className="bg-white flex justify-end items-center fixed bottom-0 left-0 w-full p-4 h-[100px] shadow-md gap-4">
          <h1 className="flex justify-between items-center text-black">
            รวม ({orders.length} รายการ):
          </h1>
          <span className="text-[#D64545] font-bold">{totalAmount} ฿</span>
          <Link href="/customer/Order_Customer_pay">
            <button 
                className={`px-4 py-2 rounded-md text-3xl mr-6 text-white ${
                orders.length > 0 ? "bg-[#F79C4B] cursor-pointer" : "bg-[#DDDDDD] cursor-not-allowed"
                }`}
                disabled={orders.length === 0}
            >
                สั่งสินค้า
            </button>
          </Link>
        </div>
    </div>
  );
}
