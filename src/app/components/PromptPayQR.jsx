"use client";

import React, { useState, useEffect } from "react";
import { generatePromptPayQR } from "@/lib/generatePromptPayQR";

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
      <div className="mt-4">
        {qrData ? (
          <img
            src={qrData}
            alt="QR Code"
            className="border rounded-md shadow-md"
          />
        ) : (
          <p>Generating QR Code...</p>
        )}
      </div>
    </div>
  );
};

export default PromptPayQR;
