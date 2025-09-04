"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbarfood";
import Image from "next/image";
import Link from "next/link";

export default function ListFood() {
  const [menus, setMenus] = useState([]);
  const [counts, setCounts] = useState({}); // เก็บจำนวนของแต่ละเมนู

  useEffect(() => {
    import("/data/menus.json").then((data) => {
      setMenus(data.default || data);
    });
  }, []);

  const handleSelectDrinkMenu = (menu) => {
    localStorage.setItem("selectedDrinkMenu", JSON.stringify(menu));
  };

  const handleIncrease = (code) => {
    setCounts((prev) => ({ ...prev, [code]: (prev[code] || 0) + 1 }));
  };

  const handleDecrease = (code) => {
    setCounts((prev) => {
      const newCount = (prev[code] || 0) - 1;
      if (newCount <= 0) {
        const { [code]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [code]: newCount };
    });
  };

  const categories = ["เมนูแนะนำ", "เครื่องดื่ม", "ขนมหวาน", "อาหารทานเล่น"];

  return (
    <div className="min-h-screen">
      <Navbar activePage="list_food" />
      <div className="pt-[230px] px-10">
        {categories.map((category) => {
          const filteredMenus = menus.filter((menu) => {
            if (category === "เมนูแนะนำ") return menu.category === "เครื่องดื่ม";
            return menu.category === category;
          });

          if (filteredMenus.length === 0) return null;

          return (
            <div key={category} id={category} className="mb-10 scroll-mt-[200px]">
              <div
                className={`mb-6 mt-6 ${
                  category === "เมนูแนะนำ"
                    ? "flex justify-center"
                    : "flex justify-between items-center"
                }`}
              >
                <h1 className="text-[#D64545] text-4xl font-bold">{category}</h1>
              </div>

              <div className="w-[80%] mx-auto">
                <div className="grid grid-cols-3 gap-12">
                  {filteredMenus.map((menu) => {
                    // ถ้าเป็นเครื่องดื่ม หรืออยู่ในเมนูแนะนำและประเภทเป็นเครื่องดื่ม → ไปหน้า showdetail
                    const isDrink =
                      menu.category === "เครื่องดื่ม" ||
                      (category === "เมนูแนะนำ" && menu.category === "เครื่องดื่ม");

                    const count = counts[menu.code] || 0;

                    return (
                      <div key={menu.code} className="bg-white rounded-lg shadow-md p-4 mx-10">
                        <div className="flex justify-center p-5">
                          <Image
                            src={menu.image}
                            width={180}
                            height={170}
                            alt={menu.name}
                          />
                        </div>
                        <div className="flex items-center justify-between p-2">
                          <h1 className="text-xl font-semibold mb-2 text-[#000000]">
                            {menu.name}
                          </h1>
                          <h1 className="text-xl font-semibold mb-2 text-[#000000]">
                            {menu.price}
                          </h1>
                        </div>
                        <p className="text-gray-600 pl-2">{menu.desc}</p>

                        <div className="flex justify-end mt-3">
                          {isDrink ? (
                            <Link
                              href="/customer/showdetail"
                              onClick={() => handleSelectDrinkMenu(menu)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 -960 960 960"
                                width="24px"
                                fill="#0FA958"
                              >
                                <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0-83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                              </svg>
                            </Link>
                          ) : count > 0 ? (
                            <div className="flex items-center gap-2">
                              <button
                                className="px-2 bg-red-500 text-white rounded"
                                onClick={() => handleDecrease(menu.code)}
                              >
                                -
                              </button>
                              <span>{count}</span>
                              <button
                                className="px-2 bg-green-500 text-white rounded"
                                onClick={() => handleIncrease(menu.code)}
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <svg
                              onClick={() => handleIncrease(menu.code)}
                              xmlns="http://www.w3.org/2000/svg"
                              height="24px"
                              viewBox="0 -960 960 960"
                              width="24px"
                              fill="#0FA958"
                              style={{ cursor: "pointer" }}
                            >
                              <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0-83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                            </svg>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
