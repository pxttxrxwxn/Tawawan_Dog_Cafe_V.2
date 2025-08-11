"use client";
import Link from "next/link";

export default function Navbar({ activePage }) {
  const buttons = [
    { id: 1, label: "สรุปรายรับ-รายจ่าย", key: "income_and_expenses", baseColor: "#8D6E63" , Link:"/owner/Income_and_expenses"},
    { id: 2, label: "รายรับ", key: "income", baseColor: "#8D6E63" , Link:"/owner/Income"},
    { id: 3, label: "รายจ่าย", key: "expenses", baseColor: "#8D6E63" , Link:"/owner/expenses"},
  ];

  return (
    <div className="fixed top-0 left-0 w-screen h-[187px] bg-[#FFE8A3] z-50 shadow-md px-6">
      <div className="flex items-center justify-between h-full">

        <div className="flex items-center mr-10">
          <Link href="/owner/order">
          <svg 
          xmlns="http://www.w3.org/2000/svg" 
          height="83px" 
          viewBox="0 -960 960 960" 
          width="83px" 
          fill="#B5B3B3">
            <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
          </Link>
        </div>

        <nav className="flex space-x-10 justify-center flex-1">
          {buttons.map((btn) => (
            <Link key={btn.key} href={btn.Link}>
              <button
                className="w-[209px] h-[75px] rounded-md text-white font-semibold"
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
