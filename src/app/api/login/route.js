import { promises as fs } from "fs";
import path from "path";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const filePath = path.join(process.cwd(), "public", "data", "register-data.json");

    const fileContent = await fs.readFile(filePath, "utf-8");
    const users = JSON.parse(fileContent);

    const user = users.find(u => u.email === email);

    if (!user) {
      return new Response(JSON.stringify({ error: "ไม่พบอีเมลนี้ในระบบ" }), { status: 401 });
    }

    if (user.password !== password) {
      return new Response(JSON.stringify({ error: "รหัสผ่านไม่ถูกต้อง" }), { status: 401 });
    }

    return new Response(JSON.stringify({ message: "ล็อกอินสำเร็จ" }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
