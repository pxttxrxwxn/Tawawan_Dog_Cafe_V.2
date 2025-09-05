import { promises as fs } from "fs";
import path from "path";

const orderFilePath = path.join(process.cwd(), "data", "order.json");
const ownerFilePath = path.join(process.cwd(), "data", "order_owner.json");


async function readFile(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}


async function writeFile(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}


export async function POST(req) {
  const newOrder = await req.json();
  let orders = await readFile(orderFilePath);

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

  await writeFile(orderFilePath, orders);

  return new Response(JSON.stringify({ success: true, orders }), { status: 200 });
}


export async function DELETE(req) {
  const { all, tableNumber } = await req.json();
  let orders = await readFile(orderFilePath);

  if (all && orders.length > 0) {
    let ownerOrders = await readFile(ownerFilePath);

    // หาเลข order ล่าสุด
    let lastOrderNumber = ownerOrders.length
      ? ownerOrders[ownerOrders.length - 1].ordernumber
      : "O1000";

    // สร้าง ordernumber ใหม่
    let nextOrderNumber =
      "O" + (parseInt(lastOrderNumber.substring(1)) + 1).toString().padStart(4, "0");

    // รวมเมนูทั้งหมดใน object เดียว
    const newOrderGroup = {
      ordernumber: nextOrderNumber,
      tableNumber: tableNumber || "ไม่ระบุ",
      items: orders.map((item) => ({
        name: item.name,
        type: item.type,
        sugarLevel: item.sugarLevel,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
        note: item.note,
      })),
    };

    // เพิ่ม order group นี้ไป ownerOrders
    ownerOrders.push(newOrderGroup);

    // เขียนกลับไป owner file
    await writeFile(ownerFilePath, ownerOrders);

    // ล้าง order.json
    orders = [];
  }

  await writeFile(orderFilePath, orders);
  return new Response(JSON.stringify({ success: true, orders }), { status: 200 });
}

export async function GET() {
  const orders = await readFile(orderFilePath);
  return new Response(JSON.stringify(orders), { status: 200 });
}
