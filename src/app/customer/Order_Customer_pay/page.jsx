"use client";
import React, { useEffect, useState } from "react";
import PromptPayQR from "../../components/PromptPayQR";
import Nabarorder from "../../components/Navbarorder";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function Order_Customer_pay() {
  const [orders, setOrders] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [tableNumber, setTableNumber] = useState("");
  const [timeLeft, setTimeLeft] = useState(120);
  const router = useRouter();

  useEffect(() => {
    const selectedTable = localStorage.getItem("selectedTable");
    if (selectedTable) setTableNumber(selectedTable);

    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        const cartData = JSON.parse(storedCart);
        setOrders(cartData);
      } catch (err) {
        console.error("Error parsing cart from localStorage:", err);
        setOrders([]);
      }
    } else {
      setOrders([]);
    }
  }, []);

  useEffect(() => {
    const total = orders.reduce((sum, item) => sum + item.totalPrice, 0);
    setTotalAmount(total);
  }, [orders]);

  useEffect(() => {
    if (timeLeft <= 0) {
      localStorage.removeItem("cart");

      Swal.fire({
        title: "การชำระเงินไม่สำเร็จ",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
      
      setTimeout(() => {
        router.push("/customer/list_food");
      }, 2000);

      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, router]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleOrder = async () => {
    let Customerid = localStorage.getItem("CustomerID");
    if (!Customerid) {
      Customerid = crypto.randomUUID();
      localStorage.setItem("customerid", Customerid);
      console.log("Generated new customerid:", Customerid);
    }
    const storedCart = localStorage.getItem("cart");
    const cart = storedCart ? JSON.parse(storedCart) : [];

    if (cart.length === 0) {
      console.error("No orders to process");
      return;
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableNumber, Customerid, cart }),
      });

      if (!res.ok) {
        console.error("Request failed with status:", res.status);
        return;
      }

      const data = await res.json();
      console.log("API response:", data);

      if (!data.success) {
        console.error("Order creation failed:", data);
        return;
      }

      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          NotificationID: "AUTO1",
          svgtitle: `<svg xmlns="http://www.w3.org/2000/svg" height="70px" viewBox="0 -960 960 960" width="70px" fill="#000000"><path d="M480.07-100q-80.07 0-149.44-29.11-69.37-29.12-120.87-80.6-51.51-51.48-80.63-120.82Q100-399.87 100-479.93q0-79.45 29.12-148.82 29.12-69.37 80.61-120.88 51.49-51.5 120.84-80.94Q399.92-860 480-860q70.51 0 131.99 22.66 61.47 22.65 110.78 62.34l-32.23 33q-43.23-35-96.38-53.81-53.14-18.8-114.16-18.8-141.54 0-238.08 96.53-96.53 96.54-96.53 238.08 0 141.54 96.53 238.08 96.54 96.53 238.08 96.53 141.54 0 238.08-96.53 96.53-96.54 96.53-238.08 0-30-4.69-58.23-4.69-28.23-13.69-55l34.46-34.85q14.46 34.31 21.89 71.39Q860-519.61 860-480q0 80.08-29.42 149.43-29.42 69.35-80.9 120.84-51.49 51.49-120.82 80.61Q559.52-100 480.07-100ZM421-311.46 268.69-464.38l33.85-34.23L421-380.15l404.77-404.77 34.84 33.84L421-311.46Z"/></svg>`,
          title: "การสั่งสินค้าเสร็จสิ้น",
          body: `โต๊ะ ${tableNumber} ได้ทำการชำระเงินเรียบร้อย`,
          customer_id: Customerid,
          owner_id: null,
        }),
      });

      localStorage.removeItem("cart");
      setOrders([]);
      setTotalAmount(0);
      router.push("/customer/Completed_Order");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="">
      <Nabarorder activePage="2" />
      <div className="mt-[187px]">
        <PromptPayQR />
        <div className="text-center text-[#D64545] text-[20px]">
          กรุณาชำระเงินภายในเวลา {formatTime(timeLeft)}
        </div>
      </div>

      <div className="bg-white flex justify-end items-center fixed bottom-0 left-0 w-full p-4 h-[100px] shadow-md gap-4">
        <h1 className="flex justify-between items-center text-black text-[20px]">
          รวม ({orders.length} รายการ):
          <span className="text-[#D64545] font-bold">{totalAmount} ฿</span>
        </h1>
        <button
          className={`px-4 py-4 rounded-md text-2xl mr-6 text-white ${
            orders.length > 0
              ? "bg-[#F79C4B] cursor-pointer"
              : "bg-[#DDDDDD] cursor-not-allowed"
          }`}
          disabled={orders.length === 0}
          onClick={handleOrder}
        >
          ยืนยันการชำระเงิน
        </button>
      </div>
    </div>
  );
}
