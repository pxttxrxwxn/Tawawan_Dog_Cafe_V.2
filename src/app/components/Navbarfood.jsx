"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function Navbar({ activePage }) {
  const [tableNumber, setTableNumber] = useState("");

  useEffect(() => {
    const selectedTable = localStorage.getItem("selectedTable");
    if (selectedTable) {
      setTableNumber(selectedTable);
    }
  }, []);

  const buttons = [
    { id: 1, label: "เครื่องดื่ม", baseColor: "#8D6E63" },
    { id: 2, label: "ขนมหวาน", baseColor: "#8D6E63" },
    { id: 3, label: "อาหารทานเล่น", baseColor: "#8D6E63" },
  ];

  // ฟังก์ชันเลื่อนไปยัง section ตาม id
  const scrollToCategory = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-[187px] bg-[#FFE8A3] z-50 shadow-md px-6">
      <div className="flex items-center justify-between h-full">
        {/* โลโก้ */}
        <div className="flex items-center mr-10">
          <Image src="/logo.png" alt="Logo" width={166} height={143} />
        </div>

        {/* เมนูปุ่ม */}
        <nav className="flex space-x-20">
          {buttons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => scrollToCategory(btn.label)}
              className="w-[209px] h-[75px] rounded-md text-white font-semibold"
              style={{
                backgroundColor: btn.baseColor,
                cursor: "pointer",
              }}
            >
              {btn.label}
            </button>
          ))}
        </nav>

        {/* ไอคอน + หมายเลขโต๊ะ */}
        <div className="flex items-center gap-8">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="30px"
              viewBox="0 -960 960 960"
              width="30px"
              fill="#000000"
            >
              <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
            </svg>
          </div>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="30px"
              viewBox="0 -960 960 960"
              width="30px"
              fill="#000000"
            >
              <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z" />
            </svg>
          </div>
          <div>
            <p className="text-[30px] text-[#000000]">
              โต๊ะ : {tableNumber}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
