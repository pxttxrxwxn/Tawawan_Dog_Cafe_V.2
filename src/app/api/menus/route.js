import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "menus.json");

export async function GET() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const menus = JSON.parse(data);
    return new Response(JSON.stringify(menus), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "ไม่สามารถอ่านข้อมูลได้" }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const newMenu = await req.json();
    const data = await fs.readFile(filePath, "utf-8");
    const menus = JSON.parse(data);

    menus.push(newMenu);
    await fs.writeFile(filePath, JSON.stringify(menus, null, 2));

    return new Response(JSON.stringify(newMenu), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "ไม่สามารถบันทึกข้อมูลได้" }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const updatedMenu = await req.json();
    const data = await fs.readFile(filePath, "utf-8");
    const menus = JSON.parse(data);

    const index = menus.findIndex(m => m.code === updatedMenu.code);
    if (index !== -1) {
      menus[index] = updatedMenu;
      await fs.writeFile(filePath, JSON.stringify(menus, null, 2));
      return new Response(JSON.stringify(updatedMenu), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: "ไม่พบเมนู" }), { status: 404 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: "ไม่สามารถแก้ไขข้อมูลได้" }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    const data = await fs.readFile(filePath, "utf-8");
    let menus = JSON.parse(data);
    menus = menus.filter(m => m.code !== code);

    await fs.writeFile(filePath, JSON.stringify(menus, null, 2));
    return new Response(JSON.stringify({ message: "ลบเมนูเรียบร้อยแล้ว" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "ไม่สามารถลบข้อมูลได้" }), { status: 500 });
  }
}
