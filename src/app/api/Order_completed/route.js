import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "public", "data");
const ownerFile = path.join(dataDir, "order.json");
const completedFile = path.join(dataDir, "order_completed.json");
const incomeFile = path.join(dataDir, "income.json");

export async function POST(req) {
  try {
    console.log("กูรันละ");

    const { ordernumber } = await req.json();
    console.log("รับ ordernumber:", ordernumber);

    const orders = JSON.parse(fs.readFileSync(ownerFile, "utf8") || "[]");
    const completed = JSON.parse(fs.readFileSync(completedFile, "utf8") || "[]");
    const income = JSON.parse(fs.readFileSync(incomeFile, "utf8") || "[]");

    const orderIndex = orders.findIndex((o) => o.ordernumber === ordernumber);
    if (orderIndex === -1) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const order = orders[orderIndex];

    const total = order.items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    order.total = total;

    orders.splice(orderIndex, 1);
    fs.writeFileSync(ownerFile, JSON.stringify(orders, null, 2), "utf8");

    completed.push(order);
    fs.writeFileSync(completedFile, JSON.stringify(completed, null, 2), "utf8");

    income.push(order);
    fs.writeFileSync(incomeFile, JSON.stringify(income, null, 2), "utf8");

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error("❌ API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
