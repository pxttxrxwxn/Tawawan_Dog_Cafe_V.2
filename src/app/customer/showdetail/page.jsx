"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbarfood";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ShowDetail() {
  const [menu, setMenu] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [sugarLevel, setSugarLevel] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

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

  const basePrice = Number(menu.price) || 0;
  const typePrice = selectedType ? (menu.type?.[selectedType]?.price || 0) : 0;
  const totalPrice = (basePrice + typePrice) * quantity;
  
  const handleAddToCart = async () => {
    if (menu.type && !selectedType) {
      setError("กรุณาเลือกรูปแบบ");
      return;
    }
    if (menu.category === "เครื่องดื่ม" && !sugarLevel) {
      setError("กรุณาเลือกระดับความหวาน");
      return;
    }

    setError("");
    const order = {
      code: menu.code,
      name: menu.name,
      basePrice,
      type: selectedType,
      typePrice,
      sugarLevel,
      quantity,
      totalPrice,
      note,
      image: menu.image,
    };

  router.push("/customer/list_food");

    fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    }).catch((err) => console.error("เพิ่มออเดอร์ไม่สำเร็จ:", err));
  };
  return (
    <div className="min-h-screen">
      <Navbar activePage="1" />
      <div className="pt-[220px] px-30">
        <div className="flex justify-center items-center mb-6">
          <div className="bg-white w-[1000px] h-[500px] rounded-2xl flex justify-between">
            <div className="flex fex-col mb-6 justify-between w-[1000px]">
              <div className="w-1/2 m-auto">
                <div className="flex justify-center mb-4">
                  <Image
                    src={menu.image}
                    width={359}
                    height={359}
                    alt={menu.name}
                  />
                </div>
                <div className="flex items-center text-center justify-around">
                  <h1 className="text-3xl font-bold text-[#000000] mb-2">
                    {menu.name}
                  </h1>
                  <h1 className="text-3xl font-bold text-[#000000] mb-2">
                    {totalPrice} ฿
                  </h1>
                </div>
                <h1 className="text-xl font-bold text-center mb-2 text-[#757575]">
                  {menu.desc || "ไม่มีคำอธิบาย"}
                </h1>
              </div>
              <div className="w-1/2 m-auto space-y-4">
                {menu.type && typeof menu.type === "object" && (
                  <div>
                    <h1 className="text-2xl font-bold text-[#000000] mb-2 font-chakra">
                      รูปแบบ
                    </h1>
                    <div className="flex gap-3">
                      {Object.keys(menu.type).map((t) => {
                        const item = menu.type[t];
                        if (!item.checked) return null;
                        return (
                          <button
                            key={t}
                            onClick={() => setSelectedType(t)}
                            className={`px-4 py-2 rounded-lg border ${
                              selectedType === t
                                ? "bg-[#F4A261] text-black border-none"
                                : "bg-gray-100 text-black border-none"
                            }`}
                          >
                            {t} {item.price > 0 ? `(+${item.price}฿)` : ""}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                {menu.category === "เครื่องดื่ม" && (
                  <div>
                    <h1 className="text-2xl font-bold text-[#000000] mb-2">
                      ระดับความหวาน
                    </h1>
                    <div className="flex gap-3">
                      {["0%", "25%", "50%", "75%", "100%"].map((sugar) => (
                        <button
                          key={sugar}
                          onClick={() => setSugarLevel(sugar)}
                          className={`px-4 py-2 rounded-lg border ${
                            sugarLevel === sugar
                              ? "bg-[#F4A261] text-black border-none"
                              : "bg-gray-100 text-black border-none"
                          }`}
                        >
                          {sugar}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-[#000000] mb-2">
                    หมายเหตุ
                  </h1>
                  <textarea
                    className="w-[80%] border rounded-lg p-2 text-black"
                    placeholder="เพิ่มหมายเหตุ เช่น ไม่ใส่วิปครีม"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
                {error && (
                  <p className="text-red-500 font-bold">{error}</p>
                )}
                <div className="flex justify-end items-center gap-4">
                  <div className="px-6 py-2 bg-[#F4A261] rounded-lg font-bold flex items-center gap-2 text-black mr-[5%]">
                    <h1>+ {totalPrice}</h1>
                    <button onClick={handleAddToCart} className="cursor-pointer">เพิ่มไปตะกร้า</button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-1 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-xl">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-1 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
