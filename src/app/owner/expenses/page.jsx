"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbarincome_and_expenses";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [filter, setFilter] = useState("all");

  const editingExpense = editingIndex !== null ? expenses[editingIndex] : null;

  const openModal = (index = null) => {
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingIndex(null);
    setIsModalOpen(false);
  };

  const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await fetch("/api/expenses");
        const data = await res.json();
        setExpenses(data);
      } catch (err) {
        console.error("Error fetching expenses:", err);
      }
    };
    fetchExpenses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    if (!form.date.value || !form.detail.value || !form.amount.value || !form.category.value) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    const ownerID = localStorage.getItem("OwnerID") || ""; 

    const newExpense = {
      OwnerID: ownerID,
      date: form.date.value,
      detail: form.detail.value,
      amount: Number(form.amount.value),
      category: form.category.value,
    };

    try {
      if (editingExpense) {
        await fetch("/api/expenses", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...newExpense, originalIndex: editingIndex }),
        });
        setExpenses((prev) =>
          prev.map((exp, idx) =>
            idx === editingIndex ? { ...prev[idx], ...newExpense } : exp
          )
        );
      } else {
        const res = await fetch("/api/expenses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newExpense),
        });
        const data = await res.json();
        setExpenses((prev) => [...prev, data.newExpense]);
      }
    } catch (err) {
      console.error(err);
    }

    form.reset();
    closeModal();
  };

  const handleDelete = async (index) => {
    try {
      await fetch(`/api/expenses?index=${index}`, { method: "DELETE" });
      setExpenses((prev) => prev.filter((_, idx) => idx !== index));
    } catch (err) {
      console.error(err);
    }
  };

  const filterExpenses = () => {
    const today = new Date();
    return expenses.filter((exp) => {
      const expDate = new Date(exp.date);

      if (filter === "today") {
        return (
          expDate.getDate() === today.getDate() &&
          expDate.getMonth() === today.getMonth() &&
          expDate.getFullYear() === today.getFullYear()
        );
      }

      if (filter === "week") {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
        return expDate >= startOfWeek && expDate <= endOfWeek;
      }

      if (filter === "month") {
        return (
          expDate.getMonth() === today.getMonth() &&
          expDate.getFullYear() === today.getFullYear()
        );
      }

      return true;
    });
  };

  const filteredExpenses = filterExpenses().sort((a, b) => new Date(a.date) - new Date(b.date));
  const total = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="min-h-screen">
      <Navbar activePage="expenses" />

      <div className="pt-[200px] px-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 ml-[10%]">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              height="32px" 
              viewBox="0 -960 960 960" 
              width="32px" 
              fill="#000000">
                <path d="M640-240v-80h104L536-526 376-366 80-664l56-56 240 240 160-160 264 264v-104h80v240H640Z"/></svg>
            <h2 className="text-[#D64545] font-bold text-2xl">
              รายจ่าย
            </h2>
          </div>
          <div className="flex justify-end mb-4">
            <div className="flex items-center gap-2">
              <span className="font-medium text-[#000000] text-[18px]">ดูสรุป :</span>
              <select
                className="border rounded-md px-3 py-1 shadow-sm bg-white text-[#000000]"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">ทั้งหมด</option>
                <option value="today">วันนี้</option>
                <option value="week">สัปดาห์นี้</option>
                <option value="month">เดือนนี้</option>
              </select>
            </div>
          </div>
        </div>
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => openModal()}
            className="bg-[#C49A6C] h-[60px] w-[200px] flex justify-center items-center rounded-[10px] font-bold text-white gap-[10px] text-[26px] cursor-pointer"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              height="32px" 
              viewBox="0 -960 960 960" 
              width="32px" 
              fill="#FFFFFF">
                <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
            </svg>
            เพิ่มรายจ่าย
          </button>
        </div>
        {filteredExpenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="border-collapse w-full text-center text-black">
              <thead>
                <tr className="bg-[#F79C4B] text-white">
                  <th className="border border-black px-4 py-2">วันที่</th>
                  <th className="border border-black px-4 py-2">รายละเอียด</th>
                  <th className="border border-black px-4 py-2">จำนวนเงิน</th>
                  <th className="border border-black px-4 py-2">หมวดหมู่</th>
                  <th className="border border-black px-4 py-2">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((exp, index) => {
                  const originalIndex = expenses.indexOf(exp);
                  return (
                    <tr key={index}>
                      <td className="border px-4 py-2">{formatDate(exp.date)}</td>
                      <td className="border px-4 py-2">{exp.detail}</td>
                      <td className="border px-4 py-2 text-[#000000]">
                        <span className="text-[#D64545] font-bold text-xl">-</span>
                        {exp.amount} บาท
                      </td>
                      <td className="border px-4 py-2">{exp.category}</td>
                      <td className="border border-black px-1 py-2">
                        <div className="flex justify-center items-center gap-5">
                          <button
                            onClick={() => openModal(originalIndex)}
                            className="cursor-pointer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px"
                              viewBox="0 -960 960 960" width="24px" fill="#B5B3B3">
                              <path d="M80 0v-160h800V0H80Zm160-320h56l312-311-29-29-28-28-311 312v56Zm-80 
                                80v-170l448-447q11-11 25.5-17t30.5-6q16 0 31 
                                6t27 18l55 56q12 11 17.5 26t5.5 31q0 
                                15-5.5 29.5T777-687L330-240H160Zm560-504-56-56 
                                56 56ZM608-631l-29-29-28-28 57 57Z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(originalIndex)}
                            className="cursor-pointer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px"
                              viewBox="0 -960 960 960" width="24px" fill="#D64545">
                              <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520
                                q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 
                                0h80v-360h-80v360ZM280-720v520-520Z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-2xl font-bold text-[#D64545] mt-10">
            ไม่มีข้อมูลรายจ่าย
          </p>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 flex justify-center items-start z-50 p-[120px] backdrop-blur-sm bg-white/30 overflow-auto">
            <div className="bg-[#FFE8A3] rounded-2xl p-8 w-[500px] max-w-[90%] shadow-xl border border-[#E0C78F]">
              <h2 className="text-2xl font-bold mb-6 text-[#715045] text-center">
                {editingExpense ? "แก้ไขรายจ่าย" : "เพิ่มรายจ่าย"}
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <label htmlFor="menuCode" className="font-bold text-[#715045] text-lg mb-1">
                    วันที่
                  </label>
                    <input
                      type="date"
                      name="date"
                      defaultValue={editingExpense ? editingExpense.date : ""}
                      className="border border-[#715045] bg-white text-black p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#C49A6C]"
                    />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="menuCode" className="font-bold text-[#715045] text-lg mb-1">
                    รายละเอียด
                  </label>
                  <input
                    type="text"
                    name="detail"
                    defaultValue={editingExpense ? editingExpense.detail : ""}
                    placeholder="รายละเอียด"
                    className="border border-[#715045] bg-white text-black p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#C49A6C]"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="menuCode" className="font-bold text-[#715045] text-lg mb-1">
                    จำนวนเงิน [บาท]
                  </label>
                  <input
                    type="number"
                    name="amount"
                    defaultValue={editingExpense ? editingExpense.amount : ""}
                    placeholder="จำนวนเงิน"
                    className="border border-[#715045] bg-white text-black p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#C49A6C]"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="menuCode" className="font-bold text-[#715045] text-lg mb-1">
                    หมวดหมู่
                  </label>
                  <select
                    name="category"
                    defaultValue={editingExpense ? editingExpense.category : ""}
                    className="border border-[#715045] rounded-md p-2 shadow-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#C49A6C]"
                  >
                    <option value="" disabled hidden>หมวดหมู่</option>
                    <option value="วัตถุดิบ">วัตถุดิบ</option>
                    <option value="ค่าแรง">ค่าแรง</option>
                    <option value="ค่าใช้จ่ายทั่วไป">ค่าใช้จ่ายทั่วไป</option>
                  </select>
                </div>
                <div className="flex justify-center gap-5">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#8D6E63] text-white rounded"
                  >
                    บันทึก
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 bg-[#D64545] text-white rounded"
                  >
                    ยกเลิก
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
