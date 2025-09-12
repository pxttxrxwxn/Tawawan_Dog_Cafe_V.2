"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPasswordCriteria, setShowPasswordCriteria] = useState(false);

  const router = useRouter();

  const passwordCriteria = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*]/.test(password),
  };

  const validateUsername = () => {
    if (!username.trim()) setUsernameError("กรุณากรอกชื่อผู้ใช้");
    else setUsernameError("");
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) setEmailError("กรุณากรอกอีเมล");
    else if (!emailRegex.test(email)) setEmailError("รูปแบบอีเมลไม่ถูกต้อง");
    else setEmailError("");
  };

  const validatePassword = () => {
    if (!password.trim()) {
      setPasswordError("กรุณากรอกรหัสผ่าน");
      setShowPasswordCriteria(true);
    } else if (
      !passwordCriteria.length ||
      !passwordCriteria.upper ||
      !passwordCriteria.lower ||
      !passwordCriteria.number ||
      !passwordCriteria.special
    ) {
      setPasswordError("รหัสผ่านไม่ตรงตามเงื่อนไข");
      setShowPasswordCriteria(true);
    } else {
      setPasswordError("");
      setShowPasswordCriteria(false);
    }
  };

  const validateConfirmPassword = () => {
    if (confirmPassword !== password) 
      {setConfirmPasswordError("รหัสผ่านไม่ตรงกัน");
      setShowPasswordCriteria(true);
      }
    else {
      setConfirmPasswordError("");
      setShowPasswordCriteria(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    validateUsername();
    validateEmail();
    validatePassword();
    validateConfirmPassword();

    if (
      usernameError ||
      emailError ||
      passwordError ||
      confirmPasswordError
    ) return;

    try {
      const response = await fetch("/api/owner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "register", username, email, password }),
      });

      const resData = await response.json();

      if (response.ok) {
        alert("สมัครสำเร็จ! กำลังไปหน้าเข้าสู่ระบบ");
        router.push("/owner/sign_in");
      } else {
        if (resData.message === "อีเมลนี้ถูกใช้งานแล้ว") {
          setEmailError("อีเมลนี้ถูกใช้งานแล้ว");
        } else {
          alert("เกิดข้อผิดพลาด: " + (resData.error || "ไม่สามารถบันทึกข้อมูลได้"));
        }
      }
    } catch (error) {
      alert("เกิดข้อผิดพลาด: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-between">
      <div className="flex flex-col items-left justify-center h-screen ml-[3%] mr-[3%]">
        <Image src="/logo.png" alt="Logo" width={704.29} height={606} />
      </div>
      <div className="bg-[#FFE8A3] h-screen w-[60%] flex flex-col items-right rounded-l-[100px]">
        <div className="flex flex-col justify-center items-center h-screen space-y-[5px]">
          <h1 className="text-[#715045] font-Inter font-bold text-[60px]">สมัครบัญชี</h1>
          <form className="w-full mt-6 flex flex-col gap-4 px-[10%]" onSubmit={handleSubmit}>
            <div className="relative z-10 w-full">
              <label htmlFor="username" className="font-Inter text-[#715045] text-[20px]">
                ชื่อผู้ใช้
              </label>
              <input
                type="text"
                id="username"
                placeholder="ชื่อผู้ใช้งาน"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={validateUsername}
                onBlur={validateUsername}
                className={`mt-1 w-full rounded-md border px-4 py-2 placeholder-[#DDDDDD] bg-white focus:outline-none text-black font-Inter 
                  ${usernameError ? "border-red-500" : "border-[#A1724E]"}`}
              />
              {usernameError && <p className="text-xs text-red-500 mt-1">{usernameError}</p>}
            </div>

            <div className="relative z-10 w-full">
              <label htmlFor="email" className="text-[20px] font-Inter text-[#715045]">
                อีเมล
              </label>
              <input
                type="email"
                id="email"
                placeholder="tawawandogcafe@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={validateEmail}
                onBlur={validateEmail}
                className={`mt-1 w-full rounded-md border px-4 py-2 placeholder-[#DDDDDD] bg-white focus:outline-none text-black font-Inter 
                  ${emailError ? "border-red-500" : "border-[#A1724E]"}`}
              />
              {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
            </div>

            <div className="w-full">
            <label htmlFor="password" className="text-[18px] font-Inter text-[#715045] block mb-1">
              รหัสผ่าน ({password.length} ตัวอักษร)
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="รหัสผ่าน"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={validatePassword}
                onBlur={validatePassword}
                className={`mt-1 w-full rounded-md border px-4 py-2 placeholder-[#DDDDDD] bg-white focus:outline-none text-black pr-10 font-Inter 
                  ${passwordError ? "border-red-500" : "border-[#A1724E]"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F17F1F] hover:text-[#d36f0d] focus:outline-none"
                aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#000000"><path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Z"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#000000"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/></svg>
                )}
              </button>
            </div>

            {passwordError && <p className="text-xs text-red-500 mt-1">{passwordError}</p>}

            {showPasswordCriteria && (
              <div className="text-[16px] mt-2 space-y-1 text-[#845C44]">
                <p className={passwordCriteria.length ? "text-green-600" : "text-red-500"}>
                  {passwordCriteria.length ? "✔️" : "❌"} รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร
                </p>
                <p className={passwordCriteria.upper ? "text-green-600" : "text-red-500"}>
                  {passwordCriteria.upper ? "✔️" : "❌"} ตัวพิมพ์ใหญ่ A-Z อย่างน้อย 1 ตัว
                </p>
                <p className={passwordCriteria.lower ? "text-green-600" : "text-red-500"}>
                  {passwordCriteria.lower ? "✔️" : "❌"} ตัวพิมพ์เล็ก a-z อย่างน้อย 1 ตัว
                </p>
                <p className={passwordCriteria.number ? "text-green-600" : "text-red-500"}>
                  {passwordCriteria.number ? "✔️" : "❌"} ตัวเลข 0-9 อย่างน้อย 1 ตัว
                </p>
                <p className={passwordCriteria.special ? "text-green-600" : "text-red-500"}>
                  {passwordCriteria.special ? "✔️" : "❌"} สัญลักษณ์พิเศษ !@#$%^&* อย่างน้อย 1 ตัว
                </p>
              </div>
            )}
          </div>

          <div className="relative w-full">
            <label htmlFor="confirmPassword" className="text-[18px] font-Inter text-[#715045] block mb-1">
              ยืนยันรหัสผ่าน({confirmPassword.length} ตัวอักษร)
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="ยืนยันรหัสผ่าน"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={validateConfirmPassword}
                onBlur={validateConfirmPassword}
                className={`mt-1 w-full rounded-md border px-4 py-2 placeholder-[#DDDDDD] bg-white focus:outline-none text-black pr-10 font-Inter 
                  ${confirmPasswordError ? "border-red-500" : "border-[#A1724E]"}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F17F1F] hover:text-[#d36f0d] focus:outline-none"
                aria-label={showConfirmPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#000000">
                    <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Z"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#000000">
                    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/>
                  </svg>
                )}
              </button>
            </div>
            {confirmPasswordError && (
              <p className="text-xs text-red-500 mt-1">{confirmPasswordError}</p>
            )}
          </div>
            <button
              type="submit"
              className="bg-[#D64545] text-white text-[35px] font-bold font-[Inter] py-2 rounded-md hover:bg-[#8D5E3F] mt-4 mx-auto w-[450px] h-[70px]"
            >
              สร้างบัญชี
            </button>
          </form>
          <p className="mt-4 text-[16px] font-Inter text-[#715045]">
            มีบัญชีอยู่แล้ว?{" "}
              <Link href="/owner/sign_in" className="text-[#F4A261] font-bold font-Inter underline">
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
