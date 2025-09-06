"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbarfood";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch("/data/Notifications.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch Notifications.json");
        return res.json();
      })
        .then((data) => {
        if (Array.isArray(data)) {
            const sortedData = data.sort(
                (a, b) => new Date(b.date) - new Date(a.date)
            );
            setNotifications(sortedData);
        } else {
            console.error("Notifications.json is not an array", data);
            setNotifications([]);
        }
        })
      .catch((err) => console.error(err));
  }, []);

    const handleDelete = async (id) => {
        try {
            const res = await fetch("/api/notifications", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
            });

            const result = await res.json();
            if (result.success) {
            setNotifications((prev) => prev.filter((item) => item.id !== id));
            } else {
            console.error("Failed to delete:", result.error);
            }
        } catch (err) {
            console.error("Error deleting notification:", err);
        }
    };
    const handleDeleteAll = async () => {
        try {
            const res = await fetch("/api/notifications", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ all: true }),
            });
            const result = await res.json();
            if (result.success) {
            setNotifications([]);
            }
        } catch (err) {
            console.error("Error deleting all notifications:", err);
        }
    };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-[220px] px-30">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[#D64545] font-bold text-[36px] font-c">
            การแจ้งเตือน
          </h2>
          <h5 onClick={handleDeleteAll} className="text-[#000000] underline text-[24px] cursor-pointer">
            ลบการแจ้งเตือนทั้งหมด
          </h5>
        </div>

        <div className="flex flex-col justify-center items-center gap-4">
          {notifications.map((item) => (
            <div
              key={item.id}
              className="w-[50%] bg-[#FFFFFF] flex justify-between items-center rounded-3xl mb-4 p-4"
            >
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    item.svgcheck || item.svgtruck || item.svgpackage || "",
                }}
              />

              <div className="flex flex-col justify-center items-center">
                {item.title1 && (
                  <h1 className="text-[#000000] text-[24px]">{item.title1}</h1>
                )}
                {item.title2 && (
                  <h1 className="text-[#000000] text-[24px]">{item.title2}</h1>
                )}
                {item.title3 && (
                  <h1 className="text-[#000000] text-[24px]">{item.title3}</h1>
                )}
                <p className="text-[#757575] text-[20px]">{item.date}</p>
              </div>

              <div
                className="cursor-pointer"
                onClick={() => handleDelete(item.id)}
                dangerouslySetInnerHTML={{
                  __html: 
                  item.svgbincheck || item.svgbinckage || item.svgbintruck || "",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}