import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "register-data.json");

export default function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: "ข้อมูลไม่ครบ" });
      }

      let users = [];
      if (fs.existsSync(filePath)) {
        users = JSON.parse(fs.readFileSync(filePath, "utf8"));
      }

      if (users.some(u => u.email === email)) {
        return res.status(400).json({ message: "อีเมลนี้ถูกใช้แล้ว" });
      }

      users.push({ name, email, password });
      fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

      return res.status(201).json({ message: "สมัครสมาชิกสำเร็จ" });
    } catch (error) {
      return res.status(500).json({ message: "เกิดข้อผิดพลาด" });
    }
  }

  if (req.method === "GET") {
    try {
      const email = req.query.email || "";
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ name: "ไม่พบชื่อผู้ใช้" });
      }

      const users = JSON.parse(fs.readFileSync(filePath, "utf8"));
      const user = users.find(u => u.email === email);

      if (user) {
        return res.status(200).json({ name: user.name });
      } else {
        return res.status(404).json({ name: "ไม่พบชื่อผู้ใช้" });
      }
    } catch (error) {
      return res.status(500).json({ name: "เกิดข้อผิดพลาด" });
    }
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
