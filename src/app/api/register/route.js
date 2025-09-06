import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(),"public", "data", "register-data.json");

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return new Response(JSON.stringify({ message: "ข้อมูลไม่ครบ" }), { status: 400 });
    }

    let users = [];
    if (fs.existsSync(filePath)) {
      users = JSON.parse(fs.readFileSync(filePath, "utf8"));
    }

    if (users.some(u => u.email === email)) {
      return new Response(JSON.stringify({ message: "อีเมลนี้ถูกใช้งานแล้ว" }), { status: 400 });
    }

    users.push({ username, email, password });
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

    return new Response(JSON.stringify({ message: "สมัครสมาชิกสำเร็จ" }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "เกิดข้อผิดพลาด" }), { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email") || "";

    if (!fs.existsSync(filePath)) {
      return new Response(JSON.stringify({ username: "ไม่พบชื่อผู้ใช้" }), { status: 404 });
    }

    const users = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const user = users.find(u => u.email === email);

    if (user) {
      return new Response(JSON.stringify({ username: user.username }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ username: "ไม่พบชื่อผู้ใช้" }), { status: 404 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ username: "เกิดข้อผิดพลาด" }), { status: 500 });
  }
}
