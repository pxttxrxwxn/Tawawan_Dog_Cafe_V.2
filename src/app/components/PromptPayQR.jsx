"use client";

import React, { useState, useEffect } from "react";
import { generatePromptPayQR } from "../../lib/generatePromptPayQR";

const PromptPayQR = () => {
  const promptPayId = "0932495900";
  const [amount, setAmount] = useState(50);
  const [qrData, setQrData] = useState("");

  useEffect(() => {
    const fetchQR = async () => {
      const qr = await generatePromptPayQR(promptPayId, amount);
      setQrData(qr);
    };
    fetchQR();
  }, [promptPayId, amount]);

  return (
    <div className="flex flex-col items-center p-5">
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
