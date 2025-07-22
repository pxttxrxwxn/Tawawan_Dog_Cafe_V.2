"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import Link from "next/link"

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-[650px] rounded-[40px] py-10 px-8 flex flex-col items-center shadow-md">
        <div className="relative w-[150px] h-[150px]">
          <Image src="/logo.png" alt="Logo" fill style={{ objectFit: 'contain' }} />
        </div>
        <h1 className="text-[32px] font-Inter text-[#A1724E] mt-6 text-center">
          เข้าสู่ระบบเจ้าของร้าน
        </h1>
        <p className="text-xs text-[#D64545] font-Inter mt-1 underline">
          สำหรับเจ้าของร้านเท่านั้น
        </p>
        <form className="w-full mt-6 flex flex-col gap-4">
          <div className="relative z-10 w-full">
            <label htmlFor="email" className="text-sm font-Inter text-[#845C44]">
              อีเมล
            </label>
            <input
            type="email"
            id="email"
            placeholder="กรอกอีเมล"
            textfont="Inter"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-[#A1724E] px-4 py-2 placeholder-[#D1D1D1] focus:outline-none text-black font-Inter"
            />
          </div>
          <div className="relative w-full">
            <label htmlFor="password" className="text-sm font-Inter text-[#845C44] block mb-1">
              รหัสผ่าน
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="รหัสผ่าน"
              textfont="Inter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-[#A1724E] px-4 py-2 placeholder-[#D1D1D1] focus:outline-none text-black pr-10 font-Inter"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 inset-y-9 my-auto text-[#F17F1F] hover:text-[#d36f0d] focus:outline-none"
              aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
              tabIndex={-1}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                    <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/>
                    </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/></svg>
              )}
            </button>
          </div>

          <button
            type="submit"
            className="mt-4 w-full bg-[#8C6B5C] text-white py-3 rounded-md text-lg font-bold font-Inter hover:bg-[#7a5c4d] transition"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        <p className="mt-4 text-sm font-Inter text-[#715045]">
          ยังไม่มีบัญชี?{" "}
          <Link href="/owner/register" className="text-[#F17F1F] font-bold font-Inter hover:underline">
            สมัครบัญชี
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignIn