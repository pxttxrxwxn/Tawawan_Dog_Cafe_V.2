"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbarincome_and_expenses";

export default function IncomeAndExpenses() {
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [filter, setFilter] = useState("all");

  const filterDataByDate = (data, filterKey, field = "date") => {
    const today = new Date();
    return data.filter((item) => {
      if (!item[field]) return false;
      const itemDate = new Date(item[field]);

      if (filterKey === "today") {
        return itemDate.toDateString() === today.toDateString();
      } else if (filterKey === "week") {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return itemDate >= weekStart && itemDate <= weekEnd;
      } else if (filterKey === "month") {
        return (
          itemDate.getMonth() === today.getMonth() &&
          itemDate.getFullYear() === today.getFullYear()
        );
      }
      return true;
    });
  };

  useEffect(() => {
    fetch("/data/Income.json")
      .then((res) => res.json())
      .then((data) => {
        const filteredIncome  = filterDataByDate(data, filter, "OrderDateTime");
        const totalIncome = filteredIncome .reduce((sum, order) => sum + (order.Total  || 0), 0);
        setIncomeTotal(totalIncome);
      })
      .catch((err) => console.error("Error loading Income.json:", err));

    fetch("/data/expenses.json")
      .then((res) => res.json())
      .then((data) => {
        const filteredExpense  = filterDataByDate(data, filter, "ExpenseDateTime");
        const totalExpense = filteredExpense .reduce((sum, exp) => sum + (exp.Amount  || 0), 0);
        setExpenseTotal(totalExpense);
      })
      .catch((err) => console.error("Error loading expenses.json:", err));
  }, [filter]);

  const netTotal = incomeTotal - expenseTotal;

  return (
    <div className="min-h-screen">
      <Navbar activePage="income_and_expenses" />

      <div className="pt-[200px] px-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 ml-[10%]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="32px"
              viewBox="0 -960 960 960"
              width="32px"
              fill="#000000"
            >
              <path d="M200-160v-240h100v240H200Zm250 0v-440h100v440H450Zm250 0v-640h100v640H700Z" />
            </svg>
            <h2 className="text-[#D64545] font-bold text-2xl">
              สรุปรายรับ–รายจ่าย
            </h2>
          </div>

          <div className="flex justify-end mb-4">
            <div className="flex items-center gap-2">
              <span className="font-medium text-[#000000] text-[18px]">ดูสรุป :</span>
              <select className="border rounded-md px-3 py-1 shadow-sm bg-white text-[#000000]" value={filter} onChange={(e) => setFilter(e.target.value)}  >
                <option value="all">ทั้งหมด</option>
                <option value="today">วันนี้</option>
                <option value="week">สัปดาห์นี้</option>
                <option value="month">เดือนนี้</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto flex justify-center">
          <table className="border-collapse w-[50%] text-center text-black">
            <thead>
              <tr className="bg-[#F79C4B] text-white">
                <th className="border border-black px-2 py-2 ">ประเภท</th>
                <th className="border border-black px-4 py-2">ยอดรวม [บาท]</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black px-2 py-2 flex items-center justify-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#000000"
                  >
                    <path d="m136-240-56-56 296-298 160 160 208-206H640v-80h240v240h-80v-104L536-320 376-480 136-240Z" />
                  </svg>
                  รายรับ
                </td>
                <td className="border border-black px-4 py-2 font-bold">
                  <span className="text-[#0FA958]">+</span> {incomeTotal} บาท
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-2 flex items-center justify-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#000000"
                  >
                    <path d="M640-240v-80h104L536-526 376-366 80-664l56-56 240 240 160-160 264 264v-104h80v240H640Z" />
                  </svg>
                  รายจ่าย
                </td>
                <td className="border border-black px-4 py-2 font-bold">
                  <span className="text-[#D64545]">-</span> {expenseTotal} บาท
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-2 flex items-center justify-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    width="20"
                    height="20"
                    fill="currentColor"
                  >
                    <path d="M 7 5 C 5.3550302 5 4 6.3550302 4 8 L 4 15 C 4 21.615466 9.3845336 27 16 27 C 22.615466 27 28 21.615466 28 15 L 28 8 C 28 6.3550302 26.64497 5 25 5 L 7 5 z M 7 7 L 25 7 C 25.56503 7 26 7.4349698 26 8 L 26 15 C 26 20.534534 21.534534 25 16 25 C 10.465466 25 6 20.534534 6 15 L 6 8 C 6 7.4349698 6.4349698 7 7 7 z M 10.65625 11.40625 C 10.272625 11.40625 9.88625 11.582 9.59375 11.875 C 9.00875 12.461 9.00775 13.38375 9.59375 13.96875 L 15 19.375 C 15.281 19.656 15.6655 19.8125 16.0625 19.8125 C 16.4605 19.8125 16.844 19.656 17.125 19.375 L 22.40625 14.125 C 22.99125 13.541 22.99125 12.586 22.40625 12 C 21.82025 11.414 20.86625 11.415 20.28125 12 L 16.0625 16.21875 L 11.71875 11.875 C 11.42575 11.582 11.039875 11.40625 10.65625 11.40625 z" />
                  </svg>
                  ยอดสุทธิ
                </td>
                <td className="border border-black px-4 py-2 font-bold">
                  {netTotal >= 0 ? (
                    <>
                      <span className="text-[#0FA958]">+</span> {netTotal} บาท
                    </>
                  ) : (
                    <>
                      <span className="text-[#D64545]">-</span> {Math.abs(netTotal)} บาท
                    </>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
