"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbarfood";
import Image from "next/image";
import Link from "next/link";

export default function ListFood() {
  const [menus, setMenus] = useState([]);
  const [counts, setCounts] = useState({});
  const [recommendedMenus, setRecommendedMenus] = useState([]);

  useEffect(() => {
    fetch("/data/menus.json")
      .then(res => res.json())
      .then(data => setMenus(data))
      .catch(err => console.error("Error loading menus:", err));
  }, []);

  useEffect(() => {
    if (menus.length === 0) return;

    fetch("/data/Income.json")
      .then(res => res.json())
      .then(data => {
        if (!data || data.length === 0) throw new Error("No income data");

        const itemCount = {};
        data.forEach(order =>
          order.items.forEach(item => {
            itemCount[item.name] = (itemCount[item.name] || 0) + item.quantity;
          })
        );

        const sortedMenus = menus
          .filter(menu => itemCount[menu.name])
          .sort((a, b) => itemCount[b.name] - itemCount[a.name])
          .slice(0, 3);

        if (sortedMenus.length < 3) {
          const remaining = menus.filter(m => !sortedMenus.find(sm => sm.code === m.code));
          sortedMenus.push(...remaining.slice(0, 3 - sortedMenus.length));
        }

        setRecommendedMenus(sortedMenus);
      })
      .catch(() => {
        console.log("No income data, using menus.json");
        setRecommendedMenus(menus.slice(0, 3));
      });
  }, [menus]);

  useEffect(() => {
    fetch("/data/cart.json")
      .then((res) => res.json())
      .then((data) => {
        const initialCounts = {};
        data.forEach((item) => {
          initialCounts[item.code] = (initialCounts[item.code] || 0) + item.quantity;
        });
        setCounts(initialCounts);
      });
  }, []);


  const handleSelectDrinkMenu = (menu) => {
    localStorage.setItem("selectedDrinkMenu", JSON.stringify(menu));
  };

  const handleIncrease = async (menu) => {
    setCounts((prev) => ({ ...prev, [menu.code]: (prev[menu.code] || 0) + 1 }));

    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: menu.code,
        name: menu.name,
        basePrice: menu.price,
        type: null,
        typePrice: 0,
        sugarLevel: null,
        quantity: 1,
        totalPrice: menu.price,
        note: null,
        image: menu.image,
      }),
    });
  };

  const handleDecrease = async (menu) => {
    setCounts((prev) => {
      const newCount = (prev[menu.code] || 0) - 1;
      if (newCount <= 0) {
        const { [menu.code]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [menu.code]: newCount };
    });

    await fetch("/api/orders", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: menu.code,
        type: menu.type || null,
        sugarLevel: menu.sugarLevel || null,
        note: menu.note || null,
        removeAll: false,
      }),
    });
  };

  const categories = ["เมนูแนะนำ", "เครื่องดื่ม", "ขนมหวาน", "อาหารทานเล่น"];

  return (
    <div className="min-h-screen">
      <Navbar activePage="list_food" />
      <div className="pt-[180px] px-10">
        {categories.map((category) => {
          let filteredMenus = [];

          if (category === "เมนูแนะนำ") {
            filteredMenus = recommendedMenus;
          } else {
            filteredMenus = menus.filter((menu) => menu.category === category);
          }

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
                    const isDrink =
                      menu.category === "เครื่องดื่ม" ||
                      (category === "เมนูแนะนำ" && menu.category === "เครื่องดื่ม");

                    const count = counts[menu.code] || 0;

                    return (
                      <div key={menu.code} className="bg-white rounded-lg shadow-md h-[350px] p-4 mx-10">
                        <div className="w-[100%] h-[58%] content-evenly">
                          <div className="flex justify-center">
                            <Image
                              src={menu.image}
                              width={160}
                              height={170}
                              alt={menu.name}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 ">
                          <h1 className="text-xl font-semibold mb-2 text-[#000000]">
                            {menu.name}
                          </h1>
                          <h1 className="text-xl font-semibold mb-2 text-[#000000]">
                            {menu.price}
                          </h1>
                        </div>
                        <p className="text-gray-600 pl-2">{menu.desc}</p>

                        <div className="flex justify-end my-1">
                          {isDrink ? (
                            <Link
                              href="/customer/showdetail"
                              onClick={() => handleSelectDrinkMenu(menu)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="32px"
                                viewBox="0 -960 960 960"
                                width="32px"
                                fill="#0FA958"
                              >
                                <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0-83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                              </svg>
                            </Link>
                          ) : count > 0 ? (
                            <div className="flex items-center gap-2 bg-[#F4A261] text-[#544E4E] rounded-[5px]">
                              <button
                                className="px-2 text-black rounded cursor-pointer"
                                onClick={() => handleDecrease(menu)}
                              >
                                -
                              </button>
                              <span>{count}</span>
                              <button
                                className="px-2 text-black rounded cursor-pointer"
                                onClick={() => handleIncrease(menu)}
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <svg
                              onClick={() => handleIncrease(menu)}
                              xmlns="http://www.w3.org/2000/svg"
                              height="32px"
                              viewBox="0 -960 960 960"
                              width="32px"
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
