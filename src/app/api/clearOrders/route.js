import fs from "fs";
import path from "path";

export async function POST(req, res) {
  try {
    const orderCompletedPath = path.join(process.cwd(), "public/data/Order_completed.json");
    fs.writeFileSync(orderCompletedPath, JSON.stringify([], null, 2), "utf8");

    return new Response(JSON.stringify({ message: "ล้าง Order_completed.json เรียบร้อยแล้ว!" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "เกิดข้อผิดพลาดในการล้างไฟล์" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
