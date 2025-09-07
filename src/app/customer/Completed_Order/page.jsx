"use client";

import React, { useEffect } from "react";
import Nabarorder from "../../components/Navbarorder";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function CompletedOrder() {
  const router = useRouter();

  useEffect(() => {
    Swal.fire({
      title: "การชำระเงินสำเร็จ",
      text: "ขอบคุณที่สั่งซื้อ เรากำลังเตรียมสินค้าให้คุณ",
      icon: "success",
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
    }).then(() => {
      router.push("/customer/Notifications");
    });
  }, [router]);

  return (
    <div>
      <Nabarorder activePage="3" />
    </div>
  );
}
