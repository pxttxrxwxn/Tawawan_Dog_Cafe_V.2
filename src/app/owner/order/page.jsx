"use client";

import React, { useEffect, useState } from "react";
import Navbar from '../../components/Navbar';
import Link from "next/link";

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [ownerID, setOwnerID] = useState("");

  const loadOrders = () => {
    fetch("/api/orders")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("fetch orders error:", err));
  };

  useEffect(() => {
    const storedOwnerID = localStorage.getItem("OwnerID") || "";
    setOwnerID(storedOwnerID);


    loadOrders();

    const cartInterval = setInterval(loadOrders, 3000);

    return () => clearInterval(cartInterval);
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

  const completeOrder = async (orderId, customerId) => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ OrderID: orderId }),
      });

      const data = await res.json();
      const orders = data.income;
      const tableNumber = orders.table_number;

      if (res.ok && data.success) {
        setOrders(prev =>
          prev.map(o =>
            o.order_id === orderId ? { ...o, order_status: "complete" } : o
          )
        );
        await fetch("/api/notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            NotificationID: "AUTO1",
            svgtitle:`<svg xmlns="http://www.w3.org/2000/svg" height="92px" viewBox="0 -960 960 960" width="92px" fill="#000000"><path d="M222.1-178.31q-45.95 0-78.33-32.4-32.38-32.39-32.38-78.68H53.85v-432.92q0-23.53 17.08-40.61T111.54-780h558.61v157.39h95l141 188.3v144.92h-65.61q0 46.29-32.39 78.68-32.39 32.4-78.66 32.4-46.11 0-78.42-32.4-32.3-32.39-32.3-78.68H333.15q0 46.31-32.55 78.7-32.55 32.38-78.5 32.38Zm.17-45.38q27.27 0 46.38-19.12 19.12-19.11 19.12-46.38 0-27.27-19.12-46.39-19.11-19.11-46.38-19.11-27.27 0-46.39 19.11-19.11 19.12-19.11 46.39t19.11 46.38q19.12 19.12 46.39 19.12ZM99.23-334.77h21.62q12.76-28.54 39.96-47.23 27.19-18.69 60.75-18.69 32.78 0 60.57 18.81 27.79 18.8 40.56 47.11h302.08v-399.84H111.54q-4.62 0-8.46 3.84-3.85 3.85-3.85 8.46v387.54Zm630.42 111.08q27.27 0 46.39-19.12 19.11-19.11 19.11-46.38 0-27.27-19.11-46.39-19.12-19.11-46.39-19.11t-46.38 19.11q-19.12 19.12-19.12 46.39t19.12 46.38q19.11 19.12 46.38 19.12Zm-59.5-195.54h191l-119.46-158h-71.54v158ZM362.31-527.08Z"/></svg>`,
            title: "จัดส่งสินค้าเสร็จสิ้น",
            body: `ออเดอร์จากโต๊ะ ${tableNumber} จัดส่งสินค้าเสร็จสิ้น`,
            customer_id: customerId,
            owner_id: ownerID,
            svgbin:`<svg xmlns="http://www.w3.org/2000/svg" height="35px" viewBox="0 -960 960 960" width="35px" fill="#D64545"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>`,
          }),
        });
        window.location.reload();
      } else {
        console.error("Failed to complete order:", data.error || "Unknown error");
      }
    } catch (err) {
      console.error("Error completing order:", err);
    }
  };

  return (
    <div className="">
      <Navbar activePage="order" />
      <div className="min-h-screen bg-[#fdf6e3]">

      <div className="p-6 ">
        <div className="mb-4 mt-[150px] pl-[80px] pr-[80px] flex">
          <Link href="/owner/order" className="w-[380px] h-[80px] p-5 rounded-sm bg-[#FFE7A1] flex items-center text-[#000000] cursor-pointer">
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

        <div className="grid grid-cols-4 md:grid-cols-3 gap-6 ml-[60px] mt-[50px]">
          {orders
            .filter(order => order.order_status === "Pending")
              .map((order) => (
                <div key={order.order_id} className="bg-white w-[388px] rounded-lg shadow flex flex-col p-4">
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
                        <span className='text-[#000000] text-2xl'>ออเดอร์ #{order.order_id}</span>
                        <p className="text-[30px] ml-[30px] mt-2 text-[#000000]">โต๊ะ: {order.table_number}</p>
                      </div>

                      <p className="text-sm text-black w-full ml-9">
                        {formatDate(order.order_datetime)}
                      </p>
                    </div>
                  </div>

                  <hr className="my-2 ml-[-16px] text-gray-300 w-[388px]"/>

                  <div className="flex-1">
                      <p className="font-semibold text-[30px] text-[#000000]">รายการ</p>
                      {order.order_description.map((item, index) => (
                        <div key={index} className='ml-5 text-[#000000] flex flex-col'>
                          <span>
                            {item.Quantity}x {item.MenuName}{item.Type ? `${item.Type}` : ""} {item.SugarLevel ? ` หวาน ${item.SugarLevel}` : ""}
                          </span>
                          {item.Note && item.Note.trim() !== "" && (
                            <span className="text-sm text-gray-600 ml-2">หมายเหตุ: {item.Note}</span>
                          )}
                          <hr className="my-2 ml-0 text-gray-300 w-[320px]"/>
                        </div>
                      ))}
                    </div>
                  
                  <div className="mt-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" 
                      height="24px" 
                      viewBox="0 -960 960 960" 
                      width="24px" 
                      fill="#000000">
                      <path d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-800q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Zm0-360Zm112 168 56-56-128-128v-184h-80v216l152 152ZM224-866l56 56-170 170-56-56 170-170Zm512 0 170 170-56 56-170-170 56-56ZM480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720q-117 0-198.5 81.5T200-440q0 117 81.5 198.5T480-160Z"/>
                    </svg>
                    <p className="font-bold text-[20px] text-[#F4A261] ml-2">
                      สถานะ: รอดำเนินการ
                    </p>
                  </div>
                  <div className='flex justify-end mt-2'>
                    <button 
                      onClick={() => completeOrder(order.order_id, order.customer_id)}
                      className="w-[150px] h-[42px] bg-[#0FA958] text-white font-bold text-[16px] px-3 py-1 rounded cursor-pointer">
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
