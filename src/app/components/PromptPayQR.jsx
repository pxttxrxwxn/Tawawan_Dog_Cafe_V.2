"use client";

import React, { useState, useEffect } from "react";
import { generatePromptPayQR } from "../../lib/generatePromptPayQR";

const PromptPayQR = () => {
  const promptPayId = "0932495900";
  const [orders, setOrders] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [amount, setAmount] = useState(0);
  const [qrData, setQrData] = useState("");

  useEffect(() => {
    fetch("/data/order.json")
      .then((res) => {
        if (!res.ok) throw new Error("Cannot fetch order.json");
        return res.json();
      })
      .then((data) => setOrders(data))
      .catch((err) => console.error("Error loading order.json:", err));
  }, []);

  useEffect(() => {
    const total = orders.reduce((sum, item) => sum + item.totalPrice, 0);
    setTotalAmount(total);
    setAmount(total);
  }, [orders]);

  useEffect(() => {
    const fetchQR = async () => {
      if (amount > 0) {
        const qr = await generatePromptPayQR(promptPayId, amount);
        setQrData(qr);
      }
    };
    fetchQR();
  }, [promptPayId, amount]);

  return (
    <div className="flex flex-col items-center p-5">
      <div className="flex flex-col items-center">
        <h1 className="text-[#D64545] text-2xl font-bold mb-2">สแกน QR-Code</h1>
        <h1 className="text-[#D64545] text-2xl font-bold mb-2">นี้เพื่อยืนยันการสั่งซื้อของคุณ</h1>
      </div>
      <div className="relative mt-4 w-[300px] h-[300px]">
        {qrData ? (
          <>
            <img
              src={qrData}
              alt="QR Code"
              className="border rounded-md shadow-md w-full h-full"
            />
            <img
              src="/logo.png"
              alt="Logo"
              className="absolute top-1/2 left-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2"
            />
          </>
        ) : (
          <p>Generating QR Code...</p>
        )}
      </div>
    </div>
  );
};

export default PromptPayQR;
