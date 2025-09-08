"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function ChooseTable() {
  const handleSelectTable = async (tableNumber) => {
    try {
      const res = await fetch("/api/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableNumber }),
      });

      const data = await res.json();
      console.log("Saved:", data);

      localStorage.setItem("selectedTable", tableNumber);
      localStorage.setItem("customerid", data.customerid);
    } catch (err) {
      console.error("Error saving customer:", err);
    }
  };

  return (
    <div className="min-w-screen">
      <div className="flex mt-[35px] ml-[20px]">
        <div>
          <Image src="/logo.png" alt="Logo" width={180} height={170} />
        </div>
        <div className="mx-auto mt-[30px]">
          <div className="flex justify-center w-[925px] bg-[#FFE8A3] rounded-2xl">
            <div className="mt-[50px] mb-[50px]">
              <p className="text-[40px] text-[#D64545] font-[Prompt]">
                โปรดเลือกหมายเลขโต๊ะที่ต้องการก่อนดำเนินการต่อ
              </p>

              <div className="flex flex-row justify-center gap-[150px] mt-[80px]">
                {[1, 2, 3].map((num) => (
                  <Link
                    key={num}
                    href="/customer/list_food"
                    onClick={() => handleSelectTable(num)}
                    className="flex flex-col justify-center items-center w-[150px] h-[150px] rounded-sm bg-white text-4xl text-[#000000]"
                  >
                    <span>โต๊ะ</span>
                    <span>{num}</span>
                  </Link>
                ))}
              </div>

              <div className="flex flex-row justify-center gap-[150px] mt-[150px]">
                {[4, 5].map((num) => (
                  <Link
                    key={num}
                    href="/customer/list_food"
                    onClick={() => handleSelectTable(num)}
                    className="flex flex-col justify-center items-center w-[150px] h-[150px] rounded-sm bg-white text-4xl text-[#000000]"
                  >
                    <span>โต๊ะ</span>
                    <span>{num}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
