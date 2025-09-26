"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ChooseTable() {
  const router = useRouter();

  const handleSelectTable = async (tableNumber) => {
    try {
      const res = await fetch("/api/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table_number: tableNumber }),
      });

      const data = await res.json();
      console.log("Saved:", data);

      localStorage.setItem("selectedTable", tableNumber);
      localStorage.setItem("CustomerID", data.customer_id);

      router.push("/customer/list_food");
    } catch (err) {
      console.error("Error saving customer:", err);
    }
  };

  return (
    <div className="min-w-screen">
      <div className="flex mt-[35px] ml-[20px]">
        <div>
          <Image src="/logo.png" alt="Logo" width={180} height={170} />
        </div>
        <div className="mx-auto mt-[30px]">
          <div className="flex justify-center w-[925px] bg-[#FFE8A3] rounded-2xl">
            <div className="mt-[50px] mb-[50px]">
              <p className="text-[40px] text-[#D64545] font-[Prompt] font-extralight">
                โปรดเลือกหมายเลขโต๊ะที่ต้องการก่อนดำเนินการต่อ
              </p>

              <div className="flex flex-row justify-center gap-[100px] mt-[80px]">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleSelectTable(num)}
                    className="flex flex-col justify-center items-center w-[150px] h-[150px] rounded-sm bg-white text-4xl text-[#000000]"
                  >
                    <span>โต๊ะ</span>
                    <span>{num}</span>
                  </button>
                ))}
              </div>

              <div className="flex flex-row justify-center gap-[100px] mt-[80px]">
                {[4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleSelectTable(num)}
                    className="flex flex-col justify-center items-center w-[150px] h-[150px] rounded-sm bg-white text-4xl text-[#000000]"
                  >
                    <span>โต๊ะ</span>
                    <span>{num}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
