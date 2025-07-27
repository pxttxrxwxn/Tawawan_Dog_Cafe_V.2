import { promises as fs } from "fs";
import path from "path";

export async function POST(request) {
  try {
    const data = await request.json();

    const filePath = path.join(process.cwd(), "data", "register-data.json");

    let existingData = [];
    try {
      const fileContents = await fs.readFile(filePath, "utf-8");
      existingData = JSON.parse(fileContents);
    } catch (err) {
      existingData = [];
    }

    const emailExists = existingData.some(
      (item) => item.email.toLowerCase() === data.email.toLowerCase()
    );

    if (emailExists) {
      return new Response(
        JSON.stringify({ message: "อีเมลนี้ถูกใช้งานแล้ว" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    existingData.push(data);

    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));

    return new Response(JSON.stringify({ message: "บันทึกข้อมูลสำเร็จ" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "เกิดข้อผิดพลาด", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
