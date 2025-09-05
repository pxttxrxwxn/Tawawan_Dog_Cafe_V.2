import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "order.json");

async function readOrders() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

async function writeOrders(orders) {
  await fs.writeFile(filePath, JSON.stringify(orders, null, 2), "utf-8");
}


export async function POST(req) {
  const newOrder = await req.json();
  let orders = await readOrders();

  const index = orders.findIndex(
    (o) =>
      o.code === newOrder.code &&
      o.type === newOrder.type &&
      o.sugarLevel === newOrder.sugarLevel &&
      (newOrder.note ? o.note === newOrder.note : true)
  );

  if (index > -1) {
    orders[index].quantity += newOrder.quantity || 1;
    orders[index].totalPrice =
      (orders[index].basePrice + (orders[index].typePrice || 0)) *
      orders[index].quantity;
  } else {
    const basePrice = Number(newOrder.basePrice || newOrder.price || 0);
    const typePrice = Number(newOrder.typePrice || 0);
    const quantity = Number(newOrder.quantity || 1);
    const totalPrice = (basePrice + typePrice) * quantity;

    orders.push({
      ...newOrder,
      basePrice,
      typePrice,
      quantity,
      totalPrice,
    });
  }

  writeOrders(orders).catch((err) => console.error("เขียนไฟล์ order.json ไม่สำเร็จ:", err));

  return new Response(JSON.stringify({ success: true, orders }), { status: 200 });
}

export async function DELETE(req) {
  const { code, type, sugarLevel, note } = await req.json();
  let orders = await readOrders();

  const index = orders.findIndex(
    (o) =>
      o.code === code &&
      (type ? o.type === type : true) &&
      (sugarLevel ? o.sugarLevel === sugarLevel : true) &&
      (note ? o.note === note : true)
  );

  if (index > -1) {
    if (orders[index].quantity > 1) {
      orders[index].quantity -= 1;
      orders[index].totalPrice =
        (orders[index].basePrice + (orders[index].typePrice || 0)) *
        orders[index].quantity;
    } else {
      orders.splice(index, 1);
    }
  }

  await writeOrders(orders);

  return new Response(JSON.stringify({ success: true, orders }), {
    status: 200,
  });
}

export async function GET() {
  const orders = await readOrders();
  return new Response(JSON.stringify(orders), { status: 200 });
}
