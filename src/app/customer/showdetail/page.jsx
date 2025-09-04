"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbarfood";
import Image from "next/image";
import Link from "next/link";

export default function ShowDetail() {
  const [menu, setMenu] = useState(null);

  useEffect(() => {
    const selectedMenu = localStorage.getItem("selectedDrinkMenu");
    if (selectedMenu) {
      setMenu(JSON.parse(selectedMenu));
    }
  }, []);

  if (!menu) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>ไม่มีข้อมูลเมนู</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen">
      <Navbar activePage="1" />
      <div className="pt-[220px] px-30">
        <div className="flex justify-between items-center mb-6">
          <div className="bg-white w-full h-[500px] rounded-2xl flex justify-between">
            <div className="flex fex-col mb-6">
              <div className="flex justify-center mb-4">
                <Image src={menu.image} width={250} height={200} alt={menu.name} />
              </div>
              <div className="">
               <h1 className="text-3xl font-bold text-center text-[#D64545] mb-2">{menu.name}</h1>
                <p className="text-center text-gray-600 mb-4">ราคา: {menu.price} บาท</p>
              </div>
            </div>
            <div className="flex justify-between items-center mb-6">
              
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
 

