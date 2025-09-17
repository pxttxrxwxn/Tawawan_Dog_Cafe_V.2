import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "public", "data", "owner.json");

async function readUsers() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeUsers(users) {
  await fs.writeFile(filePath, JSON.stringify(users, null, 2), "utf-8");
}

async function generateOwnerID(users) {
  if (users.length === 0) return "OW1001";
  const lastID = users[users.length - 1].OwnerID;
  const num = parseInt(lastID.replace("OW", "")) + 1;
  return "OW" + num.toString().padStart(4, "0");
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { action, Username, Email, PasswordHash } = body;

    if (!action) {
      return new Response(JSON.stringify({ error: "ต้องระบุ action (register หรือ login)" }), { status: 400 });
    }

    let users = await readUsers();

    if (action === "register") {
      if (!Username || !Email || !PasswordHash) {
        return new Response(JSON.stringify({ message: "ข้อมูลไม่ครบ" }), { status: 400 });
      }

      if (users.some((u) => u.Email.toLowerCase() === Email.toLowerCase())) {
        return new Response(JSON.stringify({ message: "อีเมลนี้ถูกใช้งานแล้ว" }), { status: 400 });
      }

      const OwnerID = await generateOwnerID(users);

      users.push({ OwnerID, Username, Email: Email.toLowerCase(), PasswordHash });
      await writeUsers(users);

      return new Response(JSON.stringify({ message: "สมัครสมาชิกสำเร็จ", OwnerID }), { status: 201 });
    }

    if (action === "login") {
      const user = users.find((u) => u.Email.toLowerCase() === Email.toLowerCase());

      if (!user) {
        return new Response(JSON.stringify({ error: "ไม่พบอีเมลนี้ในระบบ" }), { status: 401 });
      }

      if (user.PasswordHash !== PasswordHash) {
        return new Response(JSON.stringify({ error: "รหัสผ่านไม่ถูกต้อง" }), { status: 401 });
      }

      return new Response(JSON.stringify({ message: "ล็อกอินสำเร็จ",OwnerID: user.OwnerID  }), { status: 200 });
    }

    return new Response(JSON.stringify({ error: "action ไม่ถูกต้อง" }), { status: 400 });

  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "เกิดข้อผิดพลาด" }), { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const Email = searchParams.get("Email") || "";

    const users = await readUsers();
    const user = users.find((u) => u.Email === Email);

    if (user) {
      return new Response(JSON.stringify({ Username: user.Username }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ Username: "ไม่พบชื่อผู้ใช้" }), { status: 404 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ Username: "เกิดข้อผิดพลาด" }), { status: 500 });
  }
}