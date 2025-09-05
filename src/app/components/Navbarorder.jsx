"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then(res => res.json());

export default function Navbar({ activePage }) {
  const [tableNumber, setTableNumber] = useState("");

    useEffect(() => {
    const selectedTable = localStorage.getItem("selectedTable");
    if (selectedTable) setTableNumber(selectedTable);
    }, []);

    const { data: orders } = useSWR("/api/order", fetcher, { refreshInterval: 1000 });
    const orderCount = orders ? orders.length : 0;

  const buttons = [
    { id: 1, label: "1", key: "1",baseColor: "#F4A261" , text: "ตะกร้าของฉัน"},
    { id: 2, label: "2", key: "2",baseColor: "#D7D6D6" , text: "สั่งซื้อสินค้า" },
    { id: 3, label: "3", key: "3",baseColor: "#D7D6D6" , text: "ข้อมูลการชำระเงิน"},
  ];

  return (
    <div className="fixed top-0 left-0 w-screen h-[187px] bg-[#FFE8A3] z-50 shadow-md px-6">
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center mr-10">
          <Image src="/logo.png" alt="Logo" width={166} height={143} />
        </div>

        <nav className="flex ">
            {buttons.map((btn, index) => {
                const isActiveDefault =
                    (activePage === "2" && (btn.key === "1" || btn.key === "2")) ||
                    (activePage === "3" && (btn.key === "1" || btn.key === "2" || btn.key === "3"));
                const btnColor = activePage === btn.key || isActiveDefault ? "#F4A261" : btn.baseColor;

                let lineColor = "#D7D6D6"
                if (
                (activePage === "2" && btn.key === "1") ||
                (activePage === "3" && (btn.key === "1" || btn.key === "2")) ){
                lineColor = "#0FA958";
                }

                return (
                <div key={btn.id} className="flex items-center">
                    <div className=" flex-col items-center">
                        <button
                            className="w-[76px] h-[76px] rounded-[50%] text-[#544E4E] font-semibold"
                            style={{
                            backgroundColor: btnColor,
                            cursor: "pointer",
                            }}
                        >
                            {btn.label}
                        </button>
                        <p className="mt-2 text-black text-sm">{btn.text}</p>
                    </div>

                    {index < buttons.length - 1 && (
                    <div
                        className="flex mb-5 w-[350px] h-[5px]"
                        style={{ backgroundColor: lineColor }}
                    ></div>
                    )}
                </div>
                );
            })}
        </nav>

        <div className="flex items-center gap-8">
            <Link href="/customer/Notifications">
                <svg 
                xmlns="http://www.w3.org/2000/svg" 
                height="30px" 
                viewBox="0 -960 960 960" 
                width="30px" 
                fill="#000000">
                    <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z"/></svg>
            </Link>
            <Link href="/customer/Order_Customer">
                <div className="relative w-[30px] h-[30px]">
                    <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#000000">
                        <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z" />
                    </svg>
                    {orderCount > 0 && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                            {orderCount}
                        </div>
                    )}
            </div>
            </Link>
            <div className="">
                <p className="text-[30px] text-[#000000]">โต๊ะ : {tableNumber}</p>
            </div>
        </div>
      </div>
    </div>
  );
}
