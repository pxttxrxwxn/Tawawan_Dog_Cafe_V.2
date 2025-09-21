"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbarfood";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const storedCustomerID = localStorage.getItem("CustomerID") || "";
        if (!storedCustomerID) return;

        const res = await fetch(`/api/notifications?customer_id=${storedCustomerID}`);
        if (!res.ok) throw new Error("Failed to fetch notifications");
        const data = await res.json();

        if (Array.isArray(data)) {
          const sortedNotifications = data
            .map((item) => ({
              ...item,
              title: item.title || "",
              date: item.created_at || "",
            }))
            .sort((a, b) => {
              const numA = parseInt(a.notification_id.replace("N", ""), 10);
              const numB = parseInt(b.notification_id.replace("N", ""), 10);
              return numB - numA;
            });

          setNotifications(sortedNotifications);
        } else {
          setNotifications([]);
        }
      } catch (err) {
        console.error(err);
        setNotifications([]);
      }
    };

    fetchNotifications();
  }, []);
    const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year}   ${hours}:${minutes}`;
  };

  const handleDelete = async (notificationID) => {
    try {
      const res = await fetch("/api/notifications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationID }),
      });
      const result = await res.json();
      if (result.success) {
        setNotifications((prev) =>
          prev.filter((item) => item.notification_id !== notificationID)
        );
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
      if (result.success) setNotifications([]);
    } catch (err) {
      console.error("Error deleting all notifications:", err);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-[180px] px-30">
        <div className="flex justify-center items-center mb-6">
          <div className="flex justify-between items-center w-[80%]">
            <h2 className="text-[#D64545] font-bold text-[40px]">การแจ้งเตือน</h2>
            <h5
              onClick={handleDeleteAll}
              className="text-[#000000] underline text-[20px] cursor-pointer"
            >
              ลบการแจ้งเตือนทั้งหมด
            </h5>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center gap-4">
          {notifications.map((item) => (
            <div
              key={item.notification_id}
              className="w-[40%] bg-[#FFFFFF] flex justify-between items-center rounded-3xl mb-4 p-4"
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: item.svgtitle || "", 
                }}
              />

              <div className="flex flex-col justify-center items-center">
                {item.title && (
                  <h1 className="text-[#000000] text-[24px]">{item.title}</h1>
                )}
                <p className="text-[#757575] text-[20px]">{formatDate(item.date)}</p>
              </div>

              <div
                className="cursor-pointer"
                onClick={() => handleDelete(item.notification_id)}
                dangerouslySetInnerHTML={{
                  __html: item.svgbin || "",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}