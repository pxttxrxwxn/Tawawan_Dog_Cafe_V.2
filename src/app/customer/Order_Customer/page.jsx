"use client";
import React from "react";
import PromptPayQR from "../../components/PromptPayQR";
import Nabarorder from "../../components/Navbarorder";

export default function Order_Customer() {
    return (
        <div>
            <Nabarorder activePage="1" />
            <div className="mt-[187px]">
                <PromptPayQR />
            </div>
        </div>
    );
}