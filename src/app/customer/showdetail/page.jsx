"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbarfood";
import Image from "next/image";
import Link from "next/link"


export default function ListFood() {
  const [menus, setMenus] = useState([]);
  const [cart, setCart] = useState({}); 

  const handleSelectMenu = (Drinkmenu) => {
        localStorage.setItem("selectedMenu", Drinkmenu);
    };


  return(
    <div className="min-h-screen">
        <Navbar activePage="list_food" />
        

    </div>

  )
}
 

