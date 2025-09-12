"use client";
import React, { useEffect, useState } from "react";
import PromptPayQR from "../../components/PromptPayQR";
import Nabarorder from "../../components/Navbarorder";
import Link from "next/link";

export default function Order_Customer_pay() {
  const [orders, setOrders] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [tableNumber, setTableNumber] = useState("");

  useEffect(() => {
    const selectedTable = localStorage.getItem("selectedTable");
    if (selectedTable) setTableNumber(selectedTable);

    fetch("/data/cart.json")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Error loading order.json:", err));
  }, []);

  useEffect(() => {
    const total = orders.reduce((sum, item) => sum + item.totalPrice, 0);
    setTotalAmount(total);
  }, [orders]);

  const handleOrder = async () => {
    const customerid = localStorage.getItem("customerid");
    if (!customerid) {
      console.error("customerid not found in localStorage");
      return;
    }

    if (orders.length === 0) {
      console.error("No orders to process");
      return;
    }

    try {
      const res = await fetch("/api/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true, tableNumber, customerid }),
      });

      if (!res.ok) {
        console.error("DELETE request failed with status:", res.status);
        return;
      }
      
      const data = await res.json();
      console.log("DELETE response:", data);

      if (!data.success) {
        console.error("DELETE failed:", data);
        return;
      }

      const notification2 = {
        id: Date.now() + Math.random(),
        svgcheck: `<svg xmlns="http://www.w3.org/2000/svg" height="70px" viewBox="0 -960 960 960" width="70px" fill="#000000"><path d="M480.07-100q-80.07 0-149.44-29.11-69.37-29.12-120.87-80.6-51.51-51.48-80.63-120.82Q100-399.87 100-479.93q0-79.45 29.12-148.82 29.12-69.37 80.61-120.88 51.49-51.5 120.84-80.94Q399.92-860 480-860q70.51 0 131.99 22.66 61.47 22.65 110.78 62.34l-32.23 33q-43.23-35-96.38-53.81-53.14-18.8-114.16-18.8-141.54 0-238.08 96.53-96.53 96.54-96.53 238.08 0 141.54 96.53 238.08 96.54 96.53 238.08 96.53 141.54 0 238.08-96.53 96.53-96.54 96.53-238.08 0-30-4.69-58.23-4.69-28.23-13.69-55l34.46-34.85q14.46 34.31 21.89 71.39Q860-519.61 860-480q0 80.08-29.42 149.43-29.42 69.35-80.9 120.84-51.49 51.49-120.82 80.61Q559.52-100 480.07-100ZM421-311.46 268.69-464.38l33.85-34.23L421-380.15l404.77-404.77 34.84 33.84L421-311.46Z"/></svg>`,
        title2: "การสั่งสินค้าเสร็จสิ้น",
        date: new Date().toLocaleString("th-TH", { hour12: false }),
        svgbincheck: `<svg xmlns="http://www.w3.org/2000/svg" height="35px" viewBox="0 -960 960 960" width="35px" fill="#D64545"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>`,
      };

      const notification1 ={
        id: Date.now() + Math.random(),
        svgpackage: `<svg xmlns="http://www.w3.org/2000/svg" height="70px" viewBox="0 -960 960 960" width="70px" fill="#000000"><path d="M457.31-155.92v-311.31L185.39-624.39V-320q0 3.08 1.53 5.77 1.54 2.69 4.62 4.61l265.77 153.7Zm45.38 0 265.77-153.7q3.08-1.92 4.62-4.61 1.53-2.69 1.53-5.77v-305L502.69-467.23v311.31Zm-51.54 48.61-282.3-163q-13.62-7.61-21.23-21.23-7.62-13.61-7.62-28.85v-319.22q0-15.24 7.62-28.85 7.61-13.62 21.23-21.23l282.3-163q13.62-7.62 28.85-7.62 15.23 0 28.85 7.62l282.3 163q13.62 7.61 21.23 21.23 7.62 13.61 7.62 28.85v319.22q0 15.24-7.62 28.85-7.61 13.62-21.23 21.23l-282.3 163q-13.62 7.62-28.85 7.62-15.23 0-28.85-7.62Zm185.93-490 111.23-64.38-262.16-151.69q-3.07-1.54-6.15-1.54-3.08 0-6.15 1.54l-104.31 60.15 267.54 155.92ZM480-505.54l112.08-65.61-268.93-155.16-112.07 64.62L480-505.54Z"/></svg>`,
        title1: "ทางร้านกำลังเตรียมสินค้า",
        date: new Date().toLocaleString("th-TH", { hour12: false }),
        svgbinckage: `<svg xmlns="http://www.w3.org/2000/svg" height="35px" viewBox="0 -960 960 960" width="35px" fill="#D64545"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>`,
      };

      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notification1),
      });
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notification2),
      });

      setOrders([]);
      setTotalAmount(0);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="">
      <Nabarorder activePage="2" />
      <div className="mt-[187px]">
        <PromptPayQR />
      </div>
      <div className="bg-white flex justify-end items-center fixed bottom-0 left-0 w-full p-4 h-[100px] shadow-md gap-4">
        <h1 className="flex justify-between items-center text-black text-[20px]">
          รวม ({orders.length} รายการ):
          <span className="text-[#D64545] font-bold">{totalAmount} ฿</span>
        </h1>
        <Link href="/customer/Completed_Order">
          <button
            className={`px-4 py-4 rounded-md text-2xl mr-6 text-white ${
              orders.length > 0
                ? "bg-[#F79C4B] cursor-pointer"
                : "bg-[#DDDDDD] cursor-not-allowed"
            }`}
            disabled={orders.length === 0}
            onClick={handleOrder}
          >
            ยืนยันการชำระเงิน
          </button>
        </Link>
      </div>
    </div>
  );
}