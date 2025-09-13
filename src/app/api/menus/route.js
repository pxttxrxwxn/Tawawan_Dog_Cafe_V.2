import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

const dataFile = path.join(process.cwd(),"public", "data", "menus.json");
const uploadDir = path.join(process.cwd(), "public", "uploads");

async function readData() {
  try {
    const data = await fs.readFile(dataFile, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeData(data) {
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
}

export async function GET() {
  const menus = await readData();
  return NextResponse.json(menus);
}

export async function POST(req) {
  const formData = await req.formData();
  const menus = await readData();

  const ownerID = formData.get("OwnerID") || "";
  const code = formData.get("code");
  const name = formData.get("name");
  const category = formData.get("category");
  const type = formData.get("type") ? JSON.parse(formData.get("type")) : "";
  const price = formData.get("price");
  const desc = formData.get("desc");
  const file = formData.get("image");

  let imageUrl = null;
  if (file && file.name) {
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);
    imageUrl = `/uploads/${file.name}`;
  }

  const newMenu = { OwnerID: ownerID, code, name, category, type, price, desc, image: imageUrl };
  menus.push(newMenu);
  await writeData(menus);

  return NextResponse.json(newMenu);
}

export async function PUT(req) {
  const formData = await req.formData();
  const menus = await readData();

  const originalCode = formData.get("originalCode");
  const ownerID = formData.get("OwnerID") || "";
  const code = formData.get("code");
  const name = formData.get("name");
  const category = formData.get("category");
  const type = formData.get("type") ? JSON.parse(formData.get("type")) : "";
  const price = formData.get("price");
  const desc = formData.get("desc");
  const file = formData.get("image");

  const idx = menus.findIndex((m) => m.code === originalCode);
  if (idx === -1) {
    return NextResponse.json({ error: "Menu not found" }, { status: 404 });
  }

  let imageUrl = menus[idx].image;
  if (file && file.name) {
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);
    imageUrl = `/uploads/${file.name}`;
  }

  menus[idx] = { OwnerID: ownerID, code, name, category, type, price, desc, image: imageUrl };
  await writeData(menus);

  return NextResponse.json(menus[idx]);
}


export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  let menus = await readData();
  menus = menus.filter((m) => m.code !== code);
  await writeData(menus);

  return NextResponse.json({ success: true });
}
