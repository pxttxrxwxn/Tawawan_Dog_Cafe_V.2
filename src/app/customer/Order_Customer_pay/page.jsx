"use client";
import React, { useEffect, useState } from "react";
import PromptPayQR from "../../components/PromptPayQR";
import Nabarorder from "../../components/Navbarorder";
import Link from "next/link";

export default function Order_Customer() {
  const [orders, setOrders] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [tableNumber, setTableNumber] = useState("");

  useEffect(() => {
    const selectedTable = localStorage.getItem("selectedTable");
    if (selectedTable) setTableNumber(selectedTable);

    import("/data/order.json").then((data) => {
      setOrders(data.default || data);
    });
  }, []);

  useEffect(() => {
    const total = orders.reduce((sum, item) => sum + item.totalPrice, 0);
    setTotalAmount(total);
  }, [orders]);

  const handleRemoveAll = async () => {
    try {
      const res = await fetch("/api/order", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true, tableNumber }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders([]);
        setTotalAmount(0);
      }
    } catch (error) {
      console.error("Failed to remove all items:", error);
    }
  };

  return (
    <div className="">
      <Nabarorder activePage="2" />
      <div className="mt-[187px]">
        <PromptPayQR />
      </div>
      <div className="bg-white flex justify-end items-center fixed bottom-0 left-0 w-full p-4 h-[100px] shadow-md gap-4">
        <h1 className="flex justify-between items-center text-black">
          รวม ({orders.length} รายการ):
        </h1>
        <span className="text-[#D64545] font-bold">{totalAmount} ฿</span>
        <Link href="/customer/Completed_Order">
          <button
            className={`px-4 py-2 rounded-md text-3xl mr-6 text-white ${
              orders.length > 0
                ? "bg-[#F79C4B] cursor-pointer"
                : "bg-[#DDDDDD] cursor-not-allowed"
            }`}
            disabled={orders.length === 0}
            onClick={handleRemoveAll}
          >
            สั่งสินค้า
          </button>
        </Link>
      </div>
    </div>
  );
}