import fs from "fs/promises";
import path from "path";

export const config = { api: { bodyParser: false } };

const imageDir = path.join(process.cwd(), "public/images/menus");

export async function POST(req) {
  await fs.mkdir(imageDir, { recursive: true });

  const formData = await req.formData();
  const file = formData.get("image");

  if (!file) return new Response(JSON.stringify({ error: "No file" }), { status: 400 });

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(imageDir, fileName);

  await fs.writeFile(filePath, buffer);

  return new Response(JSON.stringify({ path: `/images/menus/${fileName}` }), { status: 200 });
}
