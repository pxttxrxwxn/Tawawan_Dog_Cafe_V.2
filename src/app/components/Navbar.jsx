"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function Navbar({ activePage }) {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        setUserName(data.name);
      } catch (error) {
        setUserName("ไม่พบชื่อผู้ใช้");
      }
    };
    fetchUser();
  }, []);

  const buttons = [
    { id: 1, label: "คำสั่งซื้อ", key: "order", baseColor: "#8D6E63" },
    { id: 2, label: "รายรับ-รายจ่าย", key: "income", baseColor: "#8D6E63" },
    { id: 3, label: "คลังสินค้า", key: "stock", baseColor: "#8D6E63" },
    { id: 4, label: "เมนู", key: "menu", baseColor: "#8D6E63" },
  ];

  return (
    <div className="fixed top-0 left-0 w-screen h-[187px] bg-[#FFE8A3] z-50 flex items-center px-6 shadow-md">
      <div className="flex items-center mr-10">
        <Image src="/logo.png" alt="Logo" width={166} height={143} />
      </div>

      <nav className="flex space-x-20">
        {buttons.map((btn) => (
          <button
            key={btn.key}
            className="w-[209px] h-[75px] rounded-md text-white font-semibold"
            style={{
              backgroundColor:
                activePage === btn.key ? "#D64545" : btn.baseColor,
              cursor: "pointer",
            }}
          >
            {btn.label}
          </button>
        ))}
      </nav>

      <div className="ml-auto flex items-center space-x-2 cursor-pointer border-black border-2 rounded-md px-4 py-2">
        <div className="w-8 h-8 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>
        </div>
        <span className="text-black font-semibold">
          {userName || " "}
        </span>
      </div>
    </div>
  );
}
