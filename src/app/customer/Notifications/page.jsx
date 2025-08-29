"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbarfood";

export default function Notifications() {
    return (
        <div className="min-h-screen">
            <Navbar/>
            <div className="pt-[220px] px-30">
                <div className="flex justify-between items-center mb-6">
                    
                        <h2 className="text-[#D64545] font-bold text-[36px] font-c">
                            การแจ้งเตือน
                        </h2>
                        <h5 className="text-[#000000] underline text-[24px]">
                            ลบการแจ้งเตือนทั้งหมด
                        </h5>
                    
                </div>
            </div>
        </div>
    );
}