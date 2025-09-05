import { promises as fs } from "fs";
import path from "path";

export async function POST(req) {
  const newOrder = await req.json();

  const filePath = path.join(process.cwd(), "data", "order.json");
  let orders = [];

  try {
    const data = await fs.readFile(filePath, "utf-8");
    orders = JSON.parse(data);
  } catch (err) {
    orders = [];
  }

  orders.push(newOrder);

  await fs.writeFile(filePath, JSON.stringify(orders, null, 2));

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
