"use client";
import Link from "next/link";

export default function Navbar({ activePage }) {
  const buttons = [
    { id: 1, label: "สรุปรายรับ-รายจ่าย", key: "income_and_expenses", baseColor: "#8D6E63" , Link:"/owner/Income_and_expenses"},
    { id: 2, label: "รายรับ", key: "income", baseColor: "#8D6E63" , Link:"/owner/Income"},
    { id: 3, label: "รายจ่าย", key: "expenses", baseColor: "#8D6E63" , Link:"/owner/expenses"},
  ];

  return (
    <div className="fixed top-0 left-0 w-screen h-[150px] bg-[#FFE8A3] z-50 shadow-md px-6">
      <div className="flex items-center justify-between h-full">

        <nav className="flex space-x-10 justify-center flex-1">
          {buttons.map((btn) => (
            <Link key={btn.key} href={btn.Link}>
              <button
                className="w-[209px] h-[65px] rounded-md text-white font-semibold text-[18px]"
                style={{
                  backgroundColor:
                    activePage === btn.key ? "#D64545" : btn.baseColor,
                  cursor: "pointer",
                }}
              >
                {btn.label}
              </button>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
