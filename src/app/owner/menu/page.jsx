"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";

export default function Menu() {
  const [menus, setMenus] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [drinkTypes, setDrinkTypes] = useState({
    ร้อน: { checked: false, price: "" },
    เย็น: { checked: false, price: "" },
    ปั่น: { checked: false, price: "" },
  });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [menuDesc, setMenuDesc] = useState("");

  const editingMenu =
    editingIndex !== null && menus[editingIndex] ? menus[editingIndex] : null;

  useEffect(() => {
    if (editingMenu) {
      setMenuDesc(editingMenu.MenuDetail || "");
      setSelectedCategory(editingMenu.CategoryMenu || "");
      if (editingMenu.CategoryMenu === "เครื่องดื่ม") {
        setDrinkTypes({
          ร้อน: editingMenu.Type?.ร้อน || { checked: false, price: "" },
          เย็น: editingMenu.Type?.เย็น || { checked: false, price: "" },
          ปั่น: editingMenu.Type?.ปั่น || { checked: false, price: "" },
        });
      }
    } else {
      setMenuDesc("");
      setSelectedCategory("");
      setDrinkTypes({
        ร้อน: { checked: false, price: "" },
        เย็น: { checked: false, price: "" },
        ปั่น: { checked: false, price: "" },
      });
    }
  }, [editingMenu]);

  const openModal = (index = null) => {
    setEditingIndex(index);
    setIsModalOpen(true);
    if (index !== null) {
      setSelectedCategory(menus[index].CategoryMenu);
      if (menus[index].CategoryMenu === "เครื่องดื่ม") {
        setDrinkTypes({
          ร้อน: menus[index].Type?.ร้อน || { checked: false, price: "" },
          เย็น: menus[index].Type?.เย็น || { checked: false, price: "" },
          ปั่น: menus[index].Type?.ปั่น || { checked: false, price: "" },
        });
      }
    }
  };

  const closeModal = () => {
    setEditingIndex(null);
    setIsModalOpen(false);
    setDrinkTypes({
      ร้อน: { checked: false, price: "" },
      เย็น: { checked: false, price: "" },
      ปั่น: { checked: false, price: "" },
    });
    setSelectedCategory("");
    setMenuDesc("");
  };

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await fetch("/api/menus");
        const data = await res.json();
        setMenus(data);
      } catch (err) {
        console.error("Error fetching menus:", err);
      }
    };
    fetchMenus();
  }, []);

  const handleDrinkTypeChange = (type, field, value) => {
    setDrinkTypes((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: field === "checked" ? value : value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const ownerID = localStorage.getItem("OwnerID") || "";
    const newCode = form.menuCode.value.trim();

    const isDuplicate = menus.some(
      (menu) =>
        menu.MenuID === newCode && (!editingMenu || menu.MenuID !== editingMenu.MenuID)
    );
    if (isDuplicate) {
      alert("รหัสเมนูนี้ถูกใช้งานแล้ว กรุณาใช้รหัสเมนูอื่น");
      return;
    }

    if (!form.menuCategory.value) {
      alert("กรุณาเลือกหมวดหมู่");
      return;
    }

    if (form.menuCategory.value === "เครื่องดื่ม") {
      const hasSelected = Object.values(drinkTypes).some((t) => t.checked);
      if (!hasSelected) {
        alert("กรุณาเลือกประเภทและกรอกราคาอย่างน้อย 1 ประเภท");
        return;
      }
    }

    if (!editingMenu && !form.menuImage.files[0]) {
      alert("กรุณาใส่รูปเมนู");
      return;
    }

    const originalCode = editingMenu ? editingMenu.MenuID : null;
    const basePrice = Number(form.menuPrice.value) || 0;

    const newMenu = {
      OwnerID: ownerID,
      MenuID: form.menuCode.value,
      MenuName: form.menuName.value,
      CategoryMenu: form.menuCategory.value,
      Type:
        form.menuCategory.value === "เครื่องดื่ม"
          ? Object.fromEntries(
              Object.entries(drinkTypes).map(([t, data]) => [
                t,
                { checked: data.checked, price: data.checked ? Number(data.price) || 0 : 0 },
              ])
            )
          : form.menuType?.value || "",
      Price:
        form.menuCategory.value === "เครื่องดื่ม"
          ? basePrice
          : Number(form.menuPrice.value) || 0,
      MenuDetail: menuDesc,
    };

    const formData = new FormData();
    formData.append("OwnerID", ownerID);
    formData.append("originalCode", originalCode || "");
    formData.append("code", newMenu.MenuID);
    formData.append("name", newMenu.MenuName);
    formData.append("category", newMenu.CategoryMenu);
    formData.append("type", JSON.stringify(newMenu.Type));
    formData.append("price", newMenu.Price);
    formData.append("desc", newMenu.MenuDetail);
    if (form.menuImage.files[0]) {
      formData.append("image", form.menuImage.files[0]);
    }

    const fetchMenus = async () => {
      try {
        const res = await fetch("/api/menus");
        const data = await res.json();
        setMenus(data);
      } catch (err) {
        console.error(err);
      }
    };

    try {
      const file = form.menuImage.files[0];
      if (editingMenu) {
        await fetch("/api/menus", { method: "PUT", body: formData });
        setMenus((prev) =>
          prev.map((m) =>
            m.MenuID === originalCode
              ? { ...newMenu, ImagePath: file ? URL.createObjectURL(file) : m.ImagePath }
              : m
          )
        );
      } else {
        await fetch("/api/menus", { method: "POST", body: formData });
        setMenus((prev) => [
          ...prev,
          { ...newMenu, ImagePath: file ? URL.createObjectURL(file) : "" },
        ]);
      }
      await fetchMenus();
    } catch (err) {
      console.error(err);
    }

    form.reset();
    setMenuDesc("");
    setSelectedCategory("");
    setDrinkTypes({
      ร้อน: { checked: false, price: "" },
      เย็น: { checked: false, price: "" },
      ปั่น: { checked: false, price: "" },
    });
    setEditingIndex(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (menuID) => {
    try {
      await fetch(`/api/menus?code=${menuID}`, { method: "DELETE" });
      setMenus((prev) => prev.filter((m) => m.MenuID !== menuID));
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="min-h-screen">
      <Navbar activePage="menu" />

      <div className="pt-[180px] px-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              height="32px" 
              viewBox="0 -960 960 960" 
              width="32px" 
              fill="#000000">
                <path d="M300-80q-58 0-99-41t-41-99v-520q0-58 41-99t99-41h500v600q-25 0-42.5 17.5T740-220q0 25 17.5 42.5T800-160v80H300Zm-60-267q14-7 29-10t31-3h20v-440h-20q-25 0-42.5 17.5T240-740v393Zm160-13h320v-440H400v440Zm-160 13v-453 453Zm60 187h373q-6-14-9.5-28.5T660-220q0-16 3-31t10-29H300q-26 0-43 17.5T240-220q0 26 17 43t43 17Z"/>
            </svg>
            <h2 className="text-[#D64545] font-bold text-[32px]">
              เมนูที่มีอยู่ในร้าน
            </h2>
          </div>
          <button 
            onClick={() => openModal()}
            className="bg-[#C49A6C] h-[60px] w-[180px] flex justify-center items-center rounded-[10px] font-bold text-white gap-[10px] text-[26px] cursor-pointer">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              height="32px" 
              viewBox="0 -960 960 960" 
              width="32px" 
              fill="#FFFFFF">
                <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
            </svg>
            เพิ่มเมนู
          </button>
        </div>

        {menus.length > 0 && (
          <div className="overflow-x-auto flex justify-center mb-10">
            <table className="border-collapse w-[95%] text-center text-black mb-2">
              <thead>
                <tr className="bg-[#F79C4B] text-white">
                  <th className="border border-black px-4 py-2">รูป</th>
                  <th className="border border-black px-4 py-2">รหัสเมนู</th>
                  <th className="border border-black px-4 py-2">ชื่อเมนู</th>
                  <th className="border border-black px-4 py-2">ประเภท</th>
                  <th className="border border-black px-4 py-2">รูปแบบ</th>
                  <th className="border border-black px-4 py-2">ราคา</th>
                  <th className="border border-black px-4 py-2">คำอธิบาย</th>
                  <th className="border border-black px-4 py-2">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {menus.map((menu, index) => (
                  <tr key={index} className="bg-white">
                    <td className="border border-black px-4 py-2 text-center ">
                      {menu.ImagePath ? <img src={menu.ImagePath} alt={menu.MenuName} className="w-[80px] h-[80px] object-cover mx-auto" /> : "-"}
                    </td>
                    <td className="border border-black px-4 py-2">{menu.MenuID}</td>
                    <td className="border border-black px-4 py-2">{menu.MenuName}</td>
                    <td className="border border-black px-4 py-2">{menu.CategoryMenu}</td>
                    <td className="border border-black px-4 py-2">
                      {menu.CategoryMenu === "เครื่องดื่ม" && typeof menu.Type  === "object"
                        ? Object.entries(menu.Type )
                            .filter(([_, data]) => data.checked)
                            .map(([type, data]) => `${type} + ${data.price} `)
                            .join(", ")
                        : menu.Type  || "-"}
                    </td>
                    <td className="border border-black px-4 py-2">
                      {menu.Price ? `${menu.Price} ฿` : "-"}
                    </td>
                    <td className="border border-black px-4 py-2">{menu.MenuDetail}</td>
                    <td className="border border-black px-1 py-2">
                      <div className="flex justify-center items-center gap-5">
                        <button onClick={() => openModal(index)} className="cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#B5B3B3">
                            <path d="M80 0v-160h800V0H80Zm160-320h56l312-311-29-29-28-28-311 312v56Zm-80 80v-170l448-447q11-11 25.5-17t30.5-6q16 0 31 6t27 18l55 56q12 11 17.5 26t5.5 31q0 15-5.5 29.5T777-687L330-240H160Zm560-504-56-56 56 56ZM608-631l-29-29-28-28 57 57Z"/>
                          </svg>
                        </button>
                        <button onClick={() => handleDelete(menu.MenuID)} className="cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#de3c3c">
                            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-start z-50 p-[120px] backdrop-blur-sm bg-white/30 overflow-auto">
          <div className="bg-[#FFE8A3] rounded-2xl p-8 w-[500px] max-w-[90%] shadow-xl border border-[#E0C78F]">
            <h2 className="text-2xl font-bold mb-6 text-[#715045] text-center">
              {editingMenu ? "แก้ไขเมนู" : "เพิ่มเมนูใหม่"}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              <div className="flex flex-col">
                <label htmlFor="menuCode" className="font-bold text-[#715045] text-lg mb-1">
                  รหัสเมนู
                </label>
                <input
                  type="text"
                  id="menuCode"
                  name="menuCode"
                  defaultValue={editingMenu ? editingMenu.MenuID : ""}
                  placeholder="เช่น M002"
                  className="border border-[#715045] bg-white text-black p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#C49A6C]"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="menuName" className="font-bold text-[#715045] text-lg mb-1">
                  ชื่อเมนู
                </label>
                <input
                  type="text"
                  id="menuName"
                  defaultValue={editingMenu ? editingMenu.MenuName : ""}
                  placeholder="เช่น ลาเต้เย็น"
                  className="border border-[#715045] bg-white text-black p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#C49A6C]"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="font-bold text-[#715045] text-lg mb-1">หมวดหมู่</label>
                <select
                  name="menuCategory"
                  defaultValue={editingMenu ? editingMenu.category : ""}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-[#715045] rounded-md p-2 shadow-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#C49A6C]"
                >
                  <option value="" disabled hidden>หมวดหมู่</option>
                  <option>เครื่องดื่ม</option>
                  <option>ขนมหวาน</option>
                  <option>อาหารทานเล่น</option>
                </select>
              </div>

              {selectedCategory === "เครื่องดื่ม" && (
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-[#715045] text-lg mb-1">ราคาที่ลูกค้าต้องจ่ายเพิ่ม</label>
                  <div className="flex flex-row items-center gap-4">
                    {["ร้อน", "เย็น", "ปั่น"].map((type) => (
                      <div key={type} className="flex items-center gap-2">
                        <input
                          className="w-4 h-4 accent-[#0FA958]"
                          type="checkbox"
                          checked={drinkTypes[type].checked}
                          onChange={(e) => handleDrinkTypeChange(type, "checked", e.target.checked)}
                        />
                        <span
                          className={
                            type === "ร้อน" ? "text-[#000000]" :
                            type === "เย็น" ? "text-[#000000]" :
                            type === "ปั่น" ? "text-[#000000]" :
                            "text-[#000000]"
                          }
                        >
                          {type}
                        </span>
                        <input
                          type="number"
                          value={drinkTypes[type].price}
                          onChange={(e) => handleDrinkTypeChange(type, "price", e.target.value)}
                          className="border p-1 rounded w-15 text-black bg-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-col">
                <label htmlFor="menuPrice" className="font-bold text-[#715045] text-lg mb-1">
                  ราคาเริ่มต้น
                </label>
                <input
                  type="number"
                  id="menuPrice"
                  defaultValue={editingMenu ? editingMenu.Price : ""}
                  placeholder="เช่น 45"
                  className="border border-[#715045] bg-white text-black p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#C49A6C]"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="menuImage" className="font-bold text-[#715045] text-lg mb-1">
                  รูปเมนู
                </label>
                <input
                  type="file"
                  id="menuImage"
                  accept="image/*"
                  className="file:bg-[#C49A6C] file:text-white text-black file:border-none file:rounded file:px-3 file:py-1 file:cursor-pointer"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="menuDesc" className="font-bold text-[#715045] text-lg mb-1">
                  คำอธิบายเพิ่มเติม({menuDesc.length} / 40 ตัวอักษร)
                </label>
                <textarea
                  id="menuDesc"
                  value={menuDesc}
                  onChange={(e) => setMenuDesc(e.target.value)}
                  placeholder="บอกลักษณะของเมนู..."
                  className="border border-[#715045] bg-white text-black p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#C49A6C]"
                  rows={4}
                  maxLength={40}
                ></textarea>
              </div>

              <div className="flex justify-center gap-5 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-10 py-3 text-[22px] bg-[#D64545] text-[#ffffff] rounded transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-11 py-3 text-[22px] bg-[#8D6E63] text-white rounded transition"
                >
                  {editingMenu ? "บันทึก" : "บันทึก"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
